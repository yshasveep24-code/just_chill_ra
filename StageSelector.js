/**
 * StageSelector.js
 * Handles switching between visualization stages.
 */

import { appState } from '../../app/state.js';

export class StageSelector {
    constructor() {
        this.buttons = document.querySelectorAll('.stage-btn');

        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stage = e.target.dataset.stage;
                this.setStage(stage);
            });
        });

        appState.subscribe((state) => {
            // Update active button
            this.buttons.forEach(btn => {
                if (btn.dataset.stage === state.currentStage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }

    setStage(stage) {
        appState.setState({ currentStage: stage });
    }
}
