# Advice Prosperity website

Live at https://adviceprosperity.com.au (GitHub Pages, custom domain in CNAME; DNS in Regional Prosperity's Cloudflare).

Whatever is on `main` is live. Changes reach `main` only through a pull request that Lee approves.

## Making a change (Dana)

1. Create a branch from `main`, for example `dana/new-hero-copy`.
2. Edit the HTML, CSS or images and commit to your branch. Plain HTML, so you can check a page by opening the file in a browser.
3. Open a pull request into `main` and say what changed.
4. Lee reviews and merges. The site updates a minute or two after the merge.

## After changing a stylesheet or script

Browsers keep a saved copy of `assets/*.css` and `assets/*.js`, so visitors can see the old look for a while after a change. Every page links them with a version stamp (`?v=…`). After you change any of those files, run this from the website folder and commit the result with your change:

```
python3 tools/bump-version.py
```

It sets a new stamp on every page, so browsers fetch the new files straight away.

## Don't change

- `CNAME`: it holds the live domain. Editing or deleting it takes the site off adviceprosperity.com.au.
- The `og:url` and `og:image` tags: keep them on `https://adviceprosperity.com.au/`.
