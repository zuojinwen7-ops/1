"""Regression tests for following a selected day's three learning tasks.

Run after building the website: python3 tests/test_guided_tasks.py
The browser uses temporary storage and a fixed date; real learner records are
never read or modified. No external websites are requested by these tests.
"""
import functools
import json
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
import threading
import unittest

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
KEY = "shiji-cfa-v1"
TODAY = datetime(2026, 10, 23, 4, tzinfo=timezone.utc)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class GuidedTaskTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.origin = f"http://127.0.0.1:{cls.server.server_port}"
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
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 1100}, reduced_motion="reduce"
        )
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=TODAY)
        self.page.goto(self.origin)
        expect(self.page.locator(".hero")).to_be_visible()

    def tearDown(self):
        try:
            self.assertEqual(self.errors, [], "JavaScript errors in the guided flow")
        finally:
            self.context.close()

    def action(self, action, **attrs):
        selector = f'[data-action="{action}"]'
        for key, value in attrs.items():
            selector += f'[data-{key}="{value}"]'
        target = self.page.locator(selector).first
        expect(target).to_be_visible()
        target.click()

    def saved(self):
        return self.page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)

    def open_task(self, day, index):
        self.page.goto(f"{self.origin}/#task/{day}/{index}")
        self.expect_task(day, index)

    def expect_task(self, day, index):
        expect(self.page).to_have_url(re.compile(rf"#task/{day}/{index}$"))
        expect(self.page.locator("[data-task-workspace]")).to_be_visible()
        text = self.page.evaluate(
            "([day,index]) => window.STUDY_DATA.days[day-1].tasks[index-1].text",
            [day, index],
        )
        expect(self.page.locator("[data-task-workspace]")).to_contain_text(text)

    def resource(self, kind, *, topic=None):
        match = re.search(r"#task/(\d+)/(\d+)$", self.page.url)
        self.assertIsNotNone(match)
        day, index = map(int, match.groups())
        resources = self.page.evaluate(
            "([day,index]) => window.TASK_GUIDES[`day-${day}-task-${index}`].resources",
            [day, index],
        )
        resource_index = next(
            i for i, r in enumerate(resources)
            if r["type"] == kind and (topic is None or r.get("topic") == topic)
        )
        self.action("task-resource", resource=resource_index)

    def current_question(self):
        en = self.page.locator(".question-en").inner_text()
        return self.page.evaluate(
            "en => window.STUDY_DATA.questions.find(q => (q.en || q.stem) === en)", en
        )

    def finish_quiz(self, expected_count):
        for _ in range(expected_count):
            q = self.current_question()
            self.action("option", index=q["answer"])
            self.action("submit-answer")
            expect(self.page.locator(".answer-explanation")).to_be_visible()
            self.action("next-question")
        expect(self.page.locator(".score-ring strong")).to_have_text(
            f"{expected_count}/{expected_count}"
        )

    def test_day_one_diagnostic_leads_to_task_two_and_then_ethics(self):
        self.open_task(1, 1)
        # Merely opening a task or its resources must not claim it is complete.
        self.assertNotIn("day-1-task-1", (self.saved() or {}).get("tasks", {}).get("2026-10-23", []))
        self.resource("quiz")
        self.finish_quiz(8)
        expect(self.page.locator('[data-action="return-task"]').first).to_be_visible()
        self.action("return-task")
        self.expect_task(1, 1)
        self.action("complete-task")
        self.expect_task(1, 2)
        self.assertEqual(self.saved()["tasks"]["2026-10-23"], ["day-1-task-1"])
        self.resource("lesson", topic="quant")
        expect(self.page.locator(".lesson-heading")).to_contain_text("定量方法")
        self.action("return-task")
        self.expect_task(1, 2)
        self.action("complete-task")
        self.expect_task(1, 3)
        self.resource("quiz", topic="ethics")
        expect(self.page.locator(".quiz-topic")).to_contain_text("职业伦理")

    def test_plan_modal_has_independent_entries_and_selected_day_survives_reload(self):
        self.page.locator('[data-nav="plan"]').click()
        self.action("day", day=8)
        entries = self.page.locator('#modal [data-action="open-task"]')
        expect(entries).to_have_count(3)
        entries.nth(1).click()
        self.expect_task(8, 2)
        self.page.screenshot(path="/tmp/guided-task-desktop.png", full_page=True)
        self.page.reload()
        self.expect_task(8, 2)
        self.resource("lesson", topic="equity")
        expect(self.page.locator(".lesson-heading")).to_contain_text("权益投资")
        self.action("return-task")
        self.expect_task(8, 2)
        self.action("complete-task")
        self.expect_task(8, 3)
        self.assertIn("day-8-task-2", self.saved()["tasks"]["2026-10-30"])
        self.assertNotIn("day-1-task-2", self.saved()["tasks"].get("2026-10-23", []))

    def test_start_day_resumes_first_unfinished_then_shows_all_complete(self):
        self.page.locator('[data-task="day-1-task-1"]').check()
        self.action("start-day", day=1)
        self.expect_task(1, 2)
        self.action("complete-task")
        self.expect_task(1, 3)
        self.action("complete-task")
        expect(self.page.locator("[data-day-summary]")).to_be_visible()
        self.assertEqual(len(self.saved()["tasks"]["2026-10-23"]), 3)
        self.page.locator('[data-nav="today"]').click()
        self.action("start-day", day=1)
        expect(self.page.locator("[data-day-summary]")).to_be_visible()
        # An old manually completed checkbox remains a first-class task record.
        self.page.locator('[data-nav="today"]').click()
        expect(self.page.locator("[data-task]:checked")).to_have_count(3)

    def test_resource_navigation_keeps_context_and_empty_wrong_list_is_explained(self):
        self.open_task(8, 2)
        self.resource("lesson", topic="equity")
        expect(self.page.locator('[data-action="return-task"]').first).to_be_visible()
        self.page.reload()
        expect(self.page.locator('[data-action="return-task"]').first).to_be_visible()
        self.action("return-task")
        self.expect_task(8, 2)
        self.open_task(2, 1)
        self.resource("quiz")
        # A learner with no wrong answers still gets a usable way back to task 2/1.
        if not self.page.locator("[data-task-workspace]").is_visible():
            expect(self.page.locator('[data-action="return-task"]').first).to_be_visible()
            self.action("return-task")
        self.expect_task(2, 1)
        self.assertNotIn("day-2-task-1", self.saved().get("tasks", {}).get("2026-10-24", []))

    def test_legacy_records_and_task_note_backup_round_trip(self):
        legacy = {
            "version": 1, "examDate": "2026-11-11", "hours": 4,
            "tasks": {"2026-10-23": ["day-1-task-1"]}, "attempts": [],
            "vocab": {}, "questionReview": {}, "notes": {"quant": "保留原来的复利笔记"},
            "questionNotes": {}, "reviewed": {},
        }
        self.page.evaluate("([key,value]) => localStorage.setItem(key,JSON.stringify(value))", [KEY, legacy])
        self.page.reload()
        expect(self.page.locator('[data-task="day-1-task-1"]')).to_be_checked()
        self.action("start-day", day=1)
        self.expect_task(1, 2)
        malicious = '</textarea><img src=x onerror="window.__task_xss=1">本金、利率和期数要分别标记。'
        self.page.locator("[data-task-note]").fill(malicious)
        self.page.clock.run_for(400)
        self.page.reload()
        self.expect_task(1, 2)
        expect(self.page.locator("[data-task-note]")).to_have_value(malicious)
        self.assertIsNone(self.page.evaluate("window.__task_xss"))
        self.assertEqual(self.saved()["notes"]["quant"], "保留原来的复利笔记")
        self.action("settings")
        with self.page.expect_download() as event:
            self.action("export")
        backup = json.loads(Path(event.value.path()).read_text())
        self.page.locator("#import-file").set_input_files({
            "name": "guided-backup.json", "mimeType": "application/json",
            "buffer": json.dumps(backup, ensure_ascii=False).encode(),
        })
        self.action("confirm-import")
        self.open_task(1, 2)
        expect(self.page.locator("[data-task-note]")).to_have_value(malicious)
        self.assertEqual(self.saved()["tasks"]["2026-10-23"], ["day-1-task-1"])

    def test_mobile_task_and_resource_context_stay_readable(self):
        self.page.set_viewport_size({"width": 375, "height": 900})
        self.open_task(8, 3)
        self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), 375)
        task_text = self.page.locator("[data-task-workspace]").evaluate(
            "el => parseFloat(getComputedStyle(el).fontSize)"
        )
        self.assertGreaterEqual(task_text, 16)
        self.page.screenshot(path="/tmp/guided-task-mobile.png", full_page=True)
        self.resource("quiz", topic="equity")
        expect(self.page.locator('[data-action="return-task"]').first).to_be_visible()
        self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), 375)
        self.assertGreaterEqual(
            self.page.locator(".question-zh").evaluate("el => parseFloat(getComputedStyle(el).fontSize)"), 17
        )

    def test_word_resource_focuses_only_the_selected_tasks_material(self):
        self.open_task(1, 2)
        resource = self.page.evaluate(
            "window.TASK_GUIDES['day-1-task-2'].resources.find(r => r.type === 'words')"
        )
        expected = self.page.evaluate(
            "r => window.STUDY_DATA.vocabulary.filter(v => r.topics.includes(v.topic)).map(v => v.en)",
            resource,
        )
        self.resource("words")
        expect(self.page.locator(".task-scope")).to_contain_text("只显示这一项需要的")
        cards = self.page.locator(".vocab-card h3").all_inner_texts()
        self.assertEqual(len(cards), min(resource["count"], len(expected)))
        self.assertTrue(set(cards).issubset(set(expected)))
        self.assertLess(len(cards), self.page.evaluate("window.STUDY_DATA.vocabulary.length"))
        self.action("return-task")
        self.expect_task(1, 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
