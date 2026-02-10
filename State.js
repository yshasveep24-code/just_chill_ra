/**
 * State.js
 * Represents a state in an automaton.
 */

let stateIdCounter = 0;

export class State {
    constructor(label = null) {
        this.id = stateIdCounter++;
        this.label = label || `q${this.id}`;
        this.transitions = []; // Array of Transition objects
        this.isAccepting = false;
        this.isStart = false; // Helper flag, though Automaton holds start state

        // Metadata for visualization or simulation
        this.metadata = {};
    }

    addTransition(transition) {
        this.transitions.push(transition);
    }

    getTransitions(symbol) {
        return this.transitions.filter(t => t.symbol === symbol);
    }

    // Reset counter (useful for restart)
    static resetCounter() {
        stateIdCounter = 0;
    }
}
