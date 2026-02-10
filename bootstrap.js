/**
 * bootstrap.js
 * Initializes the application modules.
 */

import { RegexInput } from '../ui/components/RegexInput.js';
import { StageSelector } from '../ui/components/StageSelector.js';
import { SimulationPanel } from '../ui/components/SimulationPanel.js';
import { StringTester } from '../ui/components/StringTester.js';
import { DiagramInteraction } from '../ui/components/DiagramInteraction.js';
import { ThemeController } from '../ui/components/ThemeController.js';
import { HelpModal } from '../ui/components/HelpModal.js';
import { ExamplesModal } from '../ui/components/ExamplesModal.js';
import { ClearButtons } from '../ui/components/ClearButtons.js';
import { ViewControls } from '../ui/components/ViewControls.js';
import { BatchTester } from '../ui/components/BatchTester.js';
import { InfoPanelController } from '../ui/components/InfoPanelController.js';
import { ToastController } from '../ui/components/ToastController.js';
import { ExportPanel } from '../export/exportController.js';
import { GraphRenderer } from '../visualization/renderer/graphRenderer.js';
import { appState } from './state.js';

export function bootstrap() {
    console.log('Bootstrap: Initializing application...');

    const themeController = new ThemeController();
    const regexInput = new RegexInput();
    const stageSelector = new StageSelector();
    const stringTester = new StringTester();
    const diagramInteraction = new DiagramInteraction();
    // const simulationPanel = new SimulationPanel(); // Disabled for clean UI redesign
    const exportPanel = new ExportPanel();

    // New advanced UI components
    const helpModal = new HelpModal();
    const examplesModal = new ExamplesModal();
    const clearButtons = new ClearButtons();
    const viewControls = new ViewControls();
    const batchTester = new BatchTester();
    const infoPanelController = new InfoPanelController();
    const toastController = new ToastController(); // Init last to catch everything


    // Subscribe renderer to state changes
    appState.subscribe((state) => {
        const stage = state.currentStage;
        const automata = state.automata;
        const container = document.getElementById('graph-container');

        // Only clear if we are in a "visualize" flow or if regex changed. Experimental.
        // Actually, if we want to show all 3, we should just render them if they exist.
        // But stageSelector might still be used for "Simulation Focus"?
        // The user said "give all result one after another".
        // Let's ignore currentStage for the main view and just render all available automata.

        if (!automata.enfa && !automata.nfa && !automata.dfa) {
            container.innerHTML = '<div style="padding:20px; text-align:center;"><p>Enter a regular expression and click Visualize to generate automata.</p></div>';
            return;
        }

        container.innerHTML = ''; // Clear previous

        const stages = [
            { id: 'enfa', label: 'Step 1: ε-NFA (Thompson\'s Construction)', data: automata.enfa },
            { id: 'nfa', label: 'Step 2: NFA (ε-Removal)', data: automata.nfa },
            { id: 'dfa', label: 'Step 3: DFA (Subset Construction)', data: automata.dfa }
        ];

        stages.forEach(s => {
            if (s.data) {
                const wrapper = document.createElement('div');
                wrapper.className = 'graph-wrapper';

                const title = document.createElement('h3');
                title.textContent = s.label;
                wrapper.appendChild(title);

                const canvas = document.createElement('div');
                canvas.className = 'graph-canvas';
                canvas.id = `canvas-${s.id}`;
                wrapper.appendChild(canvas);

                container.appendChild(wrapper);

                const renderer = new GraphRenderer(canvas);
                renderer.render(s.data);
            }
        });

        // Update Simulation Panel to point to the new DFA container?
        // SimulationPanel Logic needs to know which graph to highlight.
        // It uses "renderer" usually? No, SimulationPanel usually manipulates DOM directly via PathHighlighter.
        // PathHighlighter uses `document.querySelector` for nodes.
        // Since IDs are unique across the app (state IDs), highlighting should work?
        // WAIT: State IDs are unique.
        // BUT if we render multiple graphs, we might have ID collisions if we re-used IDs or if they are just generic.
        // State IDs are unique (incrementing counter).
        // However, we are rendering 3 different automata. They naturally have different State objects.
        // So IDs should be unique.
        // EXCEPT: NFA has new states, DFA has new states.
        // So `querySelector('.node[data-id="..."])` will find the specific node in the specific graph.
        // Perfect.
    });

    console.log('Bootstrap: Application initialized.');
}
