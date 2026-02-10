/**
 * SimulationPanel.js
 * UI for controlling the simulation.
 */

import { appState } from '../../app/state.js';
import { DFASimulator } from '../../simulation/dfaSimulator.js';
import { PathHighlighter } from '../../simulation/pathHighlighter.js';

export class SimulationPanel {
    constructor() {
        this.panel = document.querySelector('.simulation-controls');
        this.input = document.getElementById('sim-input');
        this.startBtn = document.getElementById('sim-start-btn');
        this.stepBtn = document.getElementById('sim-step-btn');
        this.resetBtn = document.getElementById('sim-reset-btn');
        this.status = document.getElementById('sim-status');

        this.simulator = null;
        this.highlighter = new PathHighlighter();
        this.inputString = '';

        this.startBtn.addEventListener('click', () => this.start());
        this.stepBtn.addEventListener('click', () => this.step());
        this.resetBtn.addEventListener('click', () => this.reset());

        appState.subscribe((state) => {
            // Show panel only if DFA is available and active
            if (state.currentStage === 'dfa' && state.automata.dfa) {
                this.panel.style.display = 'flex'; // or block
            } else {
                this.panel.style.display = 'none';
                this.reset(); // Reset if leaving DFA View
            }
        });
    }

    start() {
        const dfa = appState.automata.dfa;
        if (!dfa) return;

        this.inputString = this.input.value;
        this.simulator = new DFASimulator(dfa);

        this.stepBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.startBtn.disabled = true;
        this.input.disabled = true;

        this.status.textContent = 'Simulation started. Click Step.';
        this.highlighter.highlightState(this.simulator.currentState);
    }

    step() {
        if (!this.simulator) return;

        const res = this.simulator.step(this.inputString);

        if (res.done) {
            this.stepBtn.disabled = true;
            if (res.accepted) {
                this.status.textContent = 'Accepted!';
                this.status.style.color = 'green';
            } else {
                this.status.textContent = res.validTransition === false ? 'Rejected (No transition)' : 'Rejected (End of input)';
                this.status.style.color = 'red';
            }
        } else {
            this.status.textContent = `Processed '${res.char}'. Current State: ${res.state.label}`;
            this.highlighter.highlightState(res.state);
        }
    }

    reset() {
        this.simulator = null;
        this.stepBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.startBtn.disabled = false;
        this.input.disabled = false;
        this.status.textContent = '';
        this.inputString = '';

        if (this.highlighter) {
            this.highlighter.clearHighlights();
        }
    }
}
