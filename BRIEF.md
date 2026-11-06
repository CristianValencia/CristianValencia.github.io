# Site brief — cristianvalencia.mx

The source of truth for what this site says and who it's for. Design and code follow from this.
Raw ideas go in `IDEAS.md` first; settled decisions move here.
Items marked **[TODO]** need Cristian's input; items marked **[CONFIRM]** are drafts to approve or rewrite.

---

## 1. Purpose

A personal home for Cristian's whole life, not only a CV. It grows over time, one section at a time.

**Version 1 focuses on:**
1. **Photography portfolio** — the first thing to explore
2. **Journal** (at `/blog/`) — writing about anything: life, photography, tech
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
| Text | dark petrol #09191E; secondary text #424D50 |
| Card labels | bold (600) petrol uppercase text, no pill or outline, so they read as headers, not buttons; the intro card has none |
| Links and name accent | muted turquoise #2A8C99, no underline |
| Hover accent | deep gold #9F6E32 |

- Gold is used **sparingly**: the menu, the Contact button and the footer plaid.
- **Turquoise #2A8C99** (a darker take on the sea in `rehoboth-map.jpg`) is the one cool accent: text links and "Cristian Valencia" in the greeting. Tried as a card fill and as a border; both rejected.
- Petrol is for text only; no petrol-filled cards.
- Links have no underline. **[OPEN]** add an underline on hover so links don't rely on color alone.
- Contrast **[OPEN]**, fix before launch: white on the gold Contact button is about 3:1 and turquoise links on white about 4:1, both below the 4.5:1 target for small text (bigger/bolder text, or slightly darker shades).
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
- **Photography card as windows:** a mosaic of small openings showing real photos, like the die-cut photo book cover. Color photos on the left, black-and-white on the right (3 columns, 5 photos each, wide gap between), with "Color →" and "Black & White →" links under each side. No big title; just the card label.

## 5. Sitemap (version 1)

| Page | URL | Job |
|---|---|---|
| Home | `/` | Bento grid: every section at a glance |
| Photography | `/photography/` | Entry to the two portfolios |
| Color | `/photography/color/` | Color portfolio |
| Black & White | `/photography/black-and-white/` | Black-and-white portfolio |
| Journal | `/blog/` | "Latest thoughts" (a smaller Jost heading, 30px, 26px on phones): posts newest first, laid out like the posts' numbered steps (date in small gold deep caps where the number goes, bold turquoise title at the size of a post's section titles, then the subtitle or the first lines as an excerpt; on phones the date sits above the title) |
| My life | `/life/` | Called "My life" in the full menu and "Life" in the narrow pill and on phones, like Photography/Photos. The story so far (replaces About; `/about/` now forwards to Work) |
| Work | `/work/` | The professional bio (moved from About), in a journal post's type only (post layout with `plain: true`: title, subtitle and text, no byline, turquoise strips or journey), then developer projects and shipped apps |
| 404 | `/404.html` | Friendly dead end with a link home |

## 6. Homepage cards (v1, built in `index.html`)

Size: **L** large, **M** medium (wide). Every card is white with a bold petrol label on top; the intro card has none. The four small cards (About, Company, Follow me, Contact) were removed: Life (formerly About) and Contact are in the header, and the social links are in the footer.

| Card | Size | Content | Links to |
|---|---|---|---|
| Intro | L | "Hi, I'm **Cristian Valencia**." (name in turquoise) · "A simple human finding its way on the web." · ENGINEER · PHOTOGRAPHER · WRITER | — |
| Photography | L | Photo mosaic: 5 color photos left, 5 B&W right, with "Color →" / "Black & White →" under each | `/photography/color/`, `/photography/black-and-white/` |
| Journal | M | Latest post title + date ("First posts coming soon" until there is one) | latest post or `/blog/` |
| Work | M | "Engineering" · "Apps and products I've built" | `/work/` |

