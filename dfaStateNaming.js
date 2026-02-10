/**
 * dfaStateNaming.js
 * Renames states to q0, q1, q2... in a canonical order (e.g. BFS from start).
 */

export function renameStates(dfa) {
    // Collect states via BFS to ensure q0 is start, q1 is next closest, etc.
    const orderedStates = [];
    const visited = new Set();
    const queue = [dfa.startState];
    visited.add(dfa.startState.id);

    while (queue.length > 0) {
        const s = queue.shift();
        orderedStates.push(s);

        // Sort transitions by symbol for deterministic order?
        const transitions = [...s.transitions].sort((a, b) => {
            if (a.symbol < b.symbol) return -1;
            if (a.symbol > b.symbol) return 1;
            return 0;
        });

        for (const t of transitions) {
            if (!visited.has(t.to.id)) {
                visited.add(t.to.id);
                queue.push(t.to);
            }
        }
    }

    // Add any unreachable states? (Shouldn't happen in DFA from Subset, but valid for generic)
    for (const s of dfa.states) {
        if (!visited.has(s.id)) {
            orderedStates.push(s);
            visited.add(s.id);
        }
    }

    // Resize ID counter or just relabel?
    // Requirement says "State naming".
    orderedStates.forEach((s, index) => {
        s.label = `q${index}`;
    });
}
