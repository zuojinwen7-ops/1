"""Build self-contained root and download entries; Python standard library only.

The root entry intentionally includes CSS and JavaScript inline. File-preview
services do not always serve sibling assets, so a multi-file root index can look
unstyled even though it works with an ordinary development server.
"""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
template = root / "src" / "index.template.html"
html = template.read_text(encoding="utf-8")
css = (root / "styles.css").read_text(encoding="utf-8")
data = (root / "study-data.js").read_text(encoding="utf-8")
guides = (root / "task-guides.js").read_text(encoding="utf-8")
app = (root / "app.js").read_text(encoding="utf-8")

def replace_once(old, new):
    global html
    if html.count(old) != 1:
        raise ValueError(f"Expected exactly one template marker: {old!r}")
    html = html.replace(old, new, 1)

replace_once('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}\n</style>")
replace_once('  <script src="study-data.js" defer></script>\n', "")
replace_once('  <script src="task-guides.js" defer></script>\n', "")
replace_once('  <script src="app.js" defer></script>\n', "")
# Inline scripts must run after the document; `defer` has no effect on inline JS.
javascript = (data + "\n;\n" + guides + "\n;\n" + app).replace("</script", "<\\/script")
replace_once("</body>", f"<script>\n{javascript}\n</script>\n</body>")
for out in (root / "index.html", root / "dist" / "index.html"):
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"Self-contained website: {out} ({out.stat().st_size:,} bytes)")
