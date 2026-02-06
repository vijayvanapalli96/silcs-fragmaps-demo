/**
 * FragMap Volumetric Viewer using 3Dmol.js
 * Handles 3D isosurface rendering of FragMaps
 */

import { DXParser } from '../utils/dxParser.js';

export class FragMapViewer {
    constructor(containerId) {
        this.containerId = containerId;
        this.viewer3d = null;
        this.fragMaps = new Map();
    }

    initialize() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            throw new Error(`Container ${this.containerId} not found`);
        }

        // Create 3Dmol viewer for FragMaps overlaid on Mol* protein
        this.viewer3d = window.$3Dmol.createViewer(container, {
            backgroundColor: 'black',
            antialias: true
        });

        console.log('✅ 3Dmol FragMap viewer initialized');
        return this.viewer3d;
    }

    async loadFragMap(fragmapId, dxPath, color, isoValue) {
        try {
            console.log(`🗺️  Loading FragMap ${fragmapId} from ${dxPath}`);
            
            // Parse DX file
            const dxData = await DXParser.load(dxPath);
            
            // Convert DX data to 3Dmol volumetric format
            const volumeData = this.convertDXToVolume(dxData);
            
            // Create isosurface with color
            const surfaceId = this.viewer3d.addVolumetricData(volumeData, "cube", {
                isoval: isoValue,
                color: color,
                alpha: 0.6,
                volscheme: {
                    gradient: 'rwb',
                    min: Math.min(...dxData.values),
                    max: Math.max(...dxData.values)
                }
            });

            // Store reference
            this.fragMaps.set(fragmapId, {
                data: dxData,
                surfaceId: surfaceId,
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

    convertDXToVolume(dxData) {
        const { gridCounts, origin, delta, values } = dxData;
        
        // Convert to 3Dmol volume format
        return {
            size: {
                x: gridCounts[0],
                y: gridCounts[1],
                z: gridCounts[2]
            },
            origin: {
                x: origin[0],
                y: origin[1],
                z: origin[2]
            },
            spacing: {
                x: delta[0][0],
                y: delta[1][1],
                z: delta[2][2]
            },
            data: new Float32Array(values)
        };
    }

    toggleFragMap(fragmapId, visible) {
        if (this.fragMaps.has(fragmapId)) {
            const fragmap = this.fragMaps.get(fragmapId);
            
            if (visible) {
                this.viewer3d.addVolumetricData(
                    this.convertDXToVolume(fragmap.data),
                    "cube",
                    {
                        isoval: fragmap.isoValue,
                        color: fragmap.color,
                        alpha: 0.6
                    }
                );
            } else {
                // Remove surface
                this.viewer3d.removeAllModels();
                // Re-add visible ones
                this.fragMaps.forEach((fm, id) => {
                    if (fm.visible && id !== fragmapId) {
                        this.viewer3d.addVolumetricData(
                            this.convertDXToVolume(fm.data),
                            "cube",
                            {
                                isoval: fm.isoValue,
                                color: fm.color,
                                alpha: 0.6
                            }
                        );
                    }
                });
            }
            
            fragmap.visible = visible;
            this.viewer3d.render();
            console.log(`FragMap ${fragmapId} ${visible ? 'shown' : 'hidden'}`);
        }
    }

    updateFragMapIsoValue(fragmapId, isoValue) {
        if (this.fragMaps.has(fragmapId)) {
            const fragmap = this.fragMaps.get(fragmapId);
            fragmap.isoValue = isoValue;
            
            if (fragmap.visible) {
                // Reload with new iso value
                this.toggleFragMap(fragmapId, false);
                this.toggleFragMap(fragmapId, true);
            }
            
            console.log(`FragMap ${fragmapId} iso-value: ${isoValue}`);
        }
    }

    hideAllFragMaps() {
        this.fragMaps.forEach((_, fragmapId) => {
            this.toggleFragMap(fragmapId, false);
        });
        this.viewer3d.render();
    }

    syncCamera(molstarViewer) {
        // Sync camera position with Mol* viewer
        // This would require camera state sharing between viewers
        console.log('Camera sync not yet implemented');
    }
}