- **Page transitions:** moving between pages uses the browser's View Transitions (Chrome, Edge, Safari): the whole page crossfades, the old one fading out while the new one fades in and rises slightly, with the header staying in place (about 0.75s). Scrolling with the wheel, touch or keys ends it at once. Other browsers change pages instantly; off for reduced motion.
- **Header:** one line, sticky, always a gold light pill with white text, 16px from the top (8px on phones) both at load and once stuck. The name on the left links home, the menu (Photography · Journal · My life · Work) sits in the center, and a filled gold Contact button on the right opens the contact page. At the top the pill spans the card grid; once the page scrolls it narrows to 860px and the labels shorten to "Cris Valencia", "Photos" and "Life". The current page, Contact included, is a gold deep button with white text, and tapping it does nothing. On phones a hamburger opens the menu on a second line. Under 360px wide the section label after the name ("| Journal") stays hidden, so the name fits between the two icons. No Home item. A page can set `header: static` to keep it in place at the top (it scrolls away and never turns into the narrow pill); Contact does.
- **Footer:** full-width soft gold diagonal plaid (gold, gold deep and gold light 24px bands crossing at 45°, low opacity on the gray page ground, so the empty diamonds match the page), with a light film grain on the bands only, and 5px top and bottom edges in the gold light band's own transparency. With a mouse, a soft circle (radius 40% of the footer width on every screen) follows the cursor and shows a stronger plaid with the same bands and grain, fading back along a short trail. On touch screens the circle wanders on its own while the footer is on screen: slow (about 20px a second), random, drawn toward the center. Off for reduced motion. 400px tall, with two 400 × 68px pills stacked in the center, both on a 30% linen on white and lifting with the contact stamp's shadow as the light comes up. The first holds the Threads (@cris.chrome), Instagram (@cris.monochrome) and Foto (@cristianvalencia) icons: gray, with only the one closest to the light taking its brand colors. The second holds "Made with ♥ by **Hackart**" in Jost 26px, gray until the light comes up and then turquoise with the red heart (#B8452F); tapping it switches to "In memory of **Felipe Valencia**". Hovering an icon slowly crossfades the line into that account's handle (bold). Below the band, a 68px gold deep bar holds the copyright, centered, and Back to top on the right. On phones the band is shorter (four rows of the plaid's diamonds, about 146px, with the plaid laid out from its top edge so both edges land on the diamonds' tips at any phone width) with 240 × 38px pills, the icons always in their brand colors and no handles, and the gold bar is thinner (44px, plus 5px clear of the screen's rounded corners) with the copyright on the left. The light also strengthens both edge strips.

## 7. Page content

### Photography
- Organized as **[TODO: collections / series / places / years?]**
- Each photo: image, optional title, place, date **[CONFIRM]**
- Show camera/lens details? **[TODO]**
- **Linen everywhere**: every page's background is linen woven in code (`assets/js/linen.js`, matched to the Rule of Three site's linen), the **neutral linen** on the page gray #F7F7F7 at 20% of the reference's contrast. A page can set `linen: charcoal` for the **charcoal linen** (#161616 at 40%, with the header and text turned light); the Black & White page does. The footer keeps its plaid. The tile is woven once per visit and kept in sessionStorage.
- **Photo pages** (designed on the canvas's Photography page): `layout: print` with a `print:` block in front matter. The photo sits straight on the linen, with no frame or mat, sized so it fits on screen, with the title and text below it like a gallery label. For now, one sample on each portfolio page: the flower on Color, the deer on Black & White.

### Journal

- Called "Journal" in the menu and the tab title; the page itself is headed "Latest thoughts" so the word isn't repeated. The address stays `/blog/` so existing links keep working.
- Remove the default "Welcome to Jekyll" post.
- Post anatomy (designed on the canvas's "Blog post" board; sample: `_posts/2026-11-04-lorem-ipsum.md`), all in the 680px column: byline ("By Cristian Valencia", all bold turquoise Jost, one link to Work; hidden for now with `post_byline: false` in _config.yml **[DECIDE: keep or remove]**) → title → optional `subtitle` → turquoise details strip (Sections, date, reading time at about 200 words a minute, Share; on phones in two rows: Sections and Share, then the date and reading time, and one per line under 360px). On phones, reading pages (posts, Work, Life, Latest thoughts) sit 24px from the screen's edges, 8px further in than the header pill's 16px, so the pill frames the text as it does on desktop → post journey (folds open from Sections, titled with the count, e.g. "3 sections": every section as a stop on a winding line, three per row; tapping a stop glides there on a Motion spring) → cover photo (`image` in front matter, also the thumbnail; in the same white frame and light as the photos in the text, with an optional `image.caption`) → the text. The text can use section titles (`##`, `###`), italic, bold, underline, links, inline code, numbered steps (`{: .steps}` under a list), line breaks, photos with square corners, each in a white frame 812px wide (24px inside the header's compact pill on each side, so the pill frames it), 73px above and below it and 49px beside it, with the caption in gray in the frame's bottom 73px, and the contact postcard's 5px gold edge with its cursor light (on phones the white frame runs edge to edge, 16px beside the photo and 24px above and below, with no gold edge or light) (`{% raw %}{% include figure.html %}{% endraw %}`), and quotes in a white box framed by small plaid with the footer's light, in turquoise italics (24px on phones, so the color passes AA as large text), the frame as wide as the photo frames (812px) on wider screens while the words stay in line with the text column. Paragraphs use `text-wrap: pretty` and titles `text-wrap: balance`. The post ends on a full-width turquoise stripe on the footer: Sources (`sources` in front matter), "Written by a human. No Gen AI." with a short note, and the tags on the right. Both turquoise strips are 68px tall, like the footer's gold bar.
- Topics and first posts **[TODO]**
- Categories or tags? **[TODO]**

### Work
Per project: name, one-line summary, role, stack, platform, link, 1–3 screenshots, one result.
Candidates **[TODO: pick and confirm each is OK to show publicly]**: Aspire Rewards, Griddy, other shipped apps.

The bio that was on About now opens this page: Product Owner and Technical Lead, 10+ years in mobile, 10+ apps shipped on iOS and Android, cross-platform (.NET MAUI, Flutter, Uno, Avalonia, Xamarin.Forms) and native (Swift, SwiftUI), currently leading AI initiatives.

### Life
Was About; the professional bio moved to Work. A personal story **[TODO]**. The post byline now links to Work.

## 8. Contact and links

- **Contact page** (`/contact/`, designed on the canvas's "Contact — postcard" board): a landscape postcard as wide as the header. On the left, "Reason for contact" (General · Work · Photography, one required; General is picked to start) and the message with ruled lines in the blog's body type. A dashed divider of small soft-gold pills in the middle. On the right, a perforated stamp (the color flower on white linen, resizing with the card in multiples of 14) over To (Cristian Valencia), From and Reply to (bold Jost), then Send. Send stays a gray pill until every field is filled in, then turns gold; it opens the visitor's email app with the subject "Reason · A postcard from Name". A faint soft-gold edge and the divider catch the footer's light near the cursor. The card fills the first screen with equal room above and below; the footer sits just below it. On phones: reason (as a list) beside the stamp, the message, the pills lying flat, the address lines and Send.

- Email: Cristian@Hackart.com **[CONFIRM — personal vs Hackart address]**
- GitHub: CristianValencia · X: crisvalenciamx
- Instagram / LinkedIn / other **[TODO]**

## 9. Constraints

- GitHub Pages with the custom domain `https://cristianvalencia.mx` (`CNAME` on main)
- English only, or English + Spanish? **[TODO]**
- Mobile first; light mode only for version 1
- WCAG 2.1 AA
- Photography means many large images: they must be resized and compressed (AVIF/WebP, several sizes) so pages stay fast.
