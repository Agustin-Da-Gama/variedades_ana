#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Pro Max Search - BM25 search & design-system generator for UI/UX guides.

Usage:
  python search.py "<query>" [--domain <domain>] [--stack <stack>] [-n <max_results>]
  python search.py "<query>" --design-system [-p "Project Name"] [-f ascii|markdown]
  python search.py "<query>" --design-system --persist [-p "Project Name"] [--page "<page>"] [--output-dir "<dir>"]
"""

import argparse
import csv
import io
import math
import os
import re
import sys
from collections import Counter
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
if sys.stderr.encoding and sys.stderr.encoding.lower() != "utf-8":
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STACKS_DIR = DATA_DIR / "stacks"

DOMAIN_CONFIG = {
    "product": {
        "file": "products.csv",
        "search_cols": [
            "Product Type", "Keywords", "Primary Style Recommendation",
            "Secondary Styles", "Landing Page Pattern", "Key Considerations",
        ],
    },
    "style": {
        "file": "styles.csv",
        "search_cols": [
            "Style Category", "Type", "Keywords", "Best For",
            "Do Not Use For", "Effects & Animation",
        ],
    },
    "color": {
        "file": "colors.csv",
        "search_cols": ["Product Type", "Keywords", "Notes"],
    },
    "typography": {
        "file": "typography.csv",
        "search_cols": [
            "Font Pairing Name", "Category", "Heading Font",
            "Body Font", "Mood/Style Keywords", "Best For",
        ],
    },
    "landing": {
        "file": "landing.csv",
        "search_cols": [
            "Pattern Name", "Keywords", "Section Order",
            "Primary CTA Placement", "Conversion Optimization",
        ],
    },
    "chart": {
        "file": "charts.csv",
        "search_cols": [
            "Data Type", "Keywords", "Best Chart Type",
            "Secondary Options", "Library Recommendation",
        ],
    },
    "ux": {
        "file": "ux-guidelines.csv",
        "search_cols": ["Category", "Issue", "Platform", "Description", "Do", "Don't"],
    },
    "google-fonts": {
        "file": "google-fonts.csv",
        "search_cols": [
            "Family", "Category", "Stroke", "Classifications",
            "Keywords", "Subsets", "Designers",
        ],
    },
    "react": {
        "file": "react-performance.csv",
        "search_cols": ["Category", "Issue", "Keywords", "Description"],
    },
    "web": {
        "file": "app-interface.csv",
        "search_cols": ["Category", "Issue", "Keywords", "Platform", "Description"],
    },
    "prompt": {
        "file": "prompts.csv",
        "search_cols": [
            "Style Category", "AI Prompt Keywords (Copy-Paste Ready)",
            "CSS/Technical Keywords",
        ],
    },
}


def tokenize(text):
    return re.findall(r"[a-z0-9]+", (text or "").lower())


def load_csv(path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def available_stacks():
    if not STACKS_DIR.exists():
        return []
    return sorted(p.stem for p in STACKS_DIR.glob("*.csv"))


def bm25_search(rows, query, search_cols=None, top_k=3):
    if not rows:
        return []
    q_tokens = tokenize(query)
    if not q_tokens:
        return rows[:top_k]

    docs = []
    for row in rows:
        cols = search_cols if search_cols else list(row.keys())
        text = " ".join(str(row.get(c, "")) for c in cols)
        docs.append(tokenize(text))

    n_docs = len(docs)
    avg_dl = sum(len(d) for d in docs) / max(n_docs, 1)
    df = Counter()
    for d in docs:
        for t in set(d):
            df[t] += 1

    k1 = 1.5
    b = 0.75
    scored = []
    for idx, d in enumerate(docs):
        dl = len(d) or 1
        tf = Counter(d)
        score = 0.0
        for term in q_tokens:
            if term not in tf:
                continue
            idf = math.log((n_docs - df[term] + 0.5) / (df[term] + 0.5) + 1.0)
            freq = tf[term]
            score += idf * (freq * (k1 + 1.0)) / (freq + k1 * (1.0 - b + b * dl / avg_dl))
        # Exact phrase / substring boost
        joined = " ".join(d)
        for term in q_tokens:
            if term in joined:
                score += 0.05
        if score > 0:
            scored.append((score, idx, rows[idx]))

    scored.sort(key=lambda item: (-item[0], item[1]))
    if not scored:
        return rows[:top_k]
    return [item[2] for item in scored[:top_k]]


def detect_domain(query):
    q = query.lower()
    hints = [
        ("chart", ["chart", "graph", "pie", "bar", "line", "heatmap", "funnel", "sparkline", "dashboard viz"]),
        ("typography", ["font", "typography", "pairing", "serif", "heading font", "body font"]),
        ("google-fonts", ["google font", "variable font", "subsets", "specimen"]),
        ("color", ["color", "palette", "hex", "contrast", "dark mode", "theme"]),
        ("landing", ["landing", "hero", "cta", "testimonial", "pricing", "social-proof", "conversion"]),
        ("ux", ["ux", "accessibility", "a11y", "animation", "z-index", "loading", "focus", "touch"]),
        ("react", ["react", "nextjs", "waterfall", "suspense", "memo", "rerender", "bundle"]),
        ("web", ["accessibilitylabel", "safe area", "dynamic type", "ios", "android", "react-native"]),
        ("prompt", ["prompt", "css keywords", "variables", "checklist"]),
        ("style", ["style", "glassmorphism", "minimalism", "brutalism", "neumorphism", "bento", "claymorphism"]),
        ("product", ["saas", "ecommerce", "e-commerce", "fintech", "healthcare", "portfolio", "wellness"]),
    ]
    for domain, words in hints:
        if any(w in q for w in words):
            return domain
    return "style"


def search_domain(domain, query, max_results=3):
    cfg = DOMAIN_CONFIG.get(domain)
    if not cfg:
        return {"error": f"Unknown domain '{domain}'. Available: {', '.join(DOMAIN_CONFIG)}"}
    path = DATA_DIR / cfg["file"]
    if not path.exists():
        return {"error": f"Data file not found: {path}"}
    rows = load_csv(path)
    hits = bm25_search(rows, query, cfg["search_cols"], top_k=max_results)
    return {
        "domain": domain,
        "file": cfg["file"],
        "query": query,
        "count": len(hits),
        "results": hits,
    }


def search_stack(stack, query, max_results=5):
    stacks = available_stacks()
    if stack not in stacks:
        return {"error": f"Unknown stack '{stack}'. Available: {', '.join(stacks)}"}
    path = STACKS_DIR / f"{stack}.csv"
    rows = load_csv(path)
    hits = bm25_search(rows, query, None, top_k=max_results)
    return {
        "stack": stack,
        "file": f"stacks/{stack}.csv",
        "query": query,
        "count": len(hits),
        "results": hits,
    }


def generate_design_system(query, project_name=None):
    product_hits = bm25_search(load_csv(DATA_DIR / "products.csv"), query, DOMAIN_CONFIG["product"]["search_cols"], top_k=1)
    product = product_hits[0] if product_hits else {}

    reasoning_rows = load_csv(DATA_DIR / "ui-reasoning.csv")
    reasoning_query = f"{query} {product.get('Product Type', '')}"
    reasoning_hits = bm25_search(reasoning_rows, reasoning_query, ["UI_Category", "Recommended_Pattern", "Style_Priority", "Anti_Patterns"], top_k=1)
    reasoning = reasoning_hits[0] if reasoning_hits else {}

    style_query = f"{query} {product.get('Primary Style Recommendation', '')} {reasoning.get('Style_Priority', '')}"
    style_hits = bm25_search(load_csv(DATA_DIR / "styles.csv"), style_query, DOMAIN_CONFIG["style"]["search_cols"], top_k=1)
    style = style_hits[0] if style_hits else {}

    color_query = f"{query} {product.get('Product Type', '')}"
    color_hits = bm25_search(load_csv(DATA_DIR / "colors.csv"), color_query, DOMAIN_CONFIG["color"]["search_cols"], top_k=1)
    color = color_hits[0] if color_hits else {}

    typo_query = f"{query} {reasoning.get('Typography_Mood', '')} {product.get('Product Type', '')}"
    typo_hits = bm25_search(load_csv(DATA_DIR / "typography.csv"), typo_query, DOMAIN_CONFIG["typography"]["search_cols"], top_k=1)
    typo = typo_hits[0] if typo_hits else {}

    landing_query = f"{query} {product.get('Landing Page Pattern', '')} {reasoning.get('Recommended_Pattern', '')}"
    landing_hits = bm25_search(load_csv(DATA_DIR / "landing.csv"), landing_query, DOMAIN_CONFIG["landing"]["search_cols"], top_k=1)
    landing = landing_hits[0] if landing_hits else {}

    return {
        "project": project_name or "Design System",
        "query": query,
        "product": product,
        "reasoning": reasoning,
        "style": style,
        "color": color,
        "typography": typo,
        "landing": landing,
    }


def format_design_system_markdown(ds):
    p = ds["product"]
    r = ds["reasoning"]
    s = ds["style"]
    c = ds["color"]
    t = ds["typography"]
    l = ds["landing"]

    lines = [
        f"# {ds['project']} — Design System",
        "",
        f"> Query: `{ds['query']}`",
        "",
        "## 1. Product & Pattern",
        f"- **Product Type:** {p.get('Product Type', 'N/A')}",
        f"- **Recommended Pattern:** {l.get('Pattern Name') or p.get('Landing Page Pattern') or r.get('Recommended_Pattern', 'N/A')}",
        f"- **Section Order:** {l.get('Section Order', 'N/A')}",
        f"- **Primary CTA Placement:** {l.get('Primary CTA Placement', 'Above the fold + key conversion points')}",
        f"- **Key Considerations:** {p.get('Key Considerations', 'N/A')}",
        "",
        "## 2. Visual Style",
        f"- **Primary Style:** {s.get('Style Category') or p.get('Primary Style Recommendation', 'N/A')}",
        f"- **Secondary Styles:** {p.get('Secondary Styles', 'N/A')}",
        f"- **Effects & Animation:** {s.get('Effects & Animation') or r.get('Key_Effects', 'N/A')}",
        f"- **Light / Dark Support:** Light={s.get('Light Mode ✓', 'N/A')}, Dark={s.get('Dark Mode ✓', 'N/A')}",
        "",
        "## 3. Color Palette",
        f"- **Primary:** `{c.get('Primary (Hex)', '#2563EB')}`",
        f"- **Secondary:** `{c.get('Secondary (Hex)', '#3B82F6')}`",
        f"- **CTA / Accent:** `{c.get('CTA (Hex)', '#F97316')}`",
        f"- **Background:** `{c.get('Background (Hex)', '#F8FAFC')}`",
        f"- **Text:** `{c.get('Text (Hex)', '#1E293B')}`",
        f"- **Border:** `{c.get('Border (Hex)', '#E2E8F0')}`",
        f"- **Color Notes:** {c.get('Notes', p.get('Color Palette Focus', 'N/A'))}",
        "",
        "## 4. Typography",
        f"- **Font Pairing:** {t.get('Font Pairing Name', 'N/A')} ({t.get('Category', '')})",
        f"- **Heading Font:** {t.get('Heading Font', 'N/A')}",
        f"- **Body Font:** {t.get('Body Font', 'N/A')}",
        f"- **Google Fonts:** {t.get('Google Fonts URL', 'N/A')}",
        f"- **CSS Import:** `{t.get('CSS Import', '')}`",
        "",
        "## 5. Anti-Patterns to Avoid",
        f"- **Style Avoid:** {s.get('Do Not Use For', 'N/A')}",
        f"- **Reasoning Anti-Patterns:** {r.get('Anti_Patterns', 'Excessive animation, low contrast, emoji structural icons')}",
        "",
    ]
    return "\n".join(lines)


def format_design_system_ascii(ds):
    p = ds["product"]
    r = ds["reasoning"]
    s = ds["style"]
    c = ds["color"]
    t = ds["typography"]
    l = ds["landing"]

    title = f" DESIGN SYSTEM: {ds['project']} "
    bar = "=" * max(64, len(title) + 8)
    lines = [
        bar,
        title.center(len(bar), "="),
        bar,
        f"Query:      {ds['query']}",
        f"Product:    {p.get('Product Type', 'N/A')}",
        f"Pattern:    {l.get('Pattern Name') or p.get('Landing Page Pattern') or r.get('Recommended_Pattern', 'N/A')}",
        f"Sections:   {l.get('Section Order', 'N/A')}",
        f"Style:      {s.get('Style Category') or p.get('Primary Style Recommendation', 'N/A')}",
        f"Effects:    {s.get('Effects & Animation') or r.get('Key_Effects', 'N/A')}",
        "-" * len(bar),
        "COLORS:",
        f"  Primary:    {c.get('Primary (Hex)', 'N/A')}   Secondary: {c.get('Secondary (Hex)', 'N/A')}   CTA: {c.get('CTA (Hex)', 'N/A')}",
        f"  Background: {c.get('Background (Hex)', 'N/A')}   Text:      {c.get('Text (Hex)', 'N/A')}   Border: {c.get('Border (Hex)', 'N/A')}",
        "-" * len(bar),
        "TYPOGRAPHY:",
        f"  Pairing:    {t.get('Font Pairing Name', 'N/A')}",
        f"  Heading:    {t.get('Heading Font', 'N/A')} | Body: {t.get('Body Font', 'N/A')}",
        f"  Fonts URL:  {t.get('Google Fonts URL', 'N/A')}",
        "-" * len(bar),
        f"ANTI-PATTERNS: {r.get('Anti_Patterns', 'N/A')}",
        bar,
    ]
    return "\n".join(lines)


def persist_design_system(ds, output_dir, page=None):
    base = Path(output_dir) / "design-system"
    base.mkdir(parents=True, exist_ok=True)
    master_path = base / "MASTER.md"
    master_path.write_text(format_design_system_markdown(ds), encoding="utf-8")
    written = [str(master_path)]
    if page:
        pages_dir = base / "pages"
        pages_dir.mkdir(parents=True, exist_ok=True)
        slug = re.sub(r"[^a-z0-9_-]+", "-", page.strip().lower()).strip("-") or "page"
        page_path = pages_dir / f"{slug}.md"
        page_content = "\n".join([
            f"# {ds['project']} — Page Override: {page}",
            "",
            "Inherits rules from `../MASTER.md` and specifies page-level overrides below.",
            "",
            "## Page Focus",
            f"- **Page:** {page}",
            f"- **Query:** `{ds['query']}`",
            f"- **Recommended Pattern:** {ds['landing'].get('Pattern Name', 'N/A')}",
            f"- **Section Order:** {ds['landing'].get('Section Order', 'N/A')}",
            f"- **Primary CTA:** {ds['landing'].get('Primary CTA Placement', 'N/A')}",
            "",
        ])
        page_path.write_text(page_content, encoding="utf-8")
        written.append(str(page_path))
    return written


def format_search_results(res):
    if "error" in res:
        return f"Error: {res['error']}"
    header = (
        f"## UI/UX Pro Max Stack Guidelines\n**Stack:** {res['stack']} | **Query:** {res['query']}"
        if res.get("stack")
        else f"## UI/UX Pro Max Search Results\n**Domain:** {res['domain']} | **Query:** {res['query']}"
    )
    lines = [header, f"**Source:** {res['file']} | **Found:** {res['count']} results\n"]
    for i, row in enumerate(res["results"], 1):
        lines.append(f"### Result {i}")
        for k, v in row.items():
            if v is not None and str(v).strip():
                lines.append(f"- **{k}:** {str(v).strip()}")
        lines.append("")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="UI/UX Pro Max Design Intelligence Search")
    parser.add_argument("query", help="Search query or product/style keywords")
    parser.add_argument("--domain", "-d", choices=list(DOMAIN_CONFIG.keys()), help="Specific domain to search")
    parser.add_argument("--stack", "-s", help="Specific technology stack guidelines")
    parser.add_argument("-n", "--max-results", type=int, default=3, help="Maximum results to return")
    parser.add_argument("--design-system", action="store_true", help="Generate full design system recommendation")
    parser.add_argument("-p", "--project", default=None, help="Project name for design system")
    parser.add_argument("-f", "--format", choices=["ascii", "markdown"], default="ascii", help="Output format")
    parser.add_argument("--persist", action="store_true", help="Persist design system to design-system/MASTER.md")
    parser.add_argument("--page", default=None, help="Optional page-specific override file name")
    parser.add_argument("--output-dir", default=".", help="Project root where design-system/ is written")

    args = parser.parse_args()

    if args.design_system:
        ds = generate_design_system(args.query, args.project)
        output = format_design_system_markdown(ds) if args.format == "markdown" else format_design_system_ascii(ds)
        print(output)
        if args.persist:
            written = persist_design_system(ds, args.output_dir, args.page)
            print("\nPersisted files:")
            for p in written:
                print(f"- {p}")
        return

    if args.stack:
        res = search_stack(args.stack, args.query, args.max_results)
        print(format_search_results(res))
        return

    domain = args.domain or detect_domain(args.query)
    res = search_domain(domain, args.query, args.max_results)
    print(format_search_results(res))


if __name__ == "__main__":
    main()
