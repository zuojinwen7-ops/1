"""Browser smoke tests. Run: python3 tests/test_site.py

Requires Python Playwright and /usr/bin/chromium; no app dependencies are needed.
The HTTP server binds loopback only and shuts down after this test run.
"""
import functools
import json
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import unittest

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
KEY = "shiji-cfa-v1"
TODAY = datetime(2026, 10, 23, 4, 0, tzinfo=timezone.utc)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class StudySiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 8766), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(
            executable_path="/usr/bin/chromium", args=["--no-sandbox"], headless=True
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1100})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=TODAY)
        self.page.goto("http://127.0.0.1:8766/")
        expect(self.page.locator(".hero")).to_be_visible()

    def tearDown(self):
        try:
            self.assertEqual(self.errors, [], "JavaScript runtime errors")
        finally:
            self.context.close()

    def action(self, action, **attrs):
        selector = f'[data-action="{action}"]'
        for key, value in attrs.items():
            selector += f'[data-{key}="{value}"]'
        self.page.locator(selector).first.click()

    def nav(self, name):
        self.page.locator(f'[data-nav="{name}"]').click()
        expect(self.page.locator(f'[data-nav="{name}"]')).to_have_attribute("aria-current", "page")

    def saved(self):
        return self.page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)

    def open_settings(self):
        self.action("settings")
        expect(self.page.locator("#settings-form")).to_be_visible()

    def current_question(self):
        en = self.page.locator(".question-en").inner_text()
        return self.page.evaluate(
            "en => window.STUDY_DATA.questions.find(q => (q.en || q.stem) === en)", en
        )

    def test_navigation_tasks_and_local_persistence(self):
        for page, locator in [
            ("plan", ".plan-day"), ("knowledge", ".knowledge-card"),
            ("practice", ".quiz-mode"), ("english", ".vocab-card"), ("today", ".hero"),
        ]:
            self.nav(page)
            expect(self.page.locator(locator).first).to_be_visible()
        expect(self.page.locator(".ring-number")).to_contain_text("19")
        self.page.locator("[data-task]").first.check()
        self.assertEqual(self.saved()["tasks"]["2026-10-23"], ["day-1-task-1"])
        self.page.reload()
        expect(self.page.locator("[data-task]").first).to_be_checked()
        self.nav("plan")
        self.assertEqual(self.page.locator(".plan-day").count(), 20)
        self.action("day", day="1")
        self.page.locator("#modal [data-task]").nth(1).check()
        expect(self.page.locator("#modal [data-task]").nth(1)).to_be_checked()

    def test_settings_and_mock_times_remain_realistic(self):
        self.open_settings()
        expect(self.page.locator("#exam-date")).to_have_value("2026-11-11")
        expect(self.page.locator("#study-hours")).to_have_value("4")
        self.page.locator("#exam-date").fill("2026-11-12")
        self.page.locator("#study-hours").select_option("2")
        self.page.locator("#settings-form button[type=submit]").click()
        self.assertEqual(self.saved()["hours"], 2)
        self.assertEqual(self.saved()["examDate"], "2026-11-12")
        self.page.reload()
        self.nav("plan")
        self.action("day", day="16")
        # Official sessions cannot become 68 minutes under a two-hour setting.
        expect(self.page.locator("#modal .filter-group")).to_contain_text("135 分钟")
        self.action("close")
        self.action("day", day="19")
        expect(self.page.locator("#modal")).to_contain_text("1 小时 30 分钟")

    def test_shifted_exam_date_preserves_but_does_not_miscount_tasks(self):
        self.nav("plan")
        self.action("day", day="2")
        for task in ["day-2-task-1", "day-2-task-2", "day-2-task-3"]:
            self.page.locator(f'#modal [data-task="{task}"]').check()
        self.action("close")
        self.assertEqual(len(self.saved()["tasks"]["2026-10-24"]), 3)
        self.open_settings()
        self.page.locator("#exam-date").fill("2026-11-12")
        self.page.locator("#settings-form button[type=submit]").click()
        # The old day 2 and new day 1 share Oct24, but have distinct task identities.
        self.action("day", day="1")
        expect(self.page.locator("#modal input:checked")).to_have_count(0)
        self.action("close")
        self.page.reload()
        self.action("day", day="1")
        expect(self.page.locator("#modal input:checked")).to_have_count(0)
        # Even after a new day1 task is added, old day2 records must survive reload.
        self.page.locator('#modal [data-task="day-1-task-1"]').check()
        self.action("close")
        self.page.reload()
        self.assertEqual(len(self.saved()["tasks"]["2026-10-24"]), 4)
        self.open_settings()
        self.page.locator("#exam-date").fill("2026-11-11")
        self.page.locator("#settings-form button[type=submit]").click()
        self.action("day", day="2")
        expect(self.page.locator("#modal input:checked")).to_have_count(3)

    def test_quiz_wrong_answer_cause_note_and_repair(self):
        self.nav("practice")
        self.action("quiz", mode="diagnostic")
        expect(self.page.locator('[data-action="submit-answer"]')).to_be_disabled()
        q = self.current_question()
        self.action("toggle-chinese")
        expect(self.page.locator(".question-zh")).to_be_hidden()
        self.action("option", index=str((q["answer"] + 1) % 3))
        self.action("submit-answer")
        expect(self.page.locator(".answer-explanation.wrong")).to_be_visible()
        self.action("cause", cause="english")
        self.page.locator("[data-question-note]").fill("没看见 least likely，下次圈反向词。")
        self.page.clock.run_for(400)
        self.action("exit-quiz")
        expect(self.page.locator(".wrong-item")).to_have_count(1)
        expect(self.page.locator(".wrong-item")).to_contain_text("英文没读懂")
        expect(self.page.locator(".wrong-item")).to_contain_text("下次圈反向词")
        self.action("single-quiz", id=q["id"])
        self.action("option", index=str(q["answer"]))
        self.action("submit-answer")
        expect(self.page.locator(".answer-explanation:not(.wrong)")).to_be_visible()
        self.action("next-question")
        expect(self.page.locator(".score-ring strong")).to_have_text("1/1")
        self.action("exit-quiz")
        expect(self.page.locator(".wrong-item")).to_have_count(0)
        self.assertEqual(self.saved()["questionNotes"][q["id"]], "没看见 least likely，下次圈反向词。")
        self.assertEqual(self.saved()["questionReview"][q["id"]]["due"], "2026-10-24")

    def test_lessons_notes_recall_and_search(self):
        self.nav("knowledge")
        self.page.locator("#knowledge-search").fill("财务")
        expect(self.page.locator(".knowledge-card")).to_have_count(1)
        self.action("topic", id="fsa")
        self.page.locator("[data-note]").fill("利润不是现金流。<b>这应是文字</b>")
        self.page.clock.run_for(400)
        self.action("learned", id="fsa")
        self.assertEqual(self.saved()["reviewed"]["fsa"]["due"], "2026-10-24")
        self.page.reload()
        self.action("topic", id="fsa")
        expect(self.page.locator("[data-note]")).to_have_value("利润不是现金流。<b>这应是文字</b>")
        self.assertEqual(self.page.locator(".lesson textarea b").count(), 0)

    def test_beginner_sections_and_self_check_are_recall_first(self):
        self.nav("knowledge")
        self.action("topic", id="quant")
        self.assertGreaterEqual(self.page.locator(".teaching-section").count(), 3)
        self.assertGreaterEqual(self.page.locator(".pitfalls p").count(), 2)
        expect(self.page.locator(".self-check > p")).to_contain_text("200")
        answer = self.page.locator(".self-check details > p")
        expect(answer).to_be_hidden()
        self.page.locator(".self-check summary").click()
        expect(answer).to_be_visible()
        expect(answer).to_contain_text("242")

    def test_vocabulary_spacing_and_next_day_due(self):
        self.nav("english")
        self.action("reveal", id="v-1")
        expect(self.page.locator(".vocab-card").first.locator(".zh")).to_be_visible()
        self.action("word-known", id="v-1")
        self.assertEqual(self.saved()["vocab"]["v-1"]["due"], "2026-10-24")
        self.assertEqual(self.saved()["vocab"]["v-1"]["reps"], 1)
        self.action("reveal", id="v-1")
        self.action("word-known", id="v-1")
        self.assertEqual(self.saved()["vocab"]["v-1"]["reps"], 1, "same-day clicks must not advance spacing")
        self.action("word-filter", filter="due")
        expect(self.page.locator(".vocab-card")).to_have_count(0)
        self.page.clock.set_system_time(datetime(2026, 10, 24, 4, 0, tzinfo=timezone.utc))
        self.page.reload()
        self.action("word-filter", filter="due")
        expect(self.page.locator(".vocab-card")).to_have_count(1)
        self.action("reveal", id="v-1")
        self.action("word-known", id="v-1")
        self.assertEqual(self.saved()["vocab"]["v-1"]["due"], "2026-10-27")

    def test_export_import_validation_and_safe_text(self):
        self.page.locator("[data-task]").first.check()
        self.open_settings()
        with self.page.expect_download() as event:
            self.action("export")
        data = json.loads(Path(event.value.path()).read_text())
        self.assertEqual(data["tasks"]["2026-10-23"], ["day-1-task-1"])
        malicious = '</textarea><img src=x onerror="window.__xss=1"><script>window.__xss=2</script>'
        data["notes"]["quant"] = malicious
        self.page.locator("#import-file").set_input_files({
            "name": "study.json", "mimeType": "application/json", "buffer": json.dumps(data).encode()
        })
        expect(self.page.locator('[data-action="confirm-import"]')).to_be_visible()
        self.action("confirm-import")
        self.nav("knowledge")
        self.action("topic", id="quant")
        expect(self.page.locator("[data-note]")).to_have_value(malicious)
        self.assertIsNone(self.page.evaluate("window.__xss"))
        self.assertEqual(self.page.locator(".lesson img").count(), 0)
        self.open_settings()
        self.page.locator("#import-file").set_input_files({
            "name": "invalid.json", "mimeType": "application/json", "buffer": b'{"version":99}'
        })
        expect(self.page.locator("#toast")).to_contain_text("无法读取备份")
        self.assertEqual(self.saved()["notes"]["quant"], malicious)

    def test_timer_responsive_layout_and_offline_single_file(self):
        self.action("focus")
        expect(self.page.locator("#timer-display")).to_have_text("25:00")
        self.action("timer-toggle")
        self.page.clock.run_for(2100)
        expect(self.page.locator("#timer-display")).to_have_text("24:58")
        self.action("timer-toggle")
        self.page.clock.run_for(2000)
        expect(self.page.locator("#timer-display")).to_have_text("24:58")
        self.action("timer-reset")
        expect(self.page.locator("#timer-display")).to_have_text("25:00")
        self.action("close")
        self.page.wait_for_timeout(350)
        self.page.screenshot(path="/tmp/shiji-desktop.png", full_page=True)
        for width in [375, 768, 1440]:
            self.page.set_viewport_size({"width": width, "height": 900})
            for tab in ["today", "plan", "knowledge", "practice", "english"]:
                self.nav(tab)
                self.assertLessEqual(
                    self.page.evaluate("document.documentElement.scrollWidth"), width,
                    f"horizontal overflow: {tab} at {width}px"
                )
            if width == 375:
                self.nav("today")
                self.page.wait_for_timeout(350)
                self.page.screenshot(path="/tmp/shiji-mobile.png", full_page=True)
        standalone = ROOT / "dist" / "index.html"
        if standalone.is_file():
            requests = []
            self.page.on("request", lambda request: requests.append(request.url))
            # Managed Chromium prohibits file:// navigation. Serve the same standalone
            # bytes, then disconnect networking to exercise all bundled assets offline.
            standalone_url = "http://127.0.0.1:8766/dist/index.html"
            self.page.goto(standalone_url)
            expect(self.page.locator(".hero")).to_be_visible()
            self.context.set_offline(True)
            self.nav("practice")
            self.action("quiz", mode="diagnostic")
            self.assertEqual(self.page.locator(".option").count(), 3)
            q = self.current_question()
            self.action("option", index=str(q["answer"]))
            self.action("submit-answer")
            expect(self.page.locator(".answer-explanation")).to_be_visible()
            self.assertEqual(requests, [standalone_url], "standalone page must require no other resources")


if __name__ == "__main__":
    unittest.main(verbosity=2)
