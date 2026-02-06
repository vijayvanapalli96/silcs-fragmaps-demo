/**
 * DX File Parser for SILCS FragMaps
 * Parses OpenDX format volumetric data files
 */

export class DXParser {
    /**
     * Parse DX file content and extract volumetric data
     * @param {string} content - Raw DX file content
     * @returns {Object} Parsed volumetric data with grid info and values
     */
    static parse(content) {
        const lines = content.split('\n');
        const result = {
            gridCounts: null,
            origin: null,
            delta: null,
            values: []
        };

        let inDataSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Parse grid dimensions
            if (line.startsWith('object 1 class gridpositions counts')) {
                const parts = line.split(/\s+/);
                result.gridCounts = [
                    parseInt(parts[5]),
                    parseInt(parts[6]),
                    parseInt(parts[7])
                ];
            }

            // Parse origin
            else if (line.startsWith('origin')) {
                const parts = line.split(/\s+/);
                result.origin = [
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ];
            }

            // Parse delta (grid spacing)
            else if (line.startsWith('delta')) {
                if (!result.delta) {
                    result.delta = [];
                }
                const parts = line.split(/\s+/);
                result.delta.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ]);
            }

            // Start of data section
            else if (line.includes('object 3 class array')) {
                inDataSection = true;
            }

            // Parse data values
            else if (inDataSection && line && !line.startsWith('attribute')) {
                const values = line.split(/\s+/).filter(v => v.length > 0);
                values.forEach(v => {
                    const num = parseFloat(v);
                    if (!isNaN(num)) {
                        result.values.push(num);
                    }
                });
            }
        }

        console.log(`Parsed DX: ${result.gridCounts?.join('x')} grid, ${result.values.length} values`);
        return result;
    }

    /**
     * Load DX file from URL
     * @param {string} url - URL to DX file
     * @returns {Promise<Object>} Parsed DX data
     */
    static async load(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load DX file: ${response.statusText}`);
            }
            const content = await response.text();
            return this.parse(content);
        } catch (error) {
            console.error(`Error loading DX file from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Convert OpenDX data to Gaussian CUBE format string
     * 3Dmol.js requires CUBE format for volumetric data
     * @param {Object} dxData - Parsed DX data from parse()
     * @param {string} title - Title for CUBE file (comment line 1)
     * @param {string} description - Description (comment line 2)
     * @returns {string} CUBE format text
     */
    static toCUBE(dxData, title = "SILCS FragMap", description = "Converted from OpenDX") {
        const { gridCounts, origin, delta, values } = dxData;
        const [nx, ny, nz] = gridCounts;
        
        // CUBE format uses Bohr units (atomic units)
        // DX files typically use Angstroms
        const ANGSTROM_TO_BOHR = 1.88973;
        const originBohr = origin.map(x => x * ANGSTROM_TO_BOHR);
        
        // Extract voxel spacing from delta matrix (assuming orthogonal grid)
        const voxelX = delta[0][0] * ANGSTROM_TO_BOHR;
        const voxelY = delta[1][1] * ANGSTROM_TO_BOHR;
        const voxelZ = delta[2][2] * ANGSTROM_TO_BOHR;
        
        let cube = "";
        
        // Line 1-2: Comment lines
        cube += `${title}\n`;
        cube += `${description}\n`;
        
        // Line 3: NATOMS ORIGIN_X ORIGIN_Y ORIGIN_Z
        // NATOMS=0 because we're only showing volumetric data, no atoms
        cube += `0 ${originBohr[0].toExponential(5)} ${originBohr[1].toExponential(5)} ${originBohr[2].toExponential(5)}\n`;
        
        // Line 4-6: NX VOXEL_X, NY VOXEL_Y, NZ VOXEL_Z (grid axes)
        cube += `${nx} ${voxelX.toExponential(5)} 0.000000E+00 0.000000E+00\n`;
        cube += `${ny} 0.000000E+00 ${voxelY.toExponential(5)} 0.000000E+00\n`;
        cube += `${nz} 0.000000E+00 0.000000E+00 ${voxelZ.toExponential(5)}\n`;
        
        // No atoms section (NATOMS = 0)
        
        // Data values: nested loops i,j,k with 6 values per line
        let count = 0;
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ny; j++) {
                for (let k = 0; k < nz; k++) {
                    const idx = i * ny * nz + j * nz + k;
                    cube += ` ${values[idx].toExponential(5)}`;
                    count++;
                    
                    // New line every 6 values
                    if (count % 6 === 0) {
                        cube += '\n';
                    }
                }
                // New line after each j-loop if not already added
                if (count % 6 !== 0) {
                    cube += '\n';
                }
            }
        }
        
        return cube;
    }
}
