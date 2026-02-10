/**
 * move.js
 * Computes the set of states reachable from a set of states on a given input symbol.
 */

/**
 * Returns states reachable from `states` on input `symbol`.
 * @param {Set|Array} states 
 * @param {string} symbol 
 * @returns {Set}
 */
export function move(states, symbol) {
    const result = new Set();

    // Normalize iterator
    const iterator = (states instanceof Set) ? states : states;

    for (const s of iterator) {
        // Find transitions matching symbol
        const transitions = s.transitions.filter(t => t.symbol === symbol);
        for (const t of transitions) {
            result.add(t.to);
        }
    }

    return result;
}
