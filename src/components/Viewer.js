/**
 * Molecular Viewer Component using Mol*
 * Handles all 3D visualization of protein, ligands, and FragMaps
 */

import { DXParser } from '../utils/dxParser.js';

export class MolecularViewer {
    constructor(containerId) {
        this.containerId = containerId;
        this.plugin = null;
        this.viewer3d = null; // 3Dmol for FragMaps
        this.proteinRef = null;
        this.ligandRef = null;
        this.fragMaps = new Map(); // Store FragMap references
        this.fragMapData = new Map(); // Store parsed DX data
    }

    /**
     * Initialize Mol* viewer instance
     */
    async initialize() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container ${this.containerId} not found`);
        }

        console.log('🔧 Creating 3Dmol viewer...');

        // Use 3Dmol.js for everything (protein + FragMaps)
        this.viewer3d = window.$3Dmol.createViewer(container, {
            backgroundColor: 'white',
            antialias: true
        });

        console.log('✅ 3Dmol viewer created successfully');
        this.hideLoading();
        
        return this.viewer3d;
    }

    async loadProtein(pdbPath) {
        try {
            console.log(`📂 Loading PDB from: ${pdbPath}`);
            
            // Load PDB using 3Dmol
            const response = await fetch(pdbPath);
            const pdbData = await response.text();
            
            this.viewer3d.addModel(pdbData, 'pdb');
            this.viewer3d.setStyle({}, {cartoon: {color: 'spectrum'}});
            this.viewer3d.zoomTo();
            this.viewer3d.render();
            
            this.proteinRef = true;
            console.log('✅ Protein loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Error loading protein:', error);
            throw error;
        }
    }

    async loadLigand(sdfPath) {
        try {
            console.log(`💊 Loading ligand from: ${sdfPath}`);

            // Load SDF using 3Dmol
            const response = await fetch(sdfPath);
            const sdfData = await response.text();
            
            this.viewer3d.addModel(sdfData, 'sdf');
            this.viewer3d.setStyle({model: -1}, {stick: {colorscheme: 'greenCarbon'}});
            this.viewer3d.render();
            
            this.ligandRef = true;
            console.log('✅ Ligand loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Error loading ligand:', error);
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
        if (this.ligandRef && this.viewer3d) {
            this.viewer3d.zoomTo({model: -1});
            this.viewer3d.render();
        } else {
            console.warn('No ligand loaded to focus on');
        }
    }

    async toggleCartoon(show) {
        if (this.viewer3d) {
            this.viewer3d.setStyle({}, {cartoon: {color: 'spectrum', hidden: !show}});
            this.viewer3d.render();
        }
        console.log(`Cartoon visibility: ${show}`);
    }

    async toggleSurface(show) {
        if (this.viewer3d) {
            if (show) {
                this.viewer3d.addSurface(window.$3Dmol.SurfaceType.VDW, {opacity: 0.5, color: 'white'});
            } else {
                this.viewer3d.removeAllSurfaces();
            }
            this.viewer3d.render();
        }
        console.log(`Surface visibility: ${show}`);
    }

    async loadFragMap(fragmapId, dxPath, color, isoValue) {
        try {
            console.log(`🗺️  Loading FragMap ${fragmapId} from ${dxPath}`);
            
            // Fetch and parse DX file
            const dxData = await DXParser.load(dxPath);
            this.fragMapData.set(fragmapId, dxData);
            
            if (!this.viewer3d) {
                console.warn('3Dmol viewer not available');
                return dxData;
            }
            
            // Convert DX to CUBE format (3Dmol.js only supports CUBE)
            const cubeText = DXParser.toCUBE(dxData, `FragMap ${fragmapId}`, `SILCS ${fragmapId} map`);
            console.log(`Converted to CUBE format: ${cubeText.length} chars`);
            
            // Create VolumeData from CUBE format
            const voldata = new window.$3Dmol.VolumeData(cubeText, "cube");
            
            // Add isosurface to viewer
            const shape = this.viewer3d.addIsosurface(voldata, {
                isoval: isoValue,
                color: color,
                opacity: 0.85
            });
            
            // Store reference
            this.fragMaps.set(fragmapId, {
                data: dxData,
                shape: shape,
                color: color,
                isoValue: isoValue,
                visible: true
            });
            
            this.viewer3d.render();
            console.log(`✅ FragMap ${fragmapId} isosurface rendered`);
            
            return dxData;
        } catch (error) {
            console.error(`❌ Error loading FragMap ${fragmapId}:`, error);
            throw error;
        }
    }

    toggleFragMap(fragmapId, visible) {
        if (!this.fragMaps.has(fragmapId) || !this.viewer3d) {
            console.warn(`Cannot toggle FragMap ${fragmapId}: not loaded or viewer unavailable`);
            return;
        }
        
        const fragmap = this.fragMaps.get(fragmapId);
        
        if (visible) {
            // Show: re-add isosurface if data exists
            if (!fragmap.shape && fragmap.data) {
                const cubeText = DXParser.toCUBE(fragmap.data, `FragMap ${fragmapId}`, `SILCS ${fragmapId} map`);
                const voldata = new window.$3Dmol.VolumeData(cubeText, "cube");
                fragmap.shape = this.viewer3d.addIsosurface(voldata, {
                    isoval: fragmap.isoValue,
                    color: fragmap.color,
                    opacity: 0.85
                });
                this.viewer3d.render();
                console.log(`✅ FragMap ${fragmapId} shown`);
            }
        } else {
            // Hide: remove shape
            if (fragmap.shape) {
                this.viewer3d.removeShape(fragmap.shape);
                fragmap.shape = null;
                this.viewer3d.render();
                console.log(`✅ FragMap ${fragmapId} hidden`);
            }
        }
        
        fragmap.visible = visible;
    }

    updateFragMapIsoValue(fragmapId, isoValue) {
        if (this.fragMaps.has(fragmapId) && this.viewer3d) {
            const fragmap = this.fragMaps.get(fragmapId);
            fragmap.isoValue = isoValue;
            
            // Re-render isosurface with new iso-value if currently visible
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
            
            console.log(`🎚️  FragMap ${fragmapId} iso-value: ${isoValue}`);
        }
    }

    hideAllFragMaps() {
        this.fragMaps.forEach((_, fragmapId) => {
            this.toggleFragMap(fragmapId, false);
        });
        console.log('🙈 All FragMaps hidden');
    }

    async exportImage() {
        try {
            const imageData = await this.plugin.canvas3d?.getImagePass();
            if (imageData) {
                const link = document.createElement('a');
                link.download = 'silcs-fragmaps-view.png';
                link.href = imageData.imageData;
                link.click();
                console.log('📸 Image exported successfully');
            }
        } catch (error) {
            console.error('❌ Error exporting image:', error);
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}
