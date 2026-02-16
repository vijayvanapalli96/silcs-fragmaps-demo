/**
 * Molecular Viewer Component
 * Renders protein structure, ligands, and SILCS FragMap isosurfaces using 3Dmol.js
 */

import { DXParser } from '../utils/dxParser.js';

export class MolecularViewer {
    constructor(containerId) {
        this.containerId = containerId;
        this.viewer3d = null;
        this.proteinModel = null;
        this.ligandRef = null;
        this.ligandModel = null;
        this.surfaceVisible = false;
        this.surfaceId = null;
        this.fragMaps = new Map();
        this.showCartoon = true;
        this.showBackbone = false;
    }

    /** Create and configure the 3Dmol.js viewer instance */
    async initialize() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container ${this.containerId} not found`);
        }

        this.viewer3d = window.$3Dmol.createViewer(container, {
            backgroundColor: 'white',
            antialias: true
        });

        this.hideLoading();
        return this.viewer3d;
    }

    async loadProtein(pdbPath) {
        try {
            const response = await fetch(pdbPath);
            const pdbData = await response.text();
            
            this.proteinModel = this.viewer3d.addModel(pdbData, 'pdb');
            this.viewer3d.setStyle({model: this.proteinModel}, {cartoon: {color: 'spectrum'}});
            this.viewer3d.zoomTo();
            this.viewer3d.render();
            return true;
        } catch (error) {
            console.error('Error loading protein:', error);
            throw error;
        }
    }

    async loadLigand(sdfPath) {
        try {
            // Remove previous ligand if one is loaded
            if (this.ligandRef && this.ligandModel) {
                this.viewer3d.removeModel(this.ligandModel);
            }

            const response = await fetch(sdfPath);
            const sdfData = await response.text();
            
            this.ligandModel = this.viewer3d.addModel(sdfData, 'sdf');
            this.ligandModel.setStyle({}, {stick: {colorscheme: 'greenCarbon'}});

            // Zoom to ligand binding site with padding for FragMap context
            this.viewer3d.zoomTo({model: this.ligandModel}, 300);
            this.viewer3d.render();
            
            this.ligandRef = true;
            return true;
        } catch (error) {
            console.error('Error loading ligand:', error);
            throw error;
        }
    }

    resetCamera() {
        if (this.viewer3d) {
            this.viewer3d.zoomTo();
            this.viewer3d.render();
        }
    }

    async focusBindingSite() {
        if (this.ligandRef && this.ligandModel && this.viewer3d) {
            this.viewer3d.zoomTo({model: this.ligandModel}, 300);
            this.viewer3d.render();
        }
    }

    toggleCartoon(show) {
        this.showCartoon = show;
        this._updateProteinStyle();
    }

    toggleSurface(show) {
        if (this.viewer3d) {
            if (show) {
                this.surfaceId = this.viewer3d.addSurface(window.$3Dmol.SurfaceType.VDW, 
                    {opacity: 0.5, color: 'white'}, {model: 0});
            } else if (this.surfaceId !== null) {
                this.viewer3d.removeSurface(this.surfaceId);
                this.surfaceId = null;
            }
            this.surfaceVisible = show;
            this.viewer3d.render();
        }
    }

    toggleBackbone(show) {
        this.showBackbone = show;
        this._updateProteinStyle();
    }

    /** Apply all active protein representations together to avoid style conflicts */
    _updateProteinStyle() {
        if (!this.viewer3d || !this.proteinModel) return;

        const style = {};
        if (this.showCartoon) {
            style.cartoon = { color: 'spectrum' };
        }
        if (this.showBackbone) {
            style.stick = { color: '#999999', radius: 0.15 };
        }

        this.viewer3d.setStyle({ model: this.proteinModel }, style);
        this.viewer3d.render();
    }

    setLigandStyle(style) {
        if (!this.ligandModel || !this.viewer3d) return;
        
        const styles = {
            stick: {stick: {colorscheme: 'greenCarbon'}},
            ballAndStick: {stick: {colorscheme: 'greenCarbon'}, sphere: {scale: 0.3, colorscheme: 'greenCarbon'}},
            sphere: {sphere: {colorscheme: 'greenCarbon'}}
        };
        
        this.ligandModel.setStyle({}, styles[style] || styles.stick);
        this.viewer3d.render();
    }

    async loadFragMap(fragmapId, dxPath, color, isoValue) {
        try {
            const dxData = await DXParser.load(dxPath);
            
            if (!this.viewer3d) return dxData;
            
            // Convert OpenDX to CUBE format for 3Dmol.js
            const cubeText = DXParser.toCUBE(dxData, `FragMap ${fragmapId}`, `SILCS ${fragmapId} map`);
            const voldata = new window.$3Dmol.VolumeData(cubeText, "cube");
            
            const shape = this.viewer3d.addIsosurface(voldata, {
                isoval: isoValue,
                color: color,
                opacity: 0.85
            });
            
            this.fragMaps.set(fragmapId, {
                data: dxData,
                shape: shape,
                color: color,
                isoValue: isoValue,
                visible: true
            });
            
            this.viewer3d.render();
            return dxData;
        } catch (error) {
            console.error(`Error loading FragMap ${fragmapId}:`, error);
            throw error;
        }
    }

    toggleFragMap(fragmapId, visible) {
        if (!this.fragMaps.has(fragmapId) || !this.viewer3d) return;
        
        const fragmap = this.fragMaps.get(fragmapId);
        
        if (visible) {
            if (!fragmap.shape && fragmap.data) {
                const cubeText = DXParser.toCUBE(fragmap.data, `FragMap ${fragmapId}`, `SILCS ${fragmapId} map`);
                const voldata = new window.$3Dmol.VolumeData(cubeText, "cube");
                fragmap.shape = this.viewer3d.addIsosurface(voldata, {
                    isoval: fragmap.isoValue,
                    color: fragmap.color,
                    opacity: 0.85
                });
                this.viewer3d.render();
            }
        } else {
            if (fragmap.shape) {
                this.viewer3d.removeShape(fragmap.shape);
                fragmap.shape = null;
                this.viewer3d.render();
            }
        }
        
        fragmap.visible = visible;
    }

    updateFragMapIsoValue(fragmapId, isoValue) {
        if (this.fragMaps.has(fragmapId) && this.viewer3d) {
            const fragmap = this.fragMaps.get(fragmapId);
            fragmap.isoValue = isoValue;
            
            if (fragmap.visible && fragmap.shape && fragmap.data) {
                this.viewer3d.removeShape(fragmap.shape);
                
                const cubeText = DXParser.toCUBE(fragmap.data, `FragMap ${fragmapId}`, `SILCS ${fragmapId} map`);
                const voldata = new window.$3Dmol.VolumeData(cubeText, "cube");
                fragmap.shape = this.viewer3d.addIsosurface(voldata, {
                    isoval: isoValue,
                    color: fragmap.color,
                    opacity: 0.85
                });
                
                this.viewer3d.render();
            }
        }
    }

    hideAllFragMaps() {
        this.fragMaps.forEach((_, fragmapId) => {
            this.toggleFragMap(fragmapId, false);
        });
    }

    exportImage() {
        if (this.viewer3d) {
            const imgUri = this.viewer3d.pngURI();
            const link = document.createElement('a');
            link.download = 'silcs-fragmaps-view.png';
            link.href = imgUri;
            link.click();
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}
