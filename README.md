# AlexSiek.github.io

Coursework portfolio for **CS180 / ~~CS280A~~: Intro to Computer Vision and Computational
Photography (Fall 2026)**, served by GitHub Pages at <https://alexsiek.github.io>.

## Structure

```
AlexSiek.github.io/
├─ index.html        # portfolio landing page, links to each project
├─ style.css         # shared stylesheet (light + dark)
└─ 0/                # Project 0: Becoming Friends with Your Camera
   ├─ index.html
   └─ media/         # photos + GIF for project 0
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
