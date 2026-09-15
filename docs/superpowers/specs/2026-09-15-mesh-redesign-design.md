# "The Mesh" — Premium 3D Portfolio Redesign

Date: 2026-09-15
Supersedes the visual/interaction layer of `2026-09-15-portfolio-rebuild-design.md`.
Content data (`content/*.ts`) is unchanged and remains the source of truth.

## The concept

Pavan builds **distributed AI systems**: agentic RAG pipelines, .NET Orleans actor
systems, event-driven CQRS architectures, Neo4j graph queries, multi-agent
orchestration. The vernacular of his work is *topology* — nodes, edges, message
flow, traces, live services.

So the portfolio is not a generic sci-fi space scene with floating polyhedra. **The
portfolio is a live distributed system you inspect.** His career is rendered as a
service mesh: each role, project, credential and skill cluster is a node; edges are
temporal/causal links with message particles flowing along them; the current role is
the one *live* node. Navigating the site is tracing through a running system.

This is the differentiator: the form is derived from the subject matter. A person who
builds meshes has a portfolio that is one.

## Tokens

### Color

Dark is required (emissive/glow only reads on dark), but deliberately *not* the
default near-black-plus-one-acid-accent. Base is a deep blue-violet void, and the
accent system is a **warm/cool duotone that encodes state**:

| Token | Hex | Role |
|---|---|---|
| `--void` | `#05070E` | Canvas background, deepest layer |
| `--surface` | `#0B1020` | Glass panel base (used at ~72% alpha + blur) |
| `--structure` | `#1B2540` | Inactive edges, hairlines, borders, grid |
| `--signal-cool` | `#5EE7D6` | Structure, inactive nodes, edges, secondary data |
| `--signal-warm` | `#FFB35C` | **Live/current node, active state, primary CTA** |
| `--text-high` | `#E8ECF5` | Headings, body |
| `--text-muted` | `#8B98B5` | Metadata, captions, mono readouts |

Rule: warm is reserved. Only the live/selected thing is amber. Everything structural
is cool. A viewer learns "amber = now" within seconds without being told.

### Type

Two families, clearly distinct, neither a default:

- **Sora** (variable, via `next/font/google`) — display and UI. Geometric, slightly
  futuristic, reads premium at large sizes with tight negative tracking. Used at
  weights 300/400/600/800.
- **JetBrains Mono** (via `next/font/google`) — technical metadata only, where mono
  carries real meaning: node IDs, date ranges as timestamps, tech-stack tokens,
  telemetry readouts. Not decorative small-caps labels.

Scale (rem, 1rem = 16px), modular ~1.333:
`--t-xs .75 / --t-sm .875 / --t-base 1 / --t-md 1.333 / --t-lg 1.777 / --t-xl 2.369 / --t-2xl 3.157 / --t-3xl 4.209 / --t-hero clamp(2.5rem, 9vw, 7rem)`

Display headings: weight 800, `letter-spacing: -0.03em`, `line-height: 0.95`.
Body: weight 400, `line-height: 1.6`, max width 66ch.
Mono metadata: `--t-xs`/`--t-sm`, `letter-spacing: 0.02em`.

Forbidden (generic tells): tracked-out ALL-CAPS eyebrow labels above headings;
meta strings joined with middle dots; `→` appended to link text; accenting one
single word of a headline in a different color.

