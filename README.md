# AlexSiek.github.io

Coursework portfolio for **CS180 / ~~CS280A~~: Intro to Computer Vision and Computational
Photography (Fall 2026)**, served by GitHub Pages at <https://alexsiek.github.io>.

## Structure

```
AlexSiek.github.io/
├─ index.html        # portfolio landing page, links to each project
├─ style.css         # shared stylesheet (light + dark)
├─ 0/                # Project 0: Becoming Friends with Your Camera
│  ├─ index.html
│  └─ media/         # photos + GIF for project 0
└─ 1/                # Project 1: Colorizing the Prokudin-Gorskii collection
   ├─ index.html     # skeleton, no results hardcoded
   ├─ results.js     # THE ONLY FILE TO EDIT when results are ready
   ├─ proj1.js       # renders galleries/tables, lightbox + magnifier
   ├─ proj1.css
   └─ media/         # colorized outputs
```

Each new project gets its own numbered directory (`1/`, `2/`, …) with an `index.html`
and a `media/` folder, linked from the root `index.html`.

## Local preview

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Deploying

Push to `main`; GitHub Pages rebuilds within ~10 minutes. The repo must stay **public**
for course staff to grade it.

## Project 0 submission checklist

- [ ] Part 1 photos (close selfie + far/zoomed selfie) in `0/media/`
- [ ] Part 2 photos (zoomed building + close building) in `0/media/`
- [ ] Part 3 stills (4–8+) and the animated GIF in `0/media/`
- [ ] Write-ups filled in for each part
- [ ] Submit the URL to the class gallery Google Form
- [ ] Print the page to PDF **with the URL in the header** ("Headers and footers" option)
      and upload to Gradescope, entry code `G7EVRZ`
- [ ] Due Tuesday, September 1st, 2026, 11:59PM

## Project 1 workflow

The page renders itself from `1/results.js`. To publish results:

1. Drop the colorized outputs into `1/media/` (JPEG, not TIFF).
2. In `1/results.js`, set each entry's `file` to the filename and fill in
   `g` / `r` as `[dx, dy]`, plus `seconds` if you want runtimes shown.
3. Fill in the `config` block so the approach table matches the final code.
4. Replace the `TODO:` prose in `1/index.html`.

Entries with `file: null` render as a dashed "pending" tile, so the page is
presentable at any point. Delete rows that do not exist in `data.zip`, and add
rows for any that are missing.

### Project 1 submission checklist

- [ ] Single-scale results on the low-resolution JPEGs
- [ ] Pyramid results on all provided images, with offsets listed
- [ ] 3+ self-selected plates, each linking to its Library of Congress page
- [ ] Any failed alignments explained
- [ ] Bells and whistles described with before/after images
- [ ] URL submitted to the Google Form
- [ ] URL submitted to Gradescope, without the image files attached
- [ ] Due Tuesday, September 15th, 2026, 11:59PM
