#!/usr/bin/env python3
"""Fail if any blog post h2/h3 is missing an id= attribute.

After #2008 every section heading in www/blog carries a stable id so deep links
work. New posts forget that unless something checks. Run from the repo root.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

HEADING_OPEN = re.compile(r"<h([23])(\s[^>]*)?>")


def main() -> int:
    blog = Path("www/blog")
    if not blog.is_dir():
        print("www/blog not found; run from the repository root", file=sys.stderr)
        return 2

    missing: list[str] = []
    count = 0
    for path in sorted(blog.glob("*.html")):
        if path.name in ("index.html", "feed.xml"):
            continue
        text = path.read_text(encoding="utf-8")
        for m in HEADING_OPEN.finditer(text):
            tag = m.group(0)
            if "id=" not in tag:
                line = text.count("\n", 0, m.start()) + 1
                missing.append(f"{path}:{line}: {tag}")
            else:
                count += 1

    if missing:
        print("Blog h2/h3 headings without an id:")
        print("\n".join(missing))
        return 1

    print(f"All {count} blog h2/h3 headings have an id.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
