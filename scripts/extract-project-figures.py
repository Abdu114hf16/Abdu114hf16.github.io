"""Optional media-preparation step. Requires PyMuPDF; never reads internship data."""
import sys
from pathlib import Path
import pymupdf

cache = Path(sys.argv[1])
doc = pymupdf.open(cache / 'income-dashboard.pdf')
for index in [1, 2]:
    page = doc[index]
    # Page 2 is an explicitly labeled chart excerpt: exclude the unreconciled
    # population KPI rather than present an across-period total as a population.
    clip = page.rect
    if index == 1:
        clip = pymupdf.Rect(clip.x0, clip.y0 + clip.height * .28, clip.x1, clip.y1)
    page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5), clip=clip).save(cache / f'income-{index + 1}.png')

doc = pymupdf.open(cache / 'saudi-report.pdf')
# Public UI screenshots only. Exclude report cover, IDs, login/account tables,
# and source-code pages. These are extracted from the repository's redacted PDF.
selected = {8: [0], 9: [0, 1], 10: [0], 12: [0, 1], 13: [0]}
number = 0
for page_index, image_indices in selected.items():
    images = doc[page_index].get_images()
    for image_index in image_indices:
        image = doc.extract_image(images[image_index][0])
        number += 1
        (cache / f'saudi-{number}.{image["ext"]}').write_bytes(image['image'])
print(f'Extracted two income dashboard excerpts and {number} public Saudi UI figures.')
