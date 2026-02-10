/**
 * epsilonClosure.js
 * Computes the epsilon closure for a set of states.
 */

import { EPSILON } from '../epsilonNFA/epsilonUtils.js';

/**
 * Computes epsilon closure (states reachable via only epsilon transitions).
 * @param {Set|Array|State} states - Initial state(s)
 * @returns {Set} Set of states in the closure
 */
export function getEpsilonClosure(states) {
    const stack = [];
    const closure = new Set();

    // Normalize input to array
    let initialStates = [];
    if (states instanceof Set) {
        initialStates = Array.from(states);
    } else if (Array.isArray(states)) {
        initialStates = states;
    } else {
        initialStates = [states];
    }

    // Initialize
    for (const s of initialStates) {
        stack.push(s);
        closure.add(s);
    }

    while (stack.length > 0) {
        const current = stack.pop();

        // Find epsilon transitions
        const epsilonTransitions = current.transitions.filter(t => t.symbol === EPSILON);

        for (const t of epsilonTransitions) {
            if (!closure.has(t.to)) {
                closure.add(t.to);
                stack.push(t.to);
            }
        }
    }

    return closure;
}
