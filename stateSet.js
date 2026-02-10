/**
 * stateSet.js
 * Utility functions for handling sets of states.
 */

/**
 * Generates a unique key for a set of states.
 * Sorts IDs and joins them.
 * @param {Set|Array} stateSet 
 * @returns {string} canonical key
 */
export function getStateSetKey(stateSet) {
    const arr = Array.isArray(stateSet) ? stateSet : Array.from(stateSet);
    return arr
        .map(s => s.id)
        .sort((a, b) => a - b)
        .join(',');
}
