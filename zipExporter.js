/**
 * zipExporter.js
 * Exports all stages (Regex, eNFA, NFA, DFA) as SVG/PNG in a ZIP.
 */

import { appState } from '../app/state.js';
import { GraphRenderer } from '../visualization/renderer/graphRenderer.js';
import { getSVGContent } from './svgExporter.js';
import { Automaton } from '../automata/model/Automaton.js';

export async function exportAllStages() {
    const zip = new JSZip(); // Global from index.html
    const stages = ['enfa', 'nfa', 'dfa'];

    // We need to render each stage to get its SVG.
    // This is tricky because the DOM is one.
    // Solution: Create an off-screen renderer or reuse current one sequentially.
    // Reusing current is easiest but flickers.
    // Let's use a temporary hidden container.

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.width = '800px';
    hiddenContainer.style.height = '600px';
    hiddenContainer.id = 'export-hidden-container';
    document.body.appendChild(hiddenContainer);

    const renderer = new GraphRenderer('export-hidden-container');

    try {
        for (const stage of stages) {
            const automata = appState.automata[stage];
            if (automata) {
                renderer.render(automata);
                const svg = hiddenContainer.querySelector('svg');
                const svgContent = getSVGContent(svg);

                // Add SVG to zip
                zip.file(`${stage}.svg`, svgContent);

                // Add PNG?
                // Canvas conversion needs async image loading.
                // We'll skip PNG in ZIP for speed/complexity, or try to do it.
                // Constraint: "Export all stages as ZIP (SVG + PNG)"
                // Okay, we need PNGs.

                await new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);

                    img.onload = () => {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, 800, 600);
                        ctx.drawImage(img, 0, 0);

                        canvas.toBlob((pngBlob) => {
                            zip.file(`${stage}.png`, pngBlob);
                            URL.revokeObjectURL(url);
                            resolve();
                        }, 'image/png');
                    };
                    img.src = url;
                });
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "automata_export.zip");

    } catch (e) {
        console.error("Export failed", e);
        alert("Export failed: " + e.message);
    } finally {
        document.body.removeChild(hiddenContainer);
    }
}
