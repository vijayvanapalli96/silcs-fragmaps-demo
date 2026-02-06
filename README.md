# SILCS FragMaps 3D Viewer

**Interactive web-based molecular visualization for SILCS (Site Identification by Ligand Competitive Saturation) FragMaps**

A client-side web application for visualizing P38 MAP Kinase (PDB: 3FLY) protein structure, ligand poses, and SILCS FragMaps using 3Dmol.js.

![SILCS FragMaps Viewer](https://img.shields.io/badge/Status-Production-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🔬 Scientific Background

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

## 🎯 Features

- **Overview Page** - Scientific introduction explaining P38, SILCS, and FragMaps
- **3D Protein Visualization** - Interactive rendering of p38 MAP Kinase (PDB: 3FLY)
- **Ligand Library** - 31 pre-loaded SILCS-MC refined ligand poses
- **8 FragMap Types** - HBDON, HBACC, APOLAR, ACEC, MEOO, MAMN, TIPO, EXCL
- **Interactive Controls** - Toggle surfaces, adjust iso-values, zoom to binding site
- **100% Client-Side** - No backend required, deploy anywhere

## 🌐 Live Demo

**Live URL:** [https://vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html](https://vijayvanapalli96.github.io/silcs-fragmaps-demo/overview.html)

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/vijayvanapalli96/silcs-fragmaps-demo.git
cd silcs-fragmaps-demo

# Start local server
python -m http.server 8080

# Open browser to http://localhost:8080/overview.html
```

### Pages
- **`overview.html`** - Introduction & scientific background (start here)
- **`index.html`** - Interactive 3D viewer

## 🎮 Usage Guide

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

## 📊 FragMap Legend

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

## 🛠️ Tech Stack

- **3Dmol.js** - Molecular visualization library
- **Vanilla JavaScript** - ES6 modules, no frameworks
- **HTML5/CSS3** - Modern, responsive design

## 📁 Project Structure

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
    ├── ligands_posref/     # 30 refined ligand poses
    └── maps/               # 8 FragMap DX files
```

## 🎨 Design Decisions

1. **3Dmol.js over Mol*** - Chose 3Dmol.js for better volumetric data (FragMap) support
2. **No Build Step** - Pure ES6 modules for simplicity and easy deployment
3. **Two-Page Design** - Separate overview and viewer for clear navigation
4. **Dynamic UI** - FragMap controls generated from config for easy extensibility

## 📝 License

MIT License - see [LICENSE](LICENSE)

---
**Built for the SilcsBio Candidate Exercise** 💙
