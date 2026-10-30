# Design portfolio

A static portfolio site for a senior product designer: a home page, three case studies and an About page. It uses plain HTML and CSS with no build step and no dependencies.

```
index.html                     Home: hero, three project cards, "how I work"
about.html                     About: bio, experience, principles, toolkit
work/crowdbuilding-messaging.html Case study 1 (CrowdBuilding messaging, real)
work/crowdbuilding-bulletin-board.html Case study 2 (CrowdBuilding bulletin board, real)
work/crowdbuilding-unit-listings.html Case study 3 (CrowdBuilding home listings, real)
assets/css/style.css           All styles; theme tokens are at the top
assets/js/main.js              Footer year, grid overlay toggle, home dot field
assets/js/board-demo.js        Interactive bulletin board demo (case study 2)
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## ⚠️ Replace the sample content

All three case studies are real CrowdBuilding projects. The About page (career history, companies like Harbor and Northwind) is still **fictional sample content**. Replace it with your own before publishing.

Checklist:

- [ ] Name, email (`hello@example.com`) and social links in every page's header and footer
- [ ] Intro line on `index.html`
- [ ] Project cards on `index.html`: date, title and summary
- [ ] Each case study: facts, metrics, and every section
- [ ] Images: search for `REPLACE` to find each empty frame and put `<img src="../assets/img/…" alt="…">` inside it
- [ ] Portrait on `about.html`
- [ ] Experience timeline, principles and toolkit on `about.html`
- [ ] Résumé PDF link

To rename a case study file, update the links on `index.html` and the "Next project" link at the bottom of the previous case study.

## The grid

Every page sits on one 12-column grid (4 columns on phones), with spacing in multiples of 8px:

- Columns 1–2: labels and index numbers (`.c-label`)
- Columns 3–12: headings (`.c-head`, `.c-head-narrow`)
- Columns 7–12: running text (`.c-text`)
- Row lists (`.rows`): item title in columns 3–6, detail in 7–12

Press **G** or click **Show grid** in the footer to see the columns.

The dotted background appears on the home page only. Its dots are drawn toward the cursor (`.dot-field` canvas). Tune `RADIUS`, `PULL` and `EASE` at the bottom of `main.js`. Visitors with reduced motion turned on see the static dots.

## Cover videos

The home listings case study uses a looping screen recording as its cover (`assets/video/`). It plays muted, pauses when scrolled out of view, has a Pause button, and stays still for visitors who prefer reduced motion. To add one elsewhere, copy the `<figure class="cover cover-video">` block. For a clip that should play once and rest on its last frame, such as the before/after in the same case study, use a `.frame.play-once` block instead. Compress recordings first, for example `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 28 -movflags +faststart out.mp4`, and export a poster frame.

## Video walkthroughs (Loom)

Each case study has a hidden walkthrough block under the summary, and the About page has one for a short intro under the heading. Paste the Loom share link into its `data-loom` attribute, for example `data-loom="https://www.loom.com/share/abc123…"`, and the block appears with a "Watch the 90-second walkthrough" button. The Loom player only loads when someone clicks it. In Loom, set the video to "Anyone with the link can view" and turn on captions.

## Customize the look

- **Colors and fonts:** edit the tokens in `:root` at the top of `style.css`. Dark mode tokens are in the `prefers-color-scheme: dark` block below them.
- **Fonts:** Schibsted Grotesk Black (display) + IBM Plex Mono (text), loaded from Google Fonts.
- **Images:** every white box is a `.frame` with a `data-label`. Put an `<img>` inside it and the label disappears.

## Case study structure

Every case study follows the same outline:

1. **Hero:** a one-line title and the insight in a sentence
2. **Facts:** role, team, timeline, platform
3. **Outcome:** three metrics, placed up front for skimmers
4. **Context → Problem → Approach:** how you framed the problem, not only what you made
5. **What we got wrong:** assumptions that turned out wrong, what actually happened, and what changed
6. **Key decisions:** each with its **trade-off**, which is the strongest signal of seniority
7. **Solution:** what shipped
8. **Reflection:** what you'd do differently

## Deploy on GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → pick the branch and `/ (root)`. The site will be live at `https://<user>.github.io/<repo>/`.
