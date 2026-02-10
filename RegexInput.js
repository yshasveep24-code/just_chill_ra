/**
 * RegexInput.js
 * Handles regex input and validation.
 */

import { appState } from '../../app/state.js';
import { tokenize } from '../../parser/regexTokenizer.js';
import { validate } from '../../parser/regexValidator.js';
import { toPostfix } from '../../parser/regexToPostfix.js';
import { evaluate } from '../../parser/postfixEvaluator.js';
import { removeEpsilons } from '../../automata/nfa/epsilonRemoval.js';
import { toDFA } from '../../automata/dfa/subsetConstruction.js';
import { renameStates } from '../../automata/dfa/dfaStateNaming.js';

export class RegexInput {
    constructor() {
        this.input = document.getElementById('regex-input');
        this.btn = document.getElementById('visualize-btn');

        this.btn.addEventListener('click', () => this.process());

        // Trigger visualize on Enter key
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.process();
            }
        });
    }

    process() {
        const regex = this.input.value.trim();
        if (!regex) return;

        // Warn about Kleene star (*) complexity via toast
        if (regex.includes('*')) {
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
                const toast = document.createElement('div');
                toast.className = 'toast toast-warning';
                toast.textContent = '⚠️ Kleene star (*) detected — may create complex automata with many states.';
                toastContainer.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            }
        }

        try {
            // 1. Parse & Validate
            const tokens = tokenize(regex);
            validate(tokens);
            const postfix = toPostfix(tokens);

            // 2. Build Automata
            // ε-NFA
            const enfa = evaluate(postfix);

            // NFA
            const nfa = removeEpsilons(enfa);

            // DFA
            const dfa = toDFA(nfa);
            renameStates(dfa);

            // Update State
            appState.setState({
                regex: regex,
                currentStage: 'enfa', // Auto-switch to first stage
                automata: {
                    enfa: enfa,
                    nfa: nfa,
                    dfa: dfa
                }
            });
            console.log('Automata generated and stage switched to enfa.');

        } catch (e) {
            console.error('Regex error:', e);
            // Show error as toast or inline
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
                const toast = document.createElement('div');
                toast.className = 'toast toast-error';
                toast.textContent = e.message || 'Invalid regex';
                toastContainer.appendChild(toast);
                setTimeout(() => toast.remove(), 5000);
            }
        }
    }
}
