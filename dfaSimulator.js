/**
 * dfaSimulator.js
 * Simulates a DFA on an input string.
 */

export class DFASimulator {
    constructor(dfa) {
        this.dfa = dfa;
        this.currentState = dfa.startState;
        this.history = []; // Array of { state, char, nextState }
        this.position = 0; // Index in input string
    }

    reset() {
        this.currentState = this.dfa.startState;
        this.history = [];
        this.position = 0;
    }

    /**
     * Steps the simulation forward.
     * @param {string} inputString 
     * @returns {Object} result { accepted, validTransition, nextState }
     */
    step(inputString) {
        if (this.position >= inputString.length) {
            return { done: true, accepted: this.currentState.isAccepting };
        }

        const char = inputString[this.position];

        // Find transition
        const transition = this.currentState.transitions.find(t => t.symbol === char);

        if (transition) {
            const prevState = this.currentState;
            this.currentState = transition.to;
            this.history.push({
                from: prevState,
                char: char,
                to: this.currentState
            });
            this.position++;

            return {
                done: false,
                validTransition: true,
                state: this.currentState,
                char: char
            };
        } else {
            // No transition -> Trap / Reject
            return {
                done: true,
                validTransition: false,
                accepted: false
            };
        }
    }
}
