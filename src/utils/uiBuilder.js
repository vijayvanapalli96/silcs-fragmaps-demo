/**
 * UI Builder Utilities
 * Functions to dynamically create UI elements
 */

import { FRAGMAPS, LIGANDS } from './config.js';

/**
 * Populate the ligand dropdown with all available ligands
 */
export function populateLigandSelector() {
    const select = document.getElementById('ligandSelect');
    if (!select) return;

    // Clear existing options (except the first "Select ligand..." option)
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Add all ligands from config
    LIGANDS.forEach(ligand => {
        const option = document.createElement('option');
        option.value = ligand.file;
        option.textContent = ligand.name;
        select.appendChild(option);
    });

    console.log(`📋 Populated ligand selector with ${LIGANDS.length} ligands`);
}

/**
 * Generate FragMap control UI elements
 */
export function buildFragMapControls() {
    const container = document.getElementById('fragmapControls');
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    FRAGMAPS.forEach(fragmap => {
        // Create FragMap item container
        const item = document.createElement('div');
        item.className = 'fragmap-item';
        item.dataset.fragmapId = fragmap.id;

        // Header with name and toggle
        const header = document.createElement('div');
        header.className = 'fragmap-header';
        
        // Name with color indicator
        const nameDiv = document.createElement('div');
        nameDiv.className = 'fragmap-name';
        nameDiv.innerHTML = `
            <div class="fragmap-color" style="background-color: ${fragmap.color};"></div>
            <span>${fragmap.name}</span>
        `;

        // Toggle switch
        const toggle = document.createElement('label');
        toggle.className = 'fragmap-toggle';
        toggle.innerHTML = `
            <input type="checkbox" id="toggle-${fragmap.id}">
            <span class="toggle-slider"></span>
        `;

        header.appendChild(nameDiv);
        header.appendChild(toggle);

        // Iso-value slider control
        const isoControl = document.createElement('div');
        isoControl.className = 'isovalue-control';
        isoControl.innerHTML = `
            <div class="isovalue-label">
                <span>Iso-value</span>
                <span class="isovalue-value" id="isovalue-${fragmap.id}">${fragmap.defaultIsoValue.toFixed(2)}</span>
            </div>
            <input 
                type="range" 
                id="slider-${fragmap.id}"
                min="${fragmap.minIso}" 
                max="${fragmap.maxIso}" 
                step="0.1" 
                value="${fragmap.defaultIsoValue}"
            >
        `;

        item.appendChild(header);
        item.appendChild(isoControl);
        container.appendChild(item);
    });

    console.log(`🎨 Generated ${FRAGMAPS.length} FragMap controls`);
}

/**
 * Update ligand info display
 */
export function updateLigandInfo(ligandName) {
    const infoDiv = document.getElementById('ligandInfo');
    const nameSpan = document.getElementById('currentLigandName');
    
    if (infoDiv && nameSpan) {
        if (ligandName) {
            nameSpan.textContent = ligandName;
            infoDiv.style.display = 'block';
        } else {
            infoDiv.style.display = 'none';
        }
    }
}
