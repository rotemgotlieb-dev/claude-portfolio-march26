# LexisNexis Image Audit — 2026-03-24

## Section A: What's Currently Placed

| Slot | File | Dimensions | Size | Quality Flags |
|------|------|-----------|------|---------------|
| **Hero** (full-width) | `img/lexisnexis/hero.png` | 1600 × 543 | 196K | OK width. Aspect ~3:1 (very wide/cinematic). 196K is on the low side for a hero — may lack detail at full screen width on retina. |
| **Overview image** (below Phase 1) | `img/lexisnexis/overview.png` | 1600 × 878 | 416K | Good dimensions. Best file size of the set — likely the most detailed image. |
| **Research image** (below Phase 1 text) | `img/lexisnexis/research-01.png` | 1600 × 955 | 288K | Good dimensions and size. Reasonable for a Dovetail/research screenshot. |
| **Prototype trio 1** | `img/lexisnexis/prototype-01.png` | 1600 × 833 | 260K | Good. ~2:1 ratio works well in a trio grid. |
| **Prototype trio 2** | `img/lexisnexis/prototype-02.png` | 1600 × 1186 | 380K | ⚠️ Tallest prototype image (almost 4:3). In a 3-up trio grid with the other two, this will either be cropped or force uneven card heights. |
| **Prototype trio 3** | `img/lexisnexis/prototype-03.png` | 1600 × 927 | 192K | OK width. 192K is borderline — may be a simpler/flatter UI screen. |
| **Token trio 1** | `img/lexisnexis/tokens-01.png` | 1600 × 1768 | 284K | ⚠️ VERY TALL — height exceeds width (1:1.1 portrait). Will crop badly in a trio grid or display as a huge vertical scroll. This is likely a full-page Figma export of a token table. |
| **Token trio 2** | `img/lexisnexis/tokens-02.png` | 1600 × 1039 | 224K | Slightly tall but manageable. ~3:2 ratio. |
| **Token trio 3** | `img/lexisnexis/tokens-03.png` | 1590 × 1400 | 236K | ⚠️ Nearly square (1:0.88). Also 1590px wide (10px short of 1600 — minor). Very tall for a trio slot. |
| **Homepage thumbnail** | `img/lexisnexis/thumbnail.png` | 800 × 463 | 120K | OK for a bento card thumbnail. 120K is adequate. |

### Summary of Issues
- **tokens-01.png** is portrait orientation (taller than wide) — problematic in a trio grid
- **tokens-03.png** is nearly square — also problematic in a trio grid
- **prototype-02.png** is significantly taller than the other two prototypes — will cause uneven trio
- **hero.png** at 196K may look thin/low-detail on retina displays at full viewport width

---

## Section B: What Else is Available

**The `Projects/LexisNexis/images/` directory contains the exact same 10 files that are already in `img/lexisnexis/`.** There are zero additional unused images.

| File | In Use? |
|------|---------|
| hero.png | ✅ Yes — case study hero |
| overview.png | ✅ Yes — overview section |
| research-01.png | ✅ Yes — Phase 1 research |
| prototype-01.png | ✅ Yes — prototype trio |
| prototype-02.png | ✅ Yes — prototype trio |
| prototype-03.png | ✅ Yes — prototype trio |
| tokens-01.png | ✅ Yes — token trio |
| tokens-02.png | ✅ Yes — token trio |
| tokens-03.png | ✅ Yes — token trio |
| thumbnail.png | ✅ Yes — homepage bento card |

**No unused images exist.** Every file in the source directory is already placed.

---

## Section C: Upgrade Recommendations

| Slot | Current Quality | Better Option Available? | Recommendation |
|------|----------------|------------------------|----------------|
| **Hero** | Adequate (1600×543, 196K) | No alternatives | ⚠️ Could benefit from a higher-resolution or more visually rich replacement. 196K for a full-width hero is lean. But no other options exist in the current files. |
| **Overview** | Good (1600×878, 416K) | No alternatives | ✅ Best image in the set. Keep. |
| **Research** | Good (1600×955, 288K) | No alternatives | ✅ Keep. Only research image available. |
| **Prototype trio** | Mixed — prototype-02 is too tall | No alternatives | ⚠️ The trio has mismatched aspect ratios (833 vs 1186 vs 927 height). Consider cropping prototype-02 to ~833px height to match the others, OR using CSS `object-fit: cover` with a fixed aspect ratio on the trio containers. |
| **Token trio** | Problematic — tokens-01 is portrait, tokens-03 nearly square | No alternatives | ⚠️ These three images have wildly different aspect ratios (1768, 1039, 1400 height). In a 3-up grid they'll look chaotic. Options: (1) crop all to a uniform height (~1000px), (2) use `object-fit: cover` with fixed aspect, or (3) replace with better-cropped exports from Figma. |
| **Thumbnail** | Adequate (800×463, 120K) | No alternatives | ✅ Fine for bento card. |

---

## Section D: What's Missing

### No additional source material exists in the project
The `Projects/LexisNexis/images/` directory has exactly 10 files, all already in use. The CLAUDE.md mentions that original content is on a USB drive at `/Volumes/LITTOLB/Claude Code Portfolio ORG/lexisnexis/` with categories including:
- React app screenshots
- Dovetail research
- User call screenshots
- Color palettes/tokens
- Figma screens

### Specific gaps:

1. **No second research image.** The case study has Phase 1 (User Research) as a major section but only one research screenshot (`research-01.png`). A Dovetail board overview, an affinity diagram, or a user call screenshot would strengthen this section.

2. **No pipeline/workflow diagram.** Phase 3 (Token Pipeline) describes a Figma → JSON → CSS → Storybook → React pipeline. A diagram or flowchart showing this architecture would be more impactful than the current token table screenshots, which are hard to read at trio scale.

3. **Token images are wrong aspect ratio for trio display.** You need either:
   - Three token-related images cropped to a consistent landscape ratio (~16:10 or 3:2), OR
   - A single wide token pipeline image replacing the trio entirely

4. **Hero could be stronger.** At 196K and 3:1 aspect, it's likely a simple color palette overview. A richer hero — showing the design system in context (e.g., Storybook with the token panel open, or a side-by-side of Figma ↔ Storybook) — would make a stronger first impression.

5. **No Figma screens.** The case study describes extensive Figma work (token libraries, component structures) but no Figma UI screenshots are in the image set.

6. **No before/after or comparison.** The narrative emphasizes transformation (full day → 30 seconds). A visual before/after comparison would be powerful but doesn't exist in current files.

### Actionable next steps:
- **If USB drive is accessible:** Mount it and audit `/Volumes/LITTOLB/Claude Code Portfolio ORG/lexisnexis/` for better source material
- **If Figma is accessible:** Export specific frames — the token library overview, the pipeline architecture, Storybook component examples
- **CSS fix (no new images needed):** Add `object-fit: cover` with fixed aspect ratio to `.case-image-trio .case-image-sm img` to normalize the current mismatched images
