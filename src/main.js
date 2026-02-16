/**
 * SILCS FragMaps Viewer - Application Entry Point
 */

import { MolecularViewer } from './components/Viewer.js';
import { setupTabs } from './utils/tabs.js';
import { populateLigandSelector, buildFragMapControls, updateLigandInfo } from './utils/uiBuilder.js';
import { FRAGMAPS } from './utils/config.js';
import { showError, showSuccess, showInfo } from './utils/errorHandler.js';

// Global viewer instance
let viewer = null;

/**
 * Poll for 3Dmol.js CDN availability before initializing
 */
function wait3Dmol() {
    return new Promise((resolve, reject) => {
        if (typeof $3Dmol !== 'undefined') {
            resolve();
        } else {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof $3Dmol !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts > 50) {
                    clearInterval(checkInterval);
                    reject(new Error('3Dmol.js library failed to load'));
                }
            }, 100);
        }
    });
}

// Wait for page to fully load before initializing
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await wait3Dmol();
        
        viewer = new MolecularViewer('viewer-container');
        await viewer.initialize();
        await viewer.loadProtein('from_silcsbio/3fly.pdb');
        
        setupTabs();
        populateLigandSelector();
        buildFragMapControls();
        setupControls(viewer);
        setupFragMapControls(viewer);
        
        showSuccess('Viewer initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize viewer:', error);
        showError('Failed to load molecular viewer. Please refresh the page.', 0);
    }
});

/**
 * Bind UI controls to viewer actions
 */
function setupControls(viewer) {
    const ligandSelect = document.getElementById('ligandSelect');
    ligandSelect?.addEventListener('change', async (e) => {
        const ligandFile = e.target.value;
        if (ligandFile) {
            try {
                const ligandName = e.target.options[e.target.selectedIndex].text;
                showInfo(`Loading ${ligandName}...`);
                await viewer.loadLigand(ligandFile);
                updateLigandInfo(ligandName);
                showSuccess(`Loaded ${ligandName}`);
            } catch (error) {
                console.error('Failed to load ligand:', error);
                showError('Failed to load ligand. Please try another one.');
                e.target.selectedIndex = 0;
            }
        }
    });
    
    document.getElementById('resetView')?.addEventListener('click', () => {
        viewer.resetCamera();
    });
    
    document.getElementById('focusBinding')?.addEventListener('click', () => {
        viewer.focusBindingSite();
    });
    
    // Protein display
    document.getElementById('showCartoon')?.addEventListener('change', (e) => {
        viewer.toggleCartoon(e.target.checked);
    });
    
    document.getElementById('showSurface')?.addEventListener('change', (e) => {
        viewer.toggleSurface(e.target.checked);
    });

    document.getElementById('showBackbone')?.addEventListener('change', (e) => {
        viewer.toggleBackbone(e.target.checked);
    });

    // Ligand display style
    document.getElementById('showLigandSticks')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('showLigandBalls').checked = false;
            viewer.setLigandStyle('stick');
        }
    });

    document.getElementById('showLigandBalls')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('showLigandSticks').checked = false;
            viewer.setLigandStyle('ballAndStick');
        }
    });
    
    // Export
    document.getElementById('exportImage')?.addEventListener('click', () => {
        viewer.exportImage();
    });
}

/**
 * Wire up FragMap toggle switches and iso-value sliders
 */
function setupFragMapControls(viewer) {
    FRAGMAPS.forEach(fragmap => {
        const toggle = document.getElementById(`toggle-${fragmap.id}`);
        toggle?.addEventListener('change', async (e) => {
            const isVisible = e.target.checked;
            try {
                if (isVisible) {
                    // Load and display FragMap isosurface
                    await viewer.loadFragMap(
                        fragmap.id,
                        fragmap.file,
                        fragmap.color,
                        fragmap.defaultIsoValue
                    );
                    showSuccess(`${fragmap.name} FragMap loaded`);
                } else {
                    viewer.toggleFragMap(fragmap.id, false);
                }
            } catch (error) {
                console.error(`Failed to toggle FragMap ${fragmap.id}:`, error);
                showError(`Failed to load ${fragmap.name} FragMap`);
                e.target.checked = false;
            }
        });

        const slider = document.getElementById(`slider-${fragmap.id}`);
        const valueDisplay = document.getElementById(`isovalue-${fragmap.id}`);
        
        slider?.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            if (valueDisplay) {
                valueDisplay.textContent = newValue.toFixed(2);
            }
            viewer.updateFragMapIsoValue(fragmap.id, newValue);
        });
    });

    // Global FragMap controls
    document.getElementById('hideAllMaps')?.addEventListener('click', () => {
        viewer.hideAllFragMaps();
        // Uncheck all toggles
        FRAGMAPS.forEach(fragmap => {
            const toggle = document.getElementById(`toggle-${fragmap.id}`);
            if (toggle) toggle.checked = false;
        });
    });
}
