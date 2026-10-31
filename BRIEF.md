# Site brief — cristianvalencia.mx

The source of truth for what this site says and who it's for. Design and code follow from this.
Raw ideas go in `IDEAS.md` first; settled decisions move here.
Items marked **[TODO]** need Cristian's input; items marked **[CONFIRM]** are drafts to approve or rewrite.

---

## 1. Purpose

A personal home for Cristian's whole life, not only a CV. It grows over time, one section at a time.

**Version 1 focuses on:**
1. **Photography portfolio** — the first thing to explore
2. **Blog** — writing about anything: life, photography, tech
3. **Work as a developer** — products, apps, and projects

Later sections are added as cards when they're ready (see §6).

## 2. Audiences

1. **Cristian** — a place that reflects who Cristian is now and where life is going.
2. **People who follow the photography and the writing** — friends, community, people arriving from social links.
3. **People interested in the professional side** — collaborators, clients, recruiters.

**[CONFIRM]** whether the professional side should be a quiet section or more visible.

## 3. Tone and feel

**Warm, calm, natural, handmade.** Warmth is the core feeling: golden afternoon light, sand, wood. The many light creams give calm and space. Something made by a person, not a machine. Photography leads; text supports it.

Reference notes for every image are in IDEAS.md → "Reference review".

## 4. Visual direction

### Color
From `inspiration/color-palette.png`:

| Role | Color |
|---|---|
| Page background | neutral #F7F7F7 (decided in Claude Design: a neutral ground lets the warm tones stand out) |
| Cards | white #FFFFFF, every card (no filled or bordered cards) |
| Text | dark petrol #09191E; secondary text #566061 |
| Tags (pills) | gold #B98946 with white text; the intro card has no tag |
| Links and name accent | muted turquoise #2A8C99, no underline |
| Hover accent | deep gold #9F6E32 |
| Photo placeholders | creams #F5EFE0, #F8F3E7 |

- Gold is used **sparingly**: tags and the primary button.
- **Turquoise #2A8C99** (a darker take on the sea in `rehoboth-map.jpg`) is the one cool accent: text links and "Cristian Valencia" in the greeting. Tried as a card fill and as a border; both rejected.
- Petrol is for text only; no petrol-filled cards.
- Links have no underline. **[OPEN]** add an underline on hover so links don't rely on color alone.
- Contrast **[OPEN]**, fix before launch: white on #B98946 tags is about 3:1 and turquoise links on white about 4:1, both below the 4.5:1 target for small text (bigger/bolder text, or slightly darker shades).
- **Light mode only** for version 1.

