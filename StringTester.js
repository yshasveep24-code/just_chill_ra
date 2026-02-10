/**
 * StringTester.js
 * Tests strings against the DFA to check acceptance.
 */

import { appState } from '../../app/state.js';

export class StringTester {
    constructor() {
        this.input = document.getElementById('test-string-input');
        this.btn = document.getElementById('test-string-btn');
        this.result = document.getElementById('test-result');

        this.btn.addEventListener('click', () => this.testString());

        // Test on Enter key
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.testString();
            }
        });
    }

    testString() {
        const testStr = this.input.value.trim();

        // Check if we have a DFA
        if (!appState.automata || !appState.automata.dfa) {
            this.showResult('Please visualize a regex first', 'error');
            return;
        }

        // Handle empty string
        if (testStr === '') {
            this.showResult('Please enter a test string', 'error');
            return;
        }

        const dfa = appState.automata.dfa;

        // Normalize the input string to lowercase to match the alphabet
        const normalizedStr = testStr.toLowerCase();

        const accepted = this.simulateDFA(dfa, normalizedStr);

        if (accepted) {
            this.showResult(`✓ "${testStr}" is ACCEPTED`, 'accepted');
        } else {
            this.showResult(`✗ "${testStr}" is REJECTED`, 'rejected');
        }
    }

    simulateDFA(dfa, input) {
        let currentState = dfa.startState;

        // Handle empty string case
        if (input === '') {
            return currentState.isAccepting;
        }

        for (const symbol of input) {
            // Find transition for this symbol
            const transition = currentState.transitions.find(t => t.symbol === symbol);

            if (!transition) {
                // No transition for this symbol - rejected
                console.log(`No transition from ${currentState.label} on symbol '${symbol}'`);
                return false;
            }

            currentState = transition.to;
        }

        // Check if we ended in an accepting state
        return currentState.isAccepting;
    }

    showResult(message, type) {
        this.result.textContent = message;
        this.result.className = `test-result-banner ${type}`;
    }
}