### Space, radius, motion

Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128` px as `--s-1`…`--s-10`.

Radii are deliberately restrained and *differentiated by hierarchy* (not one radius
on everything): panels `14px`, pills `999px`, inputs `8px`, node tooltips `6px`.

Easing: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (primary),
`--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`.
Durations: `--d-fast 180ms / --d-base 320ms / --d-slow 620ms / --d-cine 1200ms`.
Lerp factor for all continuous follow behaviour (cursor, parallax, camera): `0.08`.

## Layout

One persistent full-bleed WebGL canvas. HTML overlays it in exactly three places —
top bar, right nav rail, left detail panel. Everything else is 3D or bare type on
the void. Glass is used on **only two** surfaces (top bar, detail panel); it is not
sprinkled on every element.

```
┌───────────────────────────────────────────────────────────────┐
│ PKV ·                                    ◦ live · open to work│ ← 56px glass bar
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                         ◉───────────◉                         │
│                        ╱             ╲                  ┌───┐ │
│                    ◉──◉    ◉(LIVE)    ◉──◉              │ o │ │ ← nav rail
│                        ╲             ╱                  │ o │ │   (right,
│                         ◉───────────◉                   │ ● │ │    vertical,
│                                                         │ o │ │    dot = layer)
│   ┌──────────────────────────┐                          │ o │ │
│   │ ◦ kovalty-swe            │                          └───┘ │
│   │ Software Engineer        │  ← detail panel, glass,         │
│   │ Jun 2024 — present       │    left, appears on select      │
│   │ ─────────────────────    │                                 │
│   │ · agentic RAG chatbot…   │                                 │
│   └──────────────────────────┘                                 │
└───────────────────────────────────────────────────────────────┘
```

Alignment: content is left-aligned throughout (confident, editorial). The only
centered moment is the hero name during the boot reveal. The mesh sits
asymmetrically — offset right of centre on desktop so the detail panel has room
without occluding the focused node.

Mobile: nav rail becomes a bottom horizontal rail; detail panel becomes a bottom
sheet at 62% height; mesh camera pulls back further and node count per layer is
reduced.

## Layers (the nav)

Same content, six views of one system. Switching a layer re-forms the mesh: nodes
animate to new positions, the camera repositions. It is not a page change; it is
changing what you are inspecting.

1. **Overview** — the whole mesh at distance, slow rotation, name + tagline. The
   landing state.
2. **Experience** — 7 role nodes on a temporal spine, current role live/amber.
3. **Projects** — 9 project nodes clustered by tier; featured ones larger/brighter.
4. **Credentials** — education + 24 certifications, grouped by issuer into sub-clusters.
5. **Skills** — 8 category clusters, each an orbiting shell of skill points.
6. **Contact** — mesh recedes; form + direct email + brand-icon socials come forward.

## The one bold moment

Per restraint: boldness is spent in exactly one place — **the boot sequence**.

On first load: a short trace-style boot. Camera starts *inside* the mesh. Nodes
resolve in (scale 0→1, staggered by depth). Edges draw (line dash offset animates).
Particles begin flowing. Camera pulls back to reveal the whole topology. Then the
name mask-reveals, bottom-up, once. Total ~2.6s, skippable on click, fully skipped
under `prefers-reduced-motion`.

Everything after that is quiet: no fade-up-on-scroll for every block, no hover
transition on every card. Motion answers actions — node focus, layer change, panel
open — and is otherwise still, apart from the always-on ambient life of the mesh
(slow drift, flowing particles) which is the point of the piece.

## Interaction

- **Custom cursor**: 8px cool dot + 28px ring, ring lerps behind the dot. Over a
  node the ring expands to 44px, turns amber, and a mono node-ID label attaches.
  Hidden entirely on touch devices and under reduced motion.
- **Node hover**: node emissive intensity up, its connected edges brighten, others
  stay cool. No scale-bounce.
- **Node select**: camera flies to it (lerped, ~900ms, `--ease-out`), unselected
  nodes drop to 35% opacity, detail panel slides in from left.
- **Mouse parallax**: whole mesh group rotates ±0.12rad, lerped at 0.08.
- **Keyboard**: nav rail and nodes are real focusable controls; arrow keys move
  between nodes in a layer; focus draws a visible cool ring; Escape closes the panel.

## Quality floor

- `prefers-reduced-motion`: no boot cinematics, no camera flights, no particles, no
  drift, no custom cursor. Mesh renders static; layer/panel changes are instant.
- **No WebGL / low-power / very small viewport**: render a complete DOM fallback of
  the same information (same content files, same layer structure, styled with the
  same tokens). The site must be fully usable and readable with zero WebGL.
- Perf: DPR clamped to `[1, 1.75]`, adaptive DPR under load, instanced particles and
  nodes, edges as a single merged line geometry per layer, canvas lazy-mounted
  client-side, `Preload all`.
- All panel copy is real DOM text — readable by screen readers and crawlers, never
  baked into textures.

## Out of scope

- Custom GLSL beyond a single background gradient/noise shader and the particle
  shader; no model loading, no physics.
- Sound.
- Custom domain / analytics.
