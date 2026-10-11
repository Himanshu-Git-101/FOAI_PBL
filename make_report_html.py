# -*- coding: utf-8 -*-
"""
make_report_html.py
Constructs the complete 37-page HTML document for the PBL Final Report.
Complies strictly with Woxsen University School of Technology report guidelines.
Includes 9 real prototype screenshots, zero blank spaces in implementation,
pristine HTML Unicode mathematical formulas, exact page collation wrappers,
and complete academic chapters.
"""

import os, base64
import pages_prelim
import pages_chap1_3
import pages_chap4
import pages_chap5_7

def get_base64_img(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            ext = os.path.splitext(path)[1].lower()
            mime = "image/jpeg" if ext in [".jpg", ".jpeg"] else "image/png"
            return f"data:{mime};base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

def create_report_html(output_filepath, logo_b64=None):
    if not logo_b64:
        logo_b64 = get_base64_img("woxsen_logo.png")
    
    img_stage1 = get_base64_img("screenshot_stage1_resources.png")
    img_classrooms = get_base64_img("screenshot_stage1_classrooms.png")
    img_courses = get_base64_img("screenshot_stage1_courses.png")
    img_tigers = get_base64_img("screenshot_tigers_timetable.png")
    img_faculty = get_base64_img("screenshot_faculty_schedule.png")
    img_classroom = get_base64_img("screenshot_classroom_schedule.png")
    img_portal = get_base64_img("screenshot_portal_dashboard.png")
    img_workflow = get_base64_img("screenshot_workflow_modal.png")
    img_algo = get_base64_img("screenshot_algo_modal.png")

    html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI-Based University Timetable Generator - Final Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #111827;
  }
  .page-wrapper {
    page-break-after: always;
    break-after: page;
    clear: both;
    display: block;
  }
  .report-page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    margin: 0 auto 20px auto;
    background: #ffffff;
    padding: 1in 1in 1in 1.25in;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  @media print {
    body {
      background: none;
    }
    .page-wrapper {
      page-break-after: always;
      break-after: page;
    }
    .report-page {
      margin: 0;
      box-shadow: none;
    }
  }
  .page-header, .page-footer {
    display: none !important;
  }
  .page-corner-logo {
    position: absolute;
    top: 0.45in;
    right: 1.0in;
    height: 28px;
    width: auto;
    object-fit: contain;
    z-index: 100;
  }
  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: justify;
    overflow: hidden;
  }
  h1.chapter-title {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 14px 0;
    line-height: 1.3;
    letter-spacing: 0.04em;
    color: #0f172a;
  }
  h2.sec-heading {
    font-size: 12.5pt;
    font-weight: bold;
    color: #1e293b;
    margin: 10px 0 5px 0;
    line-height: 1.3;
  }
  h3.subsec-heading {
    font-size: 11.5pt;
    font-weight: bold;
    font-style: italic;
    color: #334155;
    margin: 8px 0 3px 0;
    line-height: 1.3;
  }
  p {
    margin: 0 0 8px 0;
    text-indent: 1.5em;
    text-align: justify;
  }
  p.no-indent {
    text-indent: 0;
  }
  ul, ol {
    margin: 4px 0 8px 20px;
    padding: 0;
  }
  li {
    margin-bottom: 4px;
    text-align: justify;
  }
  .table-academic {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 9.5pt;
    line-height: 1.35;
  }
  .table-academic th, .table-academic td {
    padding: 5px 7px;
    text-align: left;
    vertical-align: top;
  }
  .table-academic th {
    border-top: 1.5pt solid #0f172a;
    border-bottom: 1pt solid #0f172a;
    font-weight: bold;
    background-color: #f8fafc;
    color: #0f172a;
  }
  .table-academic td {
    border-bottom: 0.5pt solid #cbd5e1;
  }
  .table-academic tr:last-child td {
    border-bottom: 1.5pt solid #0f172a;
  }
  .caption-table, .caption-figure {
    font-size: 9.5pt;
    font-weight: bold;
    margin: 5px 0;
    text-align: center;
    color: #1e293b;
  }
  .caption-table {
    text-align: left;
  }
  .fig-container {
    text-align: center;
    margin: 5px 0 8px 0;
  }
  .code-block {
    background: #f8fafc;
    border: 1pt solid #cbd5e1;
    border-left: 3pt solid #2563eb;
    border-radius: 4px;
    padding: 7px 11px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    margin: 6px 0 8px 0;
    text-align: left;
    white-space: pre-wrap;
  }
  .math-block {
    background: #f8fafc;
    border: 0.75pt solid #cbd5e1;
    border-left: 3pt solid #2563eb;
    border-radius: 4px;
    padding: 6px 14px;
    font-family: 'Times New Roman', Times, serif;
    font-size: 10.5pt;
    line-height: 1.45;
    margin: 6px 0;
    text-align: center;
    color: #0f172a;
  }
  .screenshot-frame {
    display: block;
    margin: 0 auto;
    border: 0.75pt solid #cbd5e1;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    width: 100%;
    object-fit: contain;
  }
</style>
</head>
<body>
"""

    pages = []
    
    # 1. Preliminary Pages (8 pages)
    prelim_pages = pages_prelim.get_prelim_pages()
    for p in prelim_pages:
        pages.append(p.format(logo_b64=logo_b64))

    # 2. Chapters 1 to 3 (9 pages)
    pages.extend(pages_chap1_3.get_chap1_3_pages())

    # 3. Chapter 4 (6 pages)
    pages.extend(pages_chap4.get_chap4_pages())

    # 4. Chapters 5 to 7 & References (14 pages)
    pages.extend(pages_chap5_7.get_chap5_7_pages(
        img_stage1=img_stage1,
        img_classrooms=img_classrooms,
        img_courses=img_courses,
        img_tigers=img_tigers,
        img_faculty=img_faculty,
        img_classroom=img_classroom,
        img_portal=img_portal,
        img_workflow=img_workflow,
        img_algo=img_algo
    ))

    # Inject small top-right corner logo on every page
    corner_logo_html = f'<img src="{logo_b64}" class="page-corner-logo" alt="Woxsen University Logo">'
    final_pages = []
    for p in pages:
        idx = p.find('<div class="report-page"')
        if idx != -1:
            close_idx = p.find('>', idx)
            if close_idx != -1:
                p = p[:close_idx + 1] + '\n  ' + corner_logo_html + p[close_idx + 1:]
        final_pages.append(p)

    # Combine all pages
    html += "\n".join(final_pages)
    html += "\n</body>\n</html>"

    with open(output_filepath, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"make_report_html: {len(final_pages)} pages written to {output_filepath}.")

if __name__ == "__main__":
    create_report_html("final_report.html")
