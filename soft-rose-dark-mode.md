# AstraCare AI: Soft Rose Dark Mode

The dark companion to the Soft Rose theme. It keeps the same warm, caring identity but uses a plum-black base, deeper hero pink and lighter pink accents so everything stays readable and comfortable at night.

---

## 1. Design Intent

| Goal | How dark mode achieves it |
|---|---|
| Same brand, different light | Same rose family as light mode, tuned for dark surfaces |
| Warm, not cold | Plum-black backgrounds instead of pure black or blue-gray |
| Comfortable at night | No glaring whites, softened text, reduced saturation on large areas |
| Clear depth | Surfaces get lighter as they rise (page, card, popover), instead of relying on shadows |
| Red keeps its meaning | Danger red is still reserved for real alerts |

---

## 2. What Changes From Light Mode

- **Hero gets deeper, small elements get lighter.** The hero uses a darker rose so white text stays readable. Links, active nav text and highlights use lighter pinks, because deep rose looks muddy on dark backgrounds.
- **Backgrounds are plum-black.** Pure black feels cold and harsh against pink.
- **Depth comes from lighter surfaces.** Each elevation step is slightly lighter than the one below.
- **The primary button flips.** It becomes a light rose fill with dark plum text.
- **Badges use dark tinted fills** with bright text in the same hue.

---

## 3. Color Palette

### Brand colors

| Role | Name | Hex |
|---|---|---|
| Hero gradient start | Deep rose | `#B85574` |
| Hero gradient end | Dusty mauve | `#9B5B7A` |
| Hero (flat fallback) | Hero rose | `#B24E70` |
| Primary (buttons, progress) | Soft rose | `#E8758F` |
| Link / active text | Light rose | `#F08CA8` |
| Highlight text (badges, active nav) | Pale rose | `#F5A3B8` |
| Accent | Light mauve | `#C98FAE` |

### Surfaces and borders

| Role | Name | Hex |
|---|---|---|
| Page background | Plum black | `#1A1216` |
| Sidebar | Dark plum | `#211820` |
| Card surface | Raised plum | `#251A20` |
| Popover / dropdown | Highest plum | `#2E2029` |
| Card border | Plum border | `#3A2A33` |
| Active nav fill / soft tint | Rose tint | `#3B2330` |

### Text

| Role | Name | Hex |
|---|---|---|
| Headings / primary text | Blush white | `#FBEFF3` |
| Muted / secondary text | Mauve grey | `#B79DA9` |
| Text on primary button | Deep plum | `#2B1520` |
| Text on hero | White | `#FFFFFF` |

### Status colors

| Role | Text / icon | Tint background |
|---|---|---|
| Success | `#4CC38A` | `#16332A` |
| Warning | `#E8B04A` | `#3A2E14` |
| Danger | `#F06A6A` | `#3A1A1E` |

### Optional teal accent

| Role | Hex |
|---|---|
| Teal | `#4CC3BC` |
| Teal tint (background / track) | `#17332F` |

---

## 4. Light vs Dark Mapping

| Role | Light mode | Dark mode |
|---|---|---|
| Page background | `#FFF8F9` | `#1A1216` |
| Sidebar / card surface | `#FFFFFF` | `#251A20` |
| Card border | `#F6E3E8` | `#3A2A33` |
| Hero | `#E8758F` to `#D4879C` | `#B85574` to `#9B5B7A` |
| Primary (buttons) | `#C2456B` | `#E8758F` (dark text on top) |
| Link / active text | `#C2456B` | `#F08CA8` |
| Tint (active nav, badges) | `#FCE4EC` | `#3B2330` |
| Heading text | `#3B2A33` | `#FBEFF3` |
| Muted text | `#8A7580` | `#B79DA9` |
| Teal accent | `#2BA6A0` | `#4CC3BC` |
| Success | `#2E9E6B` | `#4CC38A` |
| Danger | `#D93A3A` | `#F06A6A` |

---

## 5. CSS Variables

Define the light values on `:root` and override them for dark mode. The same variable names are used everywhere, so components never need to know which mode is active.

```css
:root {
  --color-hero-start: #E8758F;
  --color-hero-end:   #D4879C;
  --color-primary:    #C2456B;
  --color-link:       #C2456B;
  --color-accent:     #9B5B7A;

  --color-bg:         #FFF8F9;
  --color-sidebar:    #FFFFFF;
  --color-surface:    #FFFFFF;
  --color-popover:    #FFFFFF;
  --color-border:     #F6E3E8;
  --color-tint:       #FCE4EC;
  --color-tint-text:  #C2456B;

  --color-text:       #3B2A33;
  --color-text-muted: #8A7580;
  --color-on-primary: #FFFFFF;

  --color-success:    #2E9E6B;
  --color-warning:    #E0A030;
  --color-danger:     #D93A3A;

  --color-teal:       #2BA6A0;
  --color-teal-tint:  #E3F5F4;

  --gradient-hero: linear-gradient(135deg, var(--color-hero-start), var(--color-hero-end));
}

[data-theme="dark"] {
  --color-hero-start: #B85574;
  --color-hero-end:   #9B5B7A;
  --color-primary:    #E8758F;
  --color-link:       #F08CA8;
  --color-accent:     #C98FAE;

  --color-bg:         #1A1216;
  --color-sidebar:    #211820;
  --color-surface:    #251A20;
  --color-popover:    #2E2029;
  --color-border:     #3A2A33;
  --color-tint:       #3B2330;
  --color-tint-text:  #F5A3B8;

  --color-text:       #FBEFF3;
  --color-text-muted: #B79DA9;
  --color-on-primary: #2B1520;

  --color-success:    #4CC38A;
  --color-warning:    #E8B04A;
  --color-danger:     #F06A6A;

  --color-teal:       #4CC3BC;
  --color-teal-tint:  #17332F;
}
```