### Typography
- **Labels and menu:** thin, widely spaced uppercase sans (Harry's, Ekaterina Trukhan) — pill labels on cards, navigation, small headings.
- **Long reading:** a comfortable serif in a narrow centered column with generous line height (Simon Foster) — blog posts and longer pages.
- **Links:** turquoise #2A8C99, no underline (the dotted gold underline was tried and dropped).

### Layout
- **Homepage: bento card grid** (`bento-home.jpg`): the whole site on one screen, cards of different sizes, each with a **pill label** on top and a large title + subtitle at the bottom. Use the pattern, not that site's styling.
- **One-screen simplicity** (André Gonçalves): little text, lots of air.
- **Photography gallery:** orderly grid where the photos are the hero, no text over them (Ekaterina Trukhan).
- **Blog post:** minimal header (name + a few links), then the reading column.
- On phones the grid collapses to a single column of cards, in priority order.

### Illustration and texture
- **Version 1: no illustrations.** Text, color and photos only, so the design is fast to iterate. Leave room in the layout where illustrations could go later.
- **Later:**
  - **Illustration that tells a story** (1minus1): one drawing that explains an idea, such as photography and code meeting. **The camera at the center** (`mercado_tercera_cartel.jpg`), with life around it.
  - **Style:** hand-made — **ink / engraving** strokes (linocut, woodcut) and **watercolor texture**, in earthy colors on cream.
  - **Own illustrated icons** for sections and social links instead of generic logos (André Gonçalves).

### Photography presentation
- Warm light, wood, amber tones (photo book reference) — choose featured photos that carry that warmth.
- **Photography card as windows:** a mosaic of small openings showing real photos, like the die-cut photo book cover. Color photos on the left, black-and-white on the right (3 columns, 5 photos each, wide gap between), with "Color →" and "Black & White →" links under each side. No big title; just the gold tag.

## 5. Sitemap (version 1)

| Page | URL | Job |
|---|---|---|
| Home | `/` | Bento grid: every section at a glance |
| Photography | `/photography/` | Entry to the two portfolios |
| Color | `/photography/color/` | Color portfolio |
| Black & White | `/photography/black-and-white/` | Black-and-white portfolio |
| Blog | `/blog/` | Posts, newest first |
| Work | `/work/` | Developer projects and shipped apps |
| About | `/about/` | The story so far |
| 404 | `/404.html` | Friendly dead end with a link home |

## 6. Homepage cards (v1, built in `index.html`)

Size: **L** large, **M** medium (wide), **S** small. Every card is white with an outlined gold tag that fills on hover; the intro card has no tag.

| Card | Size | Content | Links to |
|---|---|---|---|
| Intro | L | "Hi, I'm **Cristian Valencia**." (name in turquoise) · "A simple human finding its way on the web." · ENGINEER · PHOTOGRAPHER · WRITER | — |
| Photography | L | Photo mosaic: 5 color photos left, 5 B&W right, with "Color →" / "Black & White →" under each | `/photography/color/`, `/photography/black-and-white/` |
| Blog | M | Latest post title + date ("First posts coming soon" until there is one) | latest post or `/blog/` |
| Work | M | "Engineering" · "Apps and products I've built" | `/work/` |
| About | S | "The story so far" · "Who I am and how I got here" | `/about/` |
| Company | S | "Hackart" · "hackart.com →" | https://www.hackart.com |
| Follow me: | S | Instagram @cris.chrome and @cris.monochrome | external |
| Contact | S | "Say hello" · cristian@hackart.com | `mailto:` |

- **Menu:** Home · Photography · Blog · Work · About; the current section gets a gold underline.
- **Footer:** tapping it cycles "© Cristian Valencia" → "In memory of Felipe Valencia" → "Made with ♥ in Mexico City".

## 7. Page content

### Photography
- Organized as **[TODO: collections / series / places / years?]**
- Each photo: image, optional title, place, date **[CONFIRM]**
- Show camera/lens details? **[TODO]**

### Blog
- Remove the default "Welcome to Jekyll" post.
- Topics and first posts **[TODO]**
- Categories or tags? **[TODO]**

### Work
Per project: name, one-line summary, role, stack, platform, link, 1–3 screenshots, one result.
Candidates **[TODO: pick and confirm each is OK to show publicly]**: Aspire Rewards, Griddy, other shipped apps.

Background for this section (from the current About page): Product Owner and Technical Lead, 10+ years in mobile, 10+ apps shipped on iOS and Android, cross-platform (.NET MAUI, Flutter, Uno, Avalonia, Xamarin.Forms) and native (Swift, SwiftUI), currently leading AI initiatives.

### About
Rewrite as a personal story, not just a professional summary **[TODO]**.

## 8. Contact and links

- Email: Cristian@Hackart.com **[CONFIRM — personal vs Hackart address]**
- GitHub: CristianValencia · X: crisvalenciamx
- Instagram / LinkedIn / other **[TODO]**

## 9. Constraints

- GitHub Pages with the custom domain `https://cristianvalencia.mx` (`CNAME` on main)
- English only, or English + Spanish? **[TODO]**
- Mobile first; light mode only for version 1
- WCAG 2.1 AA
- Photography means many large images: they must be resized and compressed (AVIF/WebP, several sizes) so pages stay fast.
