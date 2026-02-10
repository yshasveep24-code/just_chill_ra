/**
 * Transition.js
 * Represents a transition between states.
 */

export class Transition {
    /**
     * @param {State} from 
     * @param {State} to 
     * @param {string} symbol - 'ε' for epsilon or a character
     */
    constructor(from, to, symbol) {
        this.from = from;
        this.to = to;
        this.symbol = symbol;
    }
}