### Follow the system preference automatically

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* paste the same values as [data-theme="dark"] here */
  }
}
```

---

## 6. Theme Toggle Snippet

```js
const root = document.documentElement;
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

### Tailwind setup (class-based dark mode)

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        line: 'var(--color-border)',
        tint: 'var(--color-tint)',
        primary: 'var(--color-primary)',
        link: 'var(--color-link)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        teal: 'var(--color-teal)',
      },
    },
  },
};
```

---

## 7. Component Guidelines

### Hero banner
- Background: `--gradient-hero` (`#B85574` to `#9B5B7A`).
- Headline and body in white.
- "+ Daily Check-in" button: white fill with deep rose text (`#A8426A`).

### Sidebar navigation
- Sidebar background `--color-sidebar`, with a 1px `--color-border` edge.
- Default item: `--color-text-muted`.
- Hover: `--color-tint` at reduced opacity.
- **Active item: `--color-tint` fill with `--color-tint-text` text and icon.**
- Module badges (M2, M4...): `--color-tint` background with `--color-accent` text.

### Buttons
| Type | Background | Text |
|---|---|---|
| Primary | `--color-primary` (`#E8758F`) | `--color-on-primary` (`#2B1520`) |
| Secondary | `--color-tint` | `--color-tint-text` |
| Ghost / link | Transparent | `--color-link` |
| Danger | `#3A1A1E` | `#F58A8A` |

### Cards
- Background `--color-surface`, 1px border `--color-border`.
- **Skip drop shadows.** On dark backgrounds they barely show. Use the lighter surface and the border for separation.
- Labels in `--color-text-muted`, values in `--color-text`, links in `--color-link`.

### Badges
| Badge | Background | Text |
|---|---|---|
| Trimester 2 | `#3B2330` | `#F5A3B8` |
| Adaptive AI | `#33222E` | `#C98FAE` |
| 70% Reached | `#17332F` | `#4CC3BC` |
| +4.2% trend | `#16332A` | `#6FD6A2` |

### Progress bars
- Health score: fill `--color-primary` on track `--color-border`.
- Hydration: fill `--color-teal` on track `--color-teal-tint`.

### Charts and data visualization
- Use the lighter variants (`#F08CA8`, `#4CC3BC`, `#C98FAE`) for lines and bars.
- Gridlines in `--color-border`, axis labels in `--color-text-muted`.
- Avoid large areas of fully saturated color. Use 20 to 30% opacity fills under lines.

### Form inputs
- Background `#1F161C`, border `--color-border`, text `--color-text`.
- Focus ring: 2px `--color-primary` at 50% opacity.
- Placeholder text: `--color-text-muted` at 70%.

### Alerts
- Informational banner: background `#2A1A22`, border `--color-border`, link `--color-link`.
- Danger alerts: `--color-danger` text on `#3A1A1E`, always paired with an icon.

---

## 8. Elevation Scale

Higher layers are lighter. Shadows are optional and should stay subtle.

| Level | Use | Hex |
|---|---|---|
| 0 | Page | `#1A1216` |
| 1 | Sidebar | `#211820` |
| 2 | Cards | `#251A20` |
| 3 | Popovers, dropdowns, modals | `#2E2029` |

---

## 9. Accessibility Notes

- White on the hero start color (`#B85574`) is about 4.4:1 and white on the flat hero (`#B24E70`) is about 5:1. Both are fine for large or bold hero text.
- Deep plum text (`#2B1520`) on the primary button (`#E8758F`) passes AA comfortably.
- Blush white (`#FBEFF3`) on card surface (`#251A20`) is well above 12:1.
- Muted text (`#B79DA9`) on card surface is about 6:1, which is safe for secondary labels.
- Use `#FBEFF3` rather than pure `#FFFFFF` for body text on dark surfaces. It reduces glare and halation for people with astigmatism.
- Never rely on color alone for status. Pair color with an icon or label.

---

## 10. Do and Don't

**Do**
- Use lighter rose (`#F08CA8`) for text-level pinks on dark backgrounds.
- Separate layers with surface lightness and thin borders.
- Test every screen in both modes before the demo.
- Respect the system preference on first load, then remember the user's choice.

**Don't**
- Don't use pure black (`#000`) or pure white (`#FFF`) for backgrounds or body text.
- Don't reuse the light-mode deep rose (`#C2456B`) for text on dark backgrounds. It will look dull and low-contrast.
- Don't use fully saturated pinks on large areas, which tends to vibrate against dark backgrounds.
- Don't hardcode hex values in components. Always use the CSS variables so both modes stay in sync.

---

## 11. Quick Reference Swatches

| Swatch | Hex | Name |
|---|---|---|
| 🟥 | `#B85574` | Deep rose (hero) |
| 🟪 | `#9B5B7A` | Dusty mauve |
| 🟥 | `#E8758F` | Soft rose (primary) |
| 🟥 | `#F08CA8` | Light rose (links) |
| 🟪 | `#F5A3B8` | Pale rose (highlights) |
| ⬛ | `#1A1216` | Plum black (page) |
| ⬛ | `#251A20` | Raised plum (cards) |
| ⬛ | `#3A2A33` | Plum border |
| ⬜ | `#FBEFF3` | Blush white (text) |
| ⬜ | `#B79DA9` | Mauve grey (muted) |
| 🟦 | `#4CC3BC` | Teal (optional accent) |
