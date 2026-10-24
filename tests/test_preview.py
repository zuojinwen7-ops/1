"""Regression: the default root entry works when sibling assets cannot be served.

This simulates an assetless HTML preview, not the Codex preview implementation.
Run with `python3 tests/test_preview.py` after `python3 scripts/build.py`.
"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import unittest

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]


class HTMLOnlyHandler(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def do_GET(self):
        if self.path not in ("/", "/index.html"):
            self.send_error(404)
            return
        body = (ROOT / "index.html").read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        # Permit only the app's inline resources and data favicon. The actual
        # preview's unknown CSP may differ; this is a local delivery regression.
        self.send_header("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none'")
        self.end_headers()
        self.wfile.write(body)


class PreviewDeliveryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), HTMLOnlyHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.origin = f"http://127.0.0.1:{cls.server.server_port}"
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def test_root_is_identical_to_download_and_self_contained(self):
        self.assertEqual((ROOT / "index.html").read_bytes(), (ROOT / "dist/index.html").read_bytes())
        context = self.browser.new_context(reduced_motion="reduce")
        page = context.new_page()
        requests = []
        errors = []
        page.on("request", lambda request: requests.append(request.url))
        page.on("pageerror", lambda error: errors.append(str(error)))
        try:
            page.goto(self.origin)
            expect(page.locator(".hero")).to_be_visible()
            self.assertEqual(page.locator(".sidebar").evaluate("el => getComputedStyle(el).position"), "fixed")
            self.assertEqual(page.locator('script[src], link[rel="stylesheet"]').count(), 0)
            page.locator('[data-nav="practice"]').click()
            page.locator('[data-action="quiz"][data-mode="diagnostic"]').click()
            expect(page.locator(".question-en")).to_be_visible()
            page.locator('[data-action="option"][data-index="0"]').click()
            page.locator('[data-action="submit-answer"]').click()
            expect(page.locator(".answer-explanation")).to_be_visible()
            self.assertEqual(errors, [])
            self.assertEqual(requests, [self.origin + "/"])
        finally:
            context.close()

    def test_repaired_desktop_and_mobile_geometry(self):
        context = self.browser.new_context(viewport={"width": 1440, "height": 1050}, reduced_motion="reduce")
        page = context.new_page()
        try:
            page.goto(self.origin)
            expect(page.locator(".hero")).to_be_visible()
            self.assertEqual(page.locator(".hero").evaluate("el => getComputedStyle(el).display"), "flex")
            self.assertLessEqual(page.locator(".sidebar-button .icon").first.bounding_box()["width"], 20)
            page.screenshot(path="/tmp/shiji-repaired-desktop.png", full_page=True)
            page.set_viewport_size({"width": 390, "height": 844})
            self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), 390)
            page.screenshot(path="/tmp/shiji-repaired-mobile.png", full_page=True)
        finally:
            context.close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
