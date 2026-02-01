# This directory contains the files required for the exercise

## NOTE - Files below are NOT confidential and hence being uploaded to a public git repo.

### 3fly.pdb

This is the p38 MAP Kinase protein PDB file. It was used as input for generation of SILCS FragMaps.

### maps

This subdirectory contains the .map and .dx formats of the different fragmaps needed to be visualized. You can choose to use either of the formats for this exercise.

### 3fly_cryst_lig.sdf

This is the crystal ligand extracted from the PDB 3fly in SDF format

### 3fly_cryst_lig_posref.sdf

This is the new pose (in SDF format) of the crystal ligand after performing the SILCS-MC Pose Refinement.
Atom-wise GFE is provided in the properties section.

### 3fly_cryst_lig_posref.pdb

This is the new pose (in PDB format) of the crystal ligand after performing the SILCS-MC Pose Refinement.
The b-factor column shows atom-wise GFE.

### ligands

This subdirectory contains the ligands the ligands were first aligned to the crystal ligand from the PDB 3fly.

### ligands_posref

This subdirectory contains the ligands docked using the SILCS-MC Pose Refinement protocol which performs limited MC sampling of translation, rotation and dihedrals to achieve minimized pose and LGFE score in the field of FragMaps.

