/**
 * Configuration - FragMap definitions, file paths, and ligand list
 */

// Base FragMap type definitions (color scheme and properties)
const FRAGMAP_TYPES = {
    'hbdon': { color: '#2196F3', name: 'HBDON', description: 'Hydrogen Bond Donor', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'hbacc': { color: '#F44336', name: 'HBACC', description: 'Hydrogen Bond Acceptor', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'apolar': { color: '#4CAF50', name: 'APOLAR', description: 'Apolar/Hydrophobic', defaultIsoValue: -1.0, minIso: -3.0, maxIso: 0.0 },
    'acec': { color: '#FF9800', name: 'ACEC', description: 'Aromatic C-H', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'meoo': { color: '#9C27B0', name: 'MEOO', description: 'Methoxy/Ether', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'mamn': { color: '#00BCD4', name: 'MAMN', description: 'Methylammonium', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'tipo': { color: '#FFEB3B', name: 'TIPO', description: 'Tert-butyl', defaultIsoValue: -1.2, minIso: -3.0, maxIso: 0.0 },
    'excl': { color: '#607D8B', name: 'EXCL', description: 'Exclusion', defaultIsoValue: 0.5, minIso: 0.0, maxIso: 3.0 }
};

// Configuration for detecting FragMap files
export const FRAGMAP_CONFIG = {
    directory: 'from_silcsbio/maps',
    filePattern: /^3fly\.(\w+)\.(?:gfe\.)?dx$/,  // Matches 3fly.{type}.gfe.dx or 3fly.{type}.dx
    proteinId: '3fly'
};

/**
 * Attempt to detect FragMap files from server directory listing.
 * Falls back to the static FRAGMAPS array on failure.
 */
export async function detectFragMaps() {
    try {
        // Attempt to list directory contents (works with some servers)
        const response = await fetch(FRAGMAP_CONFIG.directory + '/');
        const html = await response.text();
        
        // Parse directory listing for .dx files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        const fragmaps = [];
        links.forEach(link => {
            const filename = link.textContent.trim();
            const match = filename.match(FRAGMAP_CONFIG.filePattern);
            if (match) {
                const typeId = match[1];
                const typeConfig = FRAGMAP_TYPES[typeId];
                if (typeConfig) {
                    fragmaps.push({
                        id: typeId,
                        file: `${FRAGMAP_CONFIG.directory}/${filename}`,
                        ...typeConfig
                    });
                }
            }
        });
        
        return fragmaps.length > 0 ? fragmaps : FRAGMAPS;
    } catch {
        return FRAGMAPS;
    }
}

// Static FragMap list (fallback for when auto-detection fails)
export const FRAGMAPS = [
    {
        id: 'hbdon',
        file: 'from_silcsbio/maps/3fly.hbdon.gfe.dx',
        ...FRAGMAP_TYPES['hbdon']
    },
    {
        id: 'hbacc',
        file: 'from_silcsbio/maps/3fly.hbacc.gfe.dx',
        ...FRAGMAP_TYPES['hbacc']
    },
    {
        id: 'apolar',
        file: 'from_silcsbio/maps/3fly.apolar.gfe.dx',
        ...FRAGMAP_TYPES['apolar']
    },
    {
        id: 'acec',
        file: 'from_silcsbio/maps/3fly.acec.gfe.dx',
        ...FRAGMAP_TYPES['acec']
    },
    {
        id: 'meoo',
        file: 'from_silcsbio/maps/3fly.meoo.gfe.dx',
        ...FRAGMAP_TYPES['meoo']
    },
    {
        id: 'mamn',
        file: 'from_silcsbio/maps/3fly.mamn.gfe.dx',
        ...FRAGMAP_TYPES['mamn']
    },
    {
        id: 'tipo',
        file: 'from_silcsbio/maps/3fly.tipo.gfe.dx',
        ...FRAGMAP_TYPES['tipo']
    },
    {
        id: 'excl',
        file: 'from_silcsbio/maps/3fly.excl.dx',
        ...FRAGMAP_TYPES['excl']
    }
];

// List of all available ligands
export const LIGANDS = [
    { name: 'Crystal Ligand', file: 'from_silcsbio/3fly_cryst_lig_posref.sdf' },
    { name: 'p38_goldstein_05_2e', file: 'from_silcsbio/ligands_posref/p38_goldstein_05_2e.sdf' },
    { name: 'p38_goldstein_06_2f', file: 'from_silcsbio/ligands_posref/p38_goldstein_06_2f.sdf' },
    { name: 'p38_goldstein_07_2g', file: 'from_silcsbio/ligands_posref/p38_goldstein_07_2g.sdf' },
    { name: 'p38_goldstein_08_2h', file: 'from_silcsbio/ligands_posref/p38_goldstein_08_2h.sdf' },
    { name: 'p38_goldstein_09_2i', file: 'from_silcsbio/ligands_posref/p38_goldstein_09_2i.sdf' },
    { name: 'p38_goldstein_10_2j', file: 'from_silcsbio/ligands_posref/p38_goldstein_10_2j.sdf' },
    { name: 'p38_goldstein_11_2k', file: 'from_silcsbio/ligands_posref/p38_goldstein_11_2k.sdf' },
    { name: 'p38_goldstein_12_2l', file: 'from_silcsbio/ligands_posref/p38_goldstein_12_2l.sdf' },
    { name: 'p38_goldstein_13_2m', file: 'from_silcsbio/ligands_posref/p38_goldstein_13_2m.sdf' },
    { name: 'p38_goldstein_14_2n', file: 'from_silcsbio/ligands_posref/p38_goldstein_14_2n.sdf' },
    { name: 'p38_goldstein_15_2o', file: 'from_silcsbio/ligands_posref/p38_goldstein_15_2o.sdf' },
    { name: 'p38_goldstein_16_2p', file: 'from_silcsbio/ligands_posref/p38_goldstein_16_2p.sdf' },
    { name: 'p38_goldstein_17_2q', file: 'from_silcsbio/ligands_posref/p38_goldstein_17_2q.sdf' },
    { name: 'p38_goldstein_18_2r', file: 'from_silcsbio/ligands_posref/p38_goldstein_18_2r.sdf' },
    { name: 'p38_goldstein_19_2s_s', file: 'from_silcsbio/ligands_posref/p38_goldstein_19_2s_s.sdf' },
    { name: 'p38_goldstein_20_2t', file: 'from_silcsbio/ligands_posref/p38_goldstein_20_2t.sdf' },
    { name: 'p38_goldstein_21_2u', file: 'from_silcsbio/ligands_posref/p38_goldstein_21_2u.sdf' },
    { name: 'p38_goldstein_22_2v', file: 'from_silcsbio/ligands_posref/p38_goldstein_22_2v.sdf' },
    { name: 'p38_goldstein_24_2x', file: 'from_silcsbio/ligands_posref/p38_goldstein_24_2x.sdf' },
    { name: 'p38_goldstein_25_2y', file: 'from_silcsbio/ligands_posref/p38_goldstein_25_2y.sdf' },
    { name: 'p38_goldstein_26_2z', file: 'from_silcsbio/ligands_posref/p38_goldstein_26_2z.sdf' },
    { name: 'p38_goldstein_27_2aa', file: 'from_silcsbio/ligands_posref/p38_goldstein_27_2aa.sdf' },
    { name: 'p38_goldstein_28_2bb', file: 'from_silcsbio/ligands_posref/p38_goldstein_28_2bb.sdf' },
    { name: 'p38_goldstein_29_2cc_3fls', file: 'from_silcsbio/ligands_posref/p38_goldstein_29_2cc_3fls.sdf' },
    { name: 'p38_goldstein_30_2dd_3flq', file: 'from_silcsbio/ligands_posref/p38_goldstein_30_2dd_3flq.sdf' },
    { name: 'p38_goldstein_31_2ee', file: 'from_silcsbio/ligands_posref/p38_goldstein_31_2ee.sdf' },
    { name: 'p38_goldstein_32_2ff', file: 'from_silcsbio/ligands_posref/p38_goldstein_32_2ff.sdf' },
    { name: 'p38_goldstein_33_2gg', file: 'from_silcsbio/ligands_posref/p38_goldstein_33_2gg.sdf' },
    { name: 'p38_goldstein_34_2hh_3fmk', file: 'from_silcsbio/ligands_posref/p38_goldstein_34_2hh_3fmk.sdf' },
    { name: 'p38_goldstein_35_2ii_3fmh', file: 'from_silcsbio/ligands_posref/p38_goldstein_35_2ii_3fmh.sdf' }
];
