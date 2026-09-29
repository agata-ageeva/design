# Design portfolio

A static portfolio site for a senior product designer: a home page, three case studies and an About page. It uses plain HTML and CSS with no build step and no dependencies.

```
index.html                     Home: hero, three project cards, "how I work"
about.html                     About: bio, experience, principles, toolkit
work/ledgerly-invoicing.html   Case study 1 (B2B fintech)
work/harbor-design-system.html Case study 2 (design systems)
work/carewell-intake.html      Case study 3 (healthcare, mobile)
assets/css/style.css           All styles; theme tokens are at the top
assets/js/main.js              Sticky-header border, scroll fade-ins, footer year
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## ⚠️ Replace the sample content

All projects, companies (Ledgerly, Harbor, Carewell, Northwind), metrics and career history are **fictional sample content**. They show the structure and tone of a strong senior case study. Replace them with your own work before publishing.

Checklist:

- [ ] Name, email (`hello@example.com`) and social links in every page's header and footer
- [ ] Hero headline and intro on `index.html`
- [ ] Project cards on `index.html`: title, meta line, summary and impact chips
- [ ] Each case study: facts, metrics, and every section
- [ ] Images: search for `REPLACE` to find each placeholder SVG and swap in `<img src="../assets/img/…" alt="…">`
- [ ] Portrait on `about.html`
- [ ] Experience timeline, principles and toolkit on `about.html`
- [ ] Résumé PDF link

To rename a case study file, update the links on `index.html` and the "Next project" link at the bottom of the previous case study.

## Customize the look

- **Colors and fonts:** edit the tokens in `:root` at the top of `style.css`. Dark mode tokens are in the `prefers-color-scheme: dark` block below them.
- **Project tint:** each case study sets `style="--tint:#…"` on `<body>`, and each home card sets it on `.project-media`.
- **Fonts:** Instrument Serif (display) + Inter (text), loaded from Google Fonts.

## Case study structure

Every case study follows the same outline:

1. **Hero:** a one-line title and the insight in a sentence
2. **Facts:** role, team, timeline, platform
3. **Outcome:** three metrics, placed up front for skimmers
4. **Context → Problem → Approach:** how you framed the problem, not only what you made
5. **Key decisions:** each with its **trade-off**, which is the strongest signal of seniority
6. **Solution → Reflection:** what shipped and what you'd do differently

## Deploy on GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → pick the branch and `/ (root)`. The site will be live at `https://<user>.github.io/<repo>/`.
