/**
 * fragment.js
 * Represents a partial NFA fragment for Thompson's construction.
 * Has a start state and a list of output (pending) states or a single accept state.
 * In Thompson's, usually a fragment has one start and one accept state.
 */

export class Fragment {
    constructor(start, end) {
        this.start = start;
        this.end = end; // The accept state of this fragment
    }
}
