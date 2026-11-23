# Advice Prosperity website

Live at https://adviceprosperity.com.au (GitHub Pages, custom domain in CNAME; DNS in Regional Prosperity's Cloudflare).

Whatever is on `main` is live. Changes reach `main` only through a pull request that Lee approves.

## Making a change (Dana)

1. Create a branch from `main`, for example `dana/new-hero-copy`.
2. Edit the HTML, CSS or images and commit to your branch. Plain HTML, so you can check a page by opening the file in a browser.
3. Open a pull request into `main` and say what changed.
4. Lee reviews and merges. The site updates a minute or two after the merge.

## Don't change

- `CNAME`: it holds the live domain. Editing or deleting it takes the site off adviceprosperity.com.au.
- The `og:url` and `og:image` tags: keep them on `https://adviceprosperity.com.au/`.
