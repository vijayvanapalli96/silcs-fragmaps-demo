# Learning Guide: SILCS FragMaps Viewer

**A beginner-friendly guide to understanding the code and architecture**

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure Explained](#file-structure-explained)
3. [Code Walkthrough](#code-walkthrough)
4. [Key Concepts](#key-concepts)
5. [How to Modify](#how-to-modify)

## Project Overview

This application is a **Single Page Application (SPA)** that runs entirely in the browser. No backend server is needed - all the code runs on the user's computer.

### What Happens When You Load the Page?

```
1. Browser loads index.html
2. index.html loads CSS (styles) and JavaScript (logic)
3. JavaScript waits for Mol* library to load
4. Creates 3D viewer in the black canvas area
5. Loads protein structure from PDB file
6. Builds UI controls dynamically
7. Sets up event listeners (what happens when you click buttons)
8. Ready for user interaction!
```

## File Structure Explained

### HTML (index.html)
**What it does:** Defines the structure of the page

```html
<header>      <!-- Top bar with title -->
<main>        <!-- Big 3D viewer canvas -->
<aside>       <!-- Right sidebar with tabs -->
```

Think of HTML as the **skeleton** - it defines what elements exist, but not how they look or behave.

### CSS (styles/main.css)
**What it does:** Makes everything look good

```css
:root {
    --panel-width: 350px;  /* Variables for easy changes */
}

.tab-button {
    /* How tabs look */
}
```

CSS is the **skin** - colors, sizes, spacing, animations.

### JavaScript (src/ folder)
**What it does:** Makes everything interactive

This is the **brain** - handles clicks, loads data, updates the 3D view.

---

## Code Walkthrough

### 1. Main Entry Point (src/main.js)

```javascript
// IMPORTING: Getting code from other files
import { MolecularViewer } from './components/Viewer.js';

// WAITING: Don't start until page is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // CODE HERE runs when page is ready
});
```

**Key concepts:**
- `import` - Brings in code from other files
- `addEventListener` - "When something happens, run this code"
- `async/await` - Handle things that take time (like loading files)

### 2. The Viewer Component (src/components/Viewer.js)

```javascript
export class MolecularViewer {
    constructor(containerId) {
        // Setup: Runs once when creating the viewer
        this.plugin = null;  // Will hold Mol* instance
    }

    async initialize() {
        // Create the 3D viewer
        this.plugin = await molstar.Viewer.create(container, {...});
    }

    async loadProtein(pdbPath) {
        // Load and display protein structure
        const data = await this.plugin.loadStructureFromUrl(pdbPath, 'pdb');
    }
}
```

**What is a class?**
Think of it like a blueprint for creating objects. `MolecularViewer` is a blueprint for creating viewers.

```javascript
// Creating a new viewer from the blueprint
const viewer = new MolecularViewer('molstar-viewer');
```

### 3. Configuration (src/utils/config.js)

```javascript
export const FRAGMAPS = [
    {
        id: 'hbdon',
        name: 'HBDON',
        color: '#2196F3',  // Blue color in hex
        defaultIsoValue: -1.2
    },
    // ... more FragMaps
];
```

**Why separate configuration?**
- Easy to change colors/values without touching complex code
- One place to manage all FragMaps
- Can add new FragMaps just by editing this file

### 4. UI Builder (src/utils/uiBuilder.js)

```javascript
export function buildFragMapControls() {
    FRAGMAPS.forEach(fragmap => {
        // For each FragMap, create HTML elements
        const item = document.createElement('div');
        item.innerHTML = `<toggle><slider>...`;
        container.appendChild(item);
    });
}
```

**Why build UI dynamically?**
Instead of writing 8 separate HTML blocks for 8 FragMaps, we loop through the array and generate them. If you add a 9th FragMap to config.js, it automatically appears!

---

## Key Concepts

### 1. ES6 Modules
```javascript
// fileA.js
export function hello() { return "Hi!"; }

// fileB.js
import { hello } from './fileA.js';
hello(); // "Hi!"
```

**Benefits:** Code is organized, no conflicts, easy to test individual pieces.

### 2. Async/Await (Handling Time)
```javascript
// OLD WAY (callback hell):
loadProtein(url, function(result) {
    loadLigand(url2, function(result2) {
        // ...
    });
});

// NEW WAY (async/await):
const protein = await loadProtein(url);
const ligand = await loadLigand(url2);
```

**Why?** Some things take time (loading files from server). `await` means "wait for this to finish before continuing."

### 3. Event Listeners
```javascript
button.addEventListener('click', () => {
    // This code runs when button is clicked
});
```

Think of it as **"When [EVENT] happens, do [THIS]"**

Common events:
- `click` - User clicks
- `change` - Dropdown/input changes
- `input` - User types in field

### 4. Arrow Functions
```javascript
// Old style
function add(a, b) {
    return a + b;
}

// Arrow function (modern)
const add = (a, b) => a + b;

// With event listeners
button.addEventListener('click', () => {
    console.log('Clicked!');
});
```

### 5. Template Literals
```javascript
const name = "HBDON";
const color = "#2196F3";

// Old way
const html = "<div style='color:" + color + "'>" + name + "</div>";

// New way (template literal)
const html = `<div style="color:${color}">${name}</div>`;
```

**Benefit:** Much easier to read, especially with complex HTML.

---

## How to Modify

### Change Panel Width
Edit [styles/main.css](styles/main.css), line ~29:
```css
--panel-width: 350px;  /* Make it 400px for wider */
```

### Add a New FragMap
Edit [src/utils/config.js](src/utils/config.js):
```javascript
{
    id: 'mynew',
    name: 'MY NEW MAP',
    file: 'path/to/mynew.dx',
    color: '#FF5733',  // Pick any color
    defaultIsoValue: -1.0,
    minIso: -3.0,
    maxIso: 0.0
}
```

That's it! It will automatically appear in the UI.

### Change Default Colors
Edit the `color` field in [src/utils/config.js](src/utils/config.js)

Find hex colors at: https://htmlcolorcodes.com

### Add a New Button
1. Add HTML in [index.html](index.html):
```html
<button id="myNewButton" class="btn-compact">My Button</button>
```

2. Add JavaScript in [src/main.js](src/main.js):
```javascript
document.getElementById('myNewButton')?.addEventListener('click', () => {
    console.log('Button clicked!');
    // Do something here
});
```

---

## Common Patterns

### Loading Data
```javascript
try {
    const data = await fetch('path/to/file.pdb');
    // Success! Use the data
} catch (error) {
    // Something went wrong
    console.error('Failed:', error);
}
```

### Updating UI
```javascript
// Find element
const element = document.getElementById('myId');

// Change text
element.textContent = 'New text';

// Change style
element.style.color = 'red';

// Add/remove class
element.classList.add('active');
element.classList.remove('hidden');
```

### Looping Through Arrays
```javascript
const ligands = ['lig1', 'lig2', 'lig3'];

// For each ligand
ligands.forEach(ligand => {
    console.log(ligand);
});

// Or with index
ligands.forEach((ligand, index) => {
    console.log(`${index}: ${ligand}`);
});
```

---

## Debugging Tips

### 1. Use Console
```javascript
console.log('Value:', myVariable);  // See what's in a variable
console.error('Oops:', error);      // Log errors in red
console.table(array);                // Show array as table
```

### 2. Check Browser DevTools
- **F12** or **Right-click → Inspect**
- **Console tab** - See logs and errors
- **Network tab** - See files loading
- **Elements tab** - See HTML structure

### 3. Common Errors

**"Cannot read property 'X' of undefined"**
- Something is `null` or `undefined`
- Check: Did the element load? Does the variable exist?

**"Module not found"**
- Check import path is correct
- Make sure file exists

**"CORS error"**
- You're opening file:// directly instead of using a web server
- Solution: Run `python -m http.server 8000`

---

## Next Steps to Learn More

1. **JavaScript Basics**
   - MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript

2. **ES6 Features**
   - Modules, arrow functions, async/await, destructuring

3. **DOM Manipulation**
   - How to create, modify, and remove HTML elements with JavaScript

4. **APIs and Fetch**
   - How to load data from files and servers

5. **Mol* Documentation**
   - https://molstar.org/viewer-docs/

---

**Questions?** Check the code comments - every function has an explanation!
