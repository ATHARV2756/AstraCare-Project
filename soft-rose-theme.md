# AstraCare AI: Soft Rose Theme

A warm, calm pink theme for a women's health platform. It keeps pink as the hero color but lowers saturation and shifts away from red-leaning tones, so the interface feels caring and trustworthy rather than alarming.

---

## 1. Design Intent

| Goal | How the theme achieves it |
|---|---|
| Clearly women's health | Rose and blush tones are the dominant brand colors |
| Calm, not alarming | Muted, slightly mauve pinks instead of hot crimson |
| Premium and modern | Warm off-white backgrounds and plum-toned text instead of pure black |
| Clear hierarchy | One deep rose for actions, softer tints for everything else |
| Red keeps its meaning | Red is reserved for real alerts and risk warnings |

---

## 2. Color Palette

### Brand colors

| Role | Name | Hex |
|---|---|---|
| Hero gradient start | Rose | `#E8758F` |
| Hero gradient end | Blush mauve | `#D4879C` |
| Primary (buttons, links, active nav text) | Deep rose | `#C2456B` |
| Accent | Dusty mauve | `#9B5B7A` |

### Surfaces and borders

| Role | Name | Hex |
|---|---|---|
| Page background | Warm blush white | `#FFF8F9` |
| Card surface | White | `#FFFFFF` |
| Card border | Pale pink | `#F6E3E8` |
| Active nav fill / soft highlight | Rose tint | `#FCE4EC` |

### Text

| Role | Name | Hex |
|---|---|---|
| Headings | Plum charcoal | `#3B2A33` |
| Body / muted | Mauve grey | `#8A7580` |
| Text on primary or hero | White | `#FFFFFF` |

### Status colors (functional)

| Role | Hex | Usage |
|---|---|---|
| Success | `#2E9E6B` | Synced, healthy, goal reached |
| Warning | `#E0A030` | Needs attention |
| Danger | `#D93A3A` | Real alerts and high-risk warnings only |

### Optional secondary accent: Teal

Use sparingly for the wearable, hydration and data-related elements to add variety and a clinical, trustworthy feel.

| Role | Hex |
|---|---|
| Teal accent | `#2BA6A0` |
| Teal tint (background) | `#E3F5F4` |

---

## 3. CSS Variables

```css
:root {
  /* Brand */
  --color-hero-start: #E8758F;
  --color-hero-end:   #D4879C;
  --color-primary:    #C2456B;
  --color-accent:     #9B5B7A;

  /* Surfaces */
  --color-bg:         #FFF8F9;
  --color-surface:    #FFFFFF;
  --color-border:     #F6E3E8;
  --color-tint:       #FCE4EC;

  /* Text */
  --color-text:       #3B2A33;
  --color-text-muted: #8A7580;
  --color-on-primary: #FFFFFF;

  /* Status */
  --color-success:    #2E9E6B;
  --color-warning:    #E0A030;
  --color-danger:     #D93A3A;

  /* Optional teal accent */
  --color-teal:       #2BA6A0;
  --color-teal-tint:  #E3F5F4;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, var(--color-hero-start), var(--color-hero-end));
}
```

### Tailwind config equivalent

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        rose: {
          hero1: '#E8758F',
          hero2: '#D4879C',
          primary: '#C2456B',
          tint: '#FCE4EC',
        },
        mauve: '#9B5B7A',
        blush: '#FFF8F9',
        line: '#F6E3E8',
        plum: '#3B2A33',
        muted: '#8A7580',
        teal: { DEFAULT: '#2BA6A0', tint: '#E3F5F4' },
      },
    },
  },
};
```

---

## 4. Component Guidelines

### Hero banner ("Welcome to Your Health Overview")
- Background: `--gradient-hero` (Rose to Blush mauve).
- Optional soft overlay: `rgba(255, 255, 255, 0.08)`.
- Headline in white, bold and large. If body text in the hero looks low-contrast, darken the gradient slightly (for example `#D9607F` to `#C97A90`).
- The "+ Daily Check-in" button stays white with `--color-primary` text.

### Sidebar navigation
- Default item: `--color-text-muted` icon and label.
- Hover: `--color-tint` background.
- **Active item: `--color-tint` fill with `--color-primary` text and icon** (not solid hot pink).
- Module badges (M2, M4...): `--color-tint` background with `--color-accent` text.

### Buttons
| Type | Background | Text |
|---|---|---|
| Primary | `--color-primary` | White |
| Secondary | `--color-tint` | `--color-primary` |
| Ghost / link | Transparent | `--color-primary` |

### Cards (Health Score, Pregnancy Journey, etc.)
- Background `--color-surface`, 1px border `--color-border`, soft shadow such as `0 4px 20px rgba(194, 69, 107, 0.06)`.
- Card labels in `--color-text-muted`, large values in `--color-text`.
- Card links ("View Cycle Calendar") use `--color-primary`.

### Badges and pills
Use pastel tints with darker text, not bright solid fills.

| Badge | Background | Text |
|---|---|---|
| Trimester 2 | `#FCE4EC` | `#C2456B` |
| Adaptive AI | `#F3E6EE` | `#9B5B7A` |
| 70% Reached (hydration) | `#E3F5F4` | `#1F807B` |
| +4.2% (positive trend) | `#E4F5EC` | `#2E9E6B` |

### Progress bars
- Health score bar: gradient from `--color-hero-start` to `--color-success`.
- Hydration bar: `--color-teal` on a `--color-teal-tint` track.
- Track color for others: `--color-border`.

### Alerts and banners
- Informational banner ("Progressive Profile Enhancement"): background `#FFF4F6`, border `--color-border`, link in `--color-primary`.
- Risk or critical alerts: `--color-danger` only. This keeps red meaningful.

---

## 5. Typography Pairing

| Use | Style |
|---|---|
| Headings, big numbers | Serif display font (as in current design), color `--color-text` |
| Body, labels | Clean sans-serif (Inter or similar), color `--color-text-muted` for secondary text |
| Section titles | Uppercase, letter-spaced, `--color-text` |

---

## 6. Accessibility Notes

- White text on `--color-primary` (`#C2456B`) gives roughly 4.8:1 contrast, which passes WCAG AA for normal text.
- White text on the lighter hero start color (`#E8758F`) is lower (around 3:1). Use large or bold text there, or darken the gradient slightly.
- Never rely on color alone for status. Pair color with an icon or label (for example a check icon with "Synced").
- Muted text `#8A7580` on white is fine for secondary labels, but avoid it for important information.

---

## 7. Do and Don't

**Do**
- Use the deep rose (`#C2456B`) for the main action on each screen.
- Use tints and soft shadows to create depth.
- Keep generous white space around cards.

**Don't**
- Don't reuse the hero gradient on small elements such as links or badges.
- Don't use pure black (`#000`). Use plum charcoal (`#3B2A33`).
- Don't use red for decorative purposes. It is for alerts only.

---

## 8. Quick Reference Swatches

| Swatch | Hex | Name |
|---|---|---|
| 🟥 | `#E8758F` | Rose |
| 🟪 | `#D4879C` | Blush mauve |
| 🟥 | `#C2456B` | Deep rose |
| 🟪 | `#9B5B7A` | Dusty mauve |
| ⬜ | `#FFF8F9` | Warm blush white |
| ⬜ | `#F6E3E8` | Pale pink |
| ⬛ | `#3B2A33` | Plum charcoal |
| ⬜ | `#8A7580` | Mauve grey |
| 🟦 | `#2BA6A0` | Teal (optional accent) |
