/**
 * Automaton.js
 * Represents an automaton (NFA, DFA, or ε-NFA).
 */

import { Transition } from './Transition.js';

export class Automaton {
    constructor() {
        this.states = new Set();
        this.startState = null;
        this.acceptStates = new Set();
        this.alphabet = new Set();
    }

    addState(state) {
        this.states.add(state);
        if (state.isAccepting) {
            this.acceptStates.add(state);
        }
    }

    setStartState(state) {
        this.startState = state;
        state.isStart = true;
        this.addState(state);
    }

    addTransition(from, to, symbol) {
        // Ensure states exist in the automaton
        this.addState(from);
        this.addState(to);

        // Add vocabulary
        if (symbol !== 'ε') {
            this.alphabet.add(symbol);
        }

        // Check if transition already exists to avoid duplicates
        const exists = from.transitions.some(t => t.to === to && t.symbol === symbol);
        if (!exists) {
            const transition = new Transition(from, to, symbol);
            from.addTransition(transition);
        }
    }

    // Helper to collect all states (if traversing)
    // But we maintain a Set of states, so it's easy.
}
