/**
 * state.js
 * Global app state.
 * Using a simple pub/sub pattern.
 */

class AppState {
    constructor() {
        this.regex = '';
        this.currentStage = 'regex'; // regex, enfa, nfa, dfa
        this.automata = {
            enfa: null,
            nfa: null,
            dfa: null
        };
        this.listeners = new Set();
    }

    setState(newState) {
        Object.assign(this, newState);
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
    }

    notify() {
        for (const listener of this.listeners) {
            listener(this);
        }
    }
}

export const appState = new AppState();
