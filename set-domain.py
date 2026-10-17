#!/usr/bin/env python3
"""Usage: python3 set-domain.py https://yourdomain.com
Replaces the placeholder https://demo.com in every canonical, og:url, JSON-LD, sitemap and robots.txt."""
import sys, glob
if len(sys.argv) != 2 or not sys.argv[1].startswith('http'):
    sys.exit('Usage: python3 set-domain.py https://yourdomain.com')
d = sys.argv[1].rstrip('/')
n = 0
for f in glob.glob('**/*', recursive=True):
    if f.endswith(('.html', '.xml', '.txt', '.json', '.js')):
        s = open(f, encoding='utf8').read()
        if 'https://demo.com' in s:
            open(f, 'w', encoding='utf8').write(s.replace('https://demo.com', d)); n += 1
print('updated', n, 'files ->', d)
