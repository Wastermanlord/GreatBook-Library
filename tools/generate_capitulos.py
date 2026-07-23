from __future__ import annotations

import argparse
import html
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Genera capítulos HTML desde archivos .txt usando una plantilla."
    )
    parser.add_argument(
        "--src",
        default="Capitulos",
        help="Carpeta con los .txt de capítulos (default: Capitulos)",
    )
    parser.add_argument(
        "--out",
        default=".",
        help="Carpeta de salida para los .html (default: .)",
    )
    parser.add_argument(
        "--template",
        default="templates/capitulo_base.html",
        help="Plantilla HTML base",
    )
    parser.add_argument(
        "--home",
        default="index.html",
        help="Link de inicio/home para el nav del capítulo",
    )
    return parser.parse_args()


def txt_to_paragraphs(text: str) -> list[str]:
    # Normaliza saltos de linea y separa por bloques vacios
    raw = text.replace("\r\n", "\n").replace("\r", "\n")
    blocks: list[str] = []
    current: list[str] = []
    for line in raw.split("\n"):
        if line.strip() == "":
            if current:
                blocks.append(" ".join(current).strip())
                current = []
            continue
        current.append(line.strip())
    if current:
        blocks.append(" ".join(current).strip())
    return blocks


def extract_title_and_body(text: str, fallback_title: str) -> tuple[str, str]:
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    title = ""
    body_lines = lines[:]

    for i, line in enumerate(lines):
        if line.strip() == "":
            continue
        if line.lstrip().startswith("# "):
            title = line.strip()[2:].strip()
            body_lines = lines[i + 1 :]
        else:
            title = fallback_title
            body_lines = lines
        break

    if not title:
        title = fallback_title
        body_lines = lines

    body_text = "\n".join(body_lines)
    return title, body_text


def render_nav_link(href: str, icon: str) -> str:
    return (
        f'<a class="chapter-nav-link" href="{href}">'
        f'<i class="fa {icon}" aria-hidden="true"></i>'
        "</a>"
    )


def main() -> None:
    args = parse_args()
    src_dir = Path(args.src)
    out_dir = Path(args.out)
    template_path = Path(args.template)

    if not src_dir.exists():
        raise SystemExit(f"No existe la carpeta: {src_dir}")
    if not template_path.exists():
        raise SystemExit(f"No existe la plantilla: {template_path}")

    sources = sorted(p for p in src_dir.glob("*.txt"))
    if not sources:
        raise SystemExit("No hay archivos .txt en la carpeta de capitulos.")

    template = template_path.read_text(encoding="utf-8")

    for i, src in enumerate(sources):
        stem = src.stem
        title_fallback = stem.replace("_", " ").title()
        raw = src.read_text(encoding="utf-8")
        title, body_text = extract_title_and_body(raw, title_fallback)
        paragraphs = txt_to_paragraphs(body_text)
        content_html = "\n".join(f"<p>{html.escape(p)}</p>" for p in paragraphs)

        prev_link = ""
        next_link = ""

        if i > 0:
            prev_link = render_nav_link(f"{sources[i - 1].stem}.html", "fa-arrow-left")
        if i < len(sources) - 1:
            next_link = render_nav_link(f"{sources[i + 1].stem}.html", "fa-arrow-right")

        home_link = render_nav_link(args.home, "fa-home")

        output = (
            template.replace("{{title}}", html.escape(title))
            .replace("{{content}}", content_html)
            .replace("{{prev_link}}", prev_link)
            .replace("{{home_link}}", home_link)
            .replace("{{next_link}}", next_link)
        )

        out_path = out_dir / f"{stem}.html"
        out_path.write_text(output, encoding="utf-8")

    print(f"Generados {len(sources)} capitulos en {out_dir.resolve()}")


if __name__ == "__main__":
    main()
