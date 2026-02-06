/**
 * SILCS FragMaps Viewer - Main Application Entry Point
 * This is where everything starts when the page loads
 */

import { MolecularViewer } from './components/Viewer.js';
import { setupTabs } from './utils/tabs.js';
import { populateLigandSelector, buildFragMapControls, updateLigandInfo } from './utils/uiBuilder.js';
import { FRAGMAPS } from './utils/config.js';
import { showError, showSuccess, showInfo } from './utils/errorHandler.js';

// Global viewer instance
let viewer = null;

/**
 * Wait for 3Dmol.js library to load
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
    console.log('🚀 Initializing SILCS FragMaps Viewer...');

    try {
        // Wait for 3Dmol.js to be available
        await wait3Dmol();
        console.log('✅ 3Dmol.js library loaded');
        
        // Initialize the 3D viewer
        viewer = new MolecularViewer('molstar-viewer');
        await viewer.initialize();
        
        // Load the protein structure
        console.log('📦 Loading p38 MAP Kinase structure...');
        await viewer.loadProtein('from_silcsbio/3fly.pdb');
        
        // Build UI components
        setupTabs();
        populateLigandSelector();
        buildFragMapControls();
        
        // Initialize controls
        setupControls(viewer);
        setupFragMapControls(viewer);
        
        showSuccess('Viewer initialized successfully!');
        console.log('✅ Viewer initialized successfully!');
        
    } catch (error) {
        console.error('❌ Failed to initialize viewer:', error);
        showError('Failed to load molecular viewer. Please refresh the page.', 0);
    }
});

/**
 * Setup UI controls and event listeners
 */
function setupControls(viewer) {
    // Ligand selector dropdown
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
                console.log(`✅ Ligand loaded: ${ligandName}`);
            } catch (error) {
                console.error('❌ Failed to load ligand:', error);
                showError('Failed to load ligand. Please try another one.');
                e.target.selectedIndex = 0; // Reset to default
                alert('Failed to load ligand. Please try another one.');
            }
        }
    });
    
    // FragMap control buttons
    document.getElementById('hideAllMaps')?.addEventListener('click', () => {
        console.log('Hide all maps clicked');
        // We'll implement this when we add FragMaps
    });
    
    document.getElementById('resetView')?.addEventListener('click', () => {
        viewer.resetCamera();
    });
    
    document.getElementById('focusBinding')?.addEventListener('click', () => {
        viewer.focusBindingSite();
    });
    
    // Protein display controls
    document.getElementById('showCartoon')?.addEventListener('change', (e) => {
        viewer.toggleCartoon(e.target.checked);
    });
    
    document.getElementById('showSurface')?.addEventListener('change', (e) => {
        viewer.toggleSurface(e.target.checked);
    });
    
    // Export image button
    document.getElementById('exportImage')?.addEventListener('click', () => {
        viewer.exportImage();
    });
}

/**
 * Setup FragMap controls - toggles and sliders
 */
function setupFragMapControls(viewer) {
    // Setup each FragMap control
    FRAGMAPS.forEach(fragmap => {
        // Toggle checkbox
        const toggle = document.getElementById(`toggle-${fragmap.id}`);
        toggle?.addEventListener('change', async (e) => {
            const isVisible = e.target.checked;
            try {
                if (isVisible) {
                    showInfo(`Loading ${fragmap.name} FragMap...`);
                    // Load and show FragMap
                    await viewer.loadFragMap(
                        fragmap.id,
                        fragmap.file,
                        fragmap.color,
                        fragmap.defaultIsoValue
                    );
                    showSuccess(`${fragmap.name} FragMap loaded`);
                } else {
                    // Hide FragMap
                    viewer.toggleFragMap(fragmap.id, false);
                }
            } catch (error) {
                console.error(`Failed to toggle FragMap ${fragmap.id}:`, error);
                showError(`Failed to load ${fragmap.name} FragMap`);
                e.target.checked = false; // Revert toggle on error
            }
        });

        // Iso-value slider
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
