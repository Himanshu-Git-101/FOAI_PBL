#!/usr/bin/env python3
"""
build_report.py
Generates the comprehensive Academic Project-Based Learning Final Report for
Woxsen University, School of Technology, B.Tech Computer Science & Engineering.
Converts the structured HTML to a publication-grade PDF using Chrome Headless.
"""

import os
import subprocess
import pypdf

def get_base64_logo():
    import base64
    logo_path = "woxsen_logo.png" if os.path.exists("woxsen_logo.png") else "woxsen_logo.jpg"
    if os.path.exists(logo_path):
        with open(logo_path, "rb") as f:
            ext = os.path.splitext(logo_path)[1].lower()
            mime = "image/png" if ext == ".png" else "image/jpeg"
            return f"data:{mime};base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

def main():
    logo_b64 = get_base64_logo()
    html_file = "final_report.html"
    pdf_file = "AI_Based_Timetable_Generator_Final_Report.pdf"

    print("Building report HTML...")
    # Write the complete report builder
    import make_report_html
    make_report_html.create_report_html(html_file, logo_b64)

    print(f"HTML generated at {html_file}. Now compiling PDF using Google Chrome...")
    cmd = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file):
        size_kb = os.path.getsize(pdf_file) / 1024
        reader = pypdf.PdfReader(pdf_file)
        page_count = len(reader.pages)
        print(f"SUCCESS: {pdf_file} generated ({size_kb:.1f} KB, {page_count} pages).")
    else:
        print("ERROR: PDF was not generated.")
        print(res.stderr)

if __name__ == "__main__":
    main()
