/**
 * exportController.js
 * Handles export button clicks (SVG, PNG, JSON).
 */

import { appState } from '../app/state.js';
import { getSVGContent } from './svgExporter.js';
import { downloadPNG } from './pngExporter.js';

export class ExportPanel {
    constructor() {
        this.svgBtn = document.getElementById('export-svg-btn');
        this.pngBtn = document.getElementById('export-png-btn');
        this.jsonBtn = document.getElementById('export-json-btn');

        if (this.svgBtn) this.svgBtn.addEventListener('click', () => this.exportSVG());
        if (this.pngBtn) this.pngBtn.addEventListener('click', () => this.exportPNG());
        if (this.jsonBtn) this.jsonBtn.addEventListener('click', () => this.exportJSON());
    }

    getSVG() {
        let svg = document.querySelector('#canvas-dfa svg');
        if (!svg) svg = document.querySelector('.graph-canvas svg');

        if (!svg) {
            alert('No visualization to export.');
            return null;
        }

        return {
            element: svg,
            content: getSVGContent(svg),
            width: svg.clientWidth || 800,
            height: svg.clientHeight || 1000
        };
    }

    exportSVG() {
        const data = this.getSVG();
        if (!data) return;

        const blob = new Blob([data.content], { type: 'image/svg+xml;charset=utf-8' });
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, `automata_dfa.svg`);
        } else {
            // Fallback download
            this.fallbackDownload(blob, 'automata_dfa.svg');
        }
    }

    exportPNG() {
        const data = this.getSVG();
        if (!data) return;

        downloadPNG(data.content, data.width, data.height, `automata_dfa.png`);
    }

    exportJSON() {
        const automata = appState.automata;
        if (!automata || (!automata.enfa && !automata.nfa && !automata.dfa)) {
            alert('No automaton to export. Please visualize a regex first.');
            return;
        }

        const jsonData = {};

        // Export each automaton stage
        if (automata.enfa) jsonData.enfa = this.serializeAutomaton(automata.enfa, 'ε-NFA');
        if (automata.nfa) jsonData.nfa = this.serializeAutomaton(automata.nfa, 'NFA');
        if (automata.dfa) jsonData.dfa = this.serializeAutomaton(automata.dfa, 'DFA');

        jsonData.regex = appState.regex || '';

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

        if (typeof saveAs !== 'undefined') {
            saveAs(blob, `automata_${appState.regex || 'export'}.json`);
        } else {
            this.fallbackDownload(blob, `automata_export.json`);
        }
    }

    serializeAutomaton(automaton, type) {
        const states = [];
        const transitions = [];

        automaton.states.forEach(state => {
            states.push({
                id: state.id,
                label: state.label,
                isStart: state.isStart || false,
                isAccepting: state.isAccepting || false
            });

            state.transitions.forEach(t => {
                transitions.push({
                    from: t.from.label || t.from.id,
                    to: t.to.label || t.to.id,
                    symbol: t.symbol
                });
            });
        });

        return {
            type: type,
            states: states,
            transitions: transitions,
            alphabet: Array.from(automaton.alphabet),
            startState: automaton.startState ? (automaton.startState.label || automaton.startState.id) : null,
            acceptStates: Array.from(automaton.acceptStates).map(s => s.label || s.id)
        };
    }

    fallbackDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
