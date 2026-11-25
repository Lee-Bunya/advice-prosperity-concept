"""Stamp every page's stylesheet and script links with a new version, so browsers
fetch the latest files straight away instead of an old saved copy.

Run from the website folder after changing anything in assets/*.css or assets/*.js:

    python3 tools/bump-version.py

It sets ?v= to the current date and time (for example ?v=202611251430) on every
assets/*.css and assets/*.js link in the site's .html files.
"""
import glob, re, time, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
stamp = time.strftime('%Y%m%d%H%M')
link = re.compile(r'((?:href|src)="assets/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"')
changed = 0
for page in sorted(glob.glob(os.path.join(root, '*.html'))):
    text = open(page, encoding='utf-8').read()
    new, n = link.subn(r'\1?v=' + stamp + '"', text)
    if new != text:
        open(page, 'w', encoding='utf-8', newline='').write(new)
        changed += 1
    print(f'{os.path.basename(page)}: {n} link(s)')
print(f'Version {stamp} set on {changed} page(s).')
