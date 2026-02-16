# SILCS FragMaps 3D Viewer

**Interactive web-based molecular visualization for SILCS (Site Identification by Ligand Competitive Saturation) FragMaps**

A client-side web application for visualizing P38 MAP Kinase (PDB: 3FLY) protein structure, ligand poses, and SILCS FragMaps using 3Dmol.js.

![License](https://img.shields.io/badge/License-MIT-blue)

## Scientific Background

### P38 MAP Kinase
P38 mitogen-activated protein kinase (p38 MAPK) is a critical enzyme involved in cellular stress responses, inflammation, and immune regulation. It plays a key role in diseases including rheumatoid arthritis, inflammatory bowel disease, and cancer, making it an important drug target.

### What Are SILCS FragMaps?
SILCS (Site Identification by Ligand Competitive Saturation) FragMaps are 3D probability maps generated from molecular dynamics simulations with small probe molecules. They reveal where specific chemical functional groups prefer to bind on a protein surface, providing a "blueprint" for rational drug design.

### Why FragMaps Matter
FragMaps enable medicinal chemists to:
- Identify binding hotspots before synthesizing compounds
- Optimize lead compounds by positioning functional groups in favorable regions
- Predict relative binding affinities (LGFE scores)
- Understand the energetic contributions of different molecular interactions

## Features

- **Overview Page** - Scientific introduction explaining P38, SILCS, and FragMaps
- **3D Protein Visualization** - Interactive rendering of p38 MAP Kinase (PDB: 3FLY)
- **Ligand Library** - 31 pre-loaded SILCS-MC refined ligand poses
- **8 FragMap Types** - HBDON, HBACC, APOLAR, ACEC, MEOO, MAMN, TIPO, EXCL
- **Interactive Controls** - Toggle surfaces, adjust iso-values, zoom to binding site
- **100% Client-Side** - No backend required, deploy anywhere

## Live Demo

**Live URL:** [https://vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html](https://vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html)

## Running Locally

The app uses ES6 modules, so it must be served over HTTP (not `file://`). Clone and start any local server:

```bash
git clone https://github.com/vijayvanapalli96/silcs-fragmaps-demo.git
cd silcs-fragmaps-demo
```

Then pick one:

```bash
# Python
python -m http.server 8080

# Node.js (no install needed)
npx serve .

# VS Code: install "Live Server" extension, right-click overview.html → Open with Live Server
```

Open `http://localhost:8080/overview.html` (or whichever port your server uses).

### Pages
- **`overview.html`** — Scientific introduction (start here)
- **`index.html`** — Interactive 3D viewer

## Usage Guide

### Navigation
- Start at the **Overview** page for scientific context
- Click **"Launch Interactive Viewer"** to explore the 3D structure

### Viewer Controls
- **Rotate** - Left click + drag
- **Zoom** - Mouse wheel  
- **Pan** - Right click + drag

### Loading Ligands
1. Click **Ligand** tab
2. Select from dropdown (31 ligands available)
3. Ligand displays in stick representation

### FragMaps
1. Click **FragMap** tab
2. Toggle switches to show/hide surfaces
3. Adjust iso-value sliders for threshold
4. Use "Hide all" to clear all maps

## FragMap Legend

| Type | Color | Description |
|------|-------|-------------|
| HBDON | Blue | H-Bond Donor |
| HBACC | Red | H-Bond Acceptor |
| APOLAR | Green | Hydrophobic |
| ACEC | Orange | Aromatic C-H |
| MEOO | Purple | Methoxy/Ether |
| MAMN | Cyan | Methylammonium |
| TIPO | Yellow | Tert-butyl |
| EXCL | Grey | Exclusion |

## Tech Stack

- **3Dmol.js** - Molecular visualization library
- **Vanilla JavaScript** - ES6 modules, no frameworks
- **HTML5/CSS3** - Modern, responsive design

## Project Structure

```
silcs-fragmaps-demo/
├── index.html              # Interactive 3D viewer
├── overview.html           # Scientific introduction
├── README.md               # This file
├── LICENSE                 # MIT License
├── src/
│   ├── main.js             # Application entry point
│   ├── components/
│   │   └── Viewer.js       # 3Dmol viewer component
│   └── utils/
│       ├── config.js       # FragMap & ligand configs
│       ├── dxParser.js     # OpenDX file parser
│       ├── errorHandler.js # Notification system
│       ├── tabs.js         # Tab navigation
│       └── uiBuilder.js    # Dynamic UI generation
├── styles/
│   └── main.css            # All styles
└── from_silcsbio/
    ├── 3fly.pdb            # Protein structure
    ├── 3fly_cryst_lig*.sdf # Crystal ligand
    ├── ligands_posref/     # 30 SILCS-MC refined ligand poses
    └── maps/               # 8 FragMap DX files
```

## Design Decisions & Tradeoffs

**3Dmol.js instead of Mol\*** — Mol* is more full-featured for structural biology, but 3Dmol.js has a simpler API for adding isosurfaces from volumetric data, which is the core requirement for FragMap visualization. The tradeoff is that 3Dmol.js does not natively read OpenDX files, so a custom DX → Gaussian CUBE converter (`dxParser.js`) was needed.

**No build step / no framework** — The app ships as plain ES6 modules with no bundler, transpiler, or npm dependencies. This makes deployment trivial (just copy files to any static host) and keeps the repo easy to review. The tradeoff is no minification, no tree-shaking, and no TypeScript type-checking.

**DX → CUBE conversion** — 3Dmol.js only accepts CUBE-format volumetric data. Rather than pre-converting the `.dx` files offline, the parser converts on-the-fly in the browser. This keeps the original SilcsBio data files untouched but adds ~100 ms of parsing overhead per FragMap.

**Two-page layout** — A separate overview page provides scientific context before the viewer. This mirrors the SilcsBio website pattern and keeps the viewer page focused on the 3D canvas. A single-page approach with a modal or collapsible panel would also work but felt more cluttered for a demo.

**Iso-value sliders re-render the full isosurface** — 3Dmol.js does not support updating an isosurface threshold in place, so changing the slider removes and re-adds the surface. This can cause a brief flicker on large maps but is acceptable for a prototype.

## License

MIT License — see [LICENSE](LICENSE)

## Links

- **Repository:** [github.com/vijayvanapalli96/silcs-fragmaps-demo](https://github.com/vijayvanapalli96/silcs-fragmaps-demo)
- **Live Demo:** [vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html](https://vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html)

---
Built for the SilcsBio Candidate Exercise
