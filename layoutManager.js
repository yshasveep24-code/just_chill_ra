/**
 * layoutManager.js
 * Calculates layout positions for the automaton graph.
 * Uses a sugiyama-inspired layered layout suitable for DFA visualization.
 */

export class LayoutManager {
    constructor(width, height) {
        this.width = width || 800;
        this.height = height || 600;
        this.nodeRadius = 25;
        this.layerSpacing = 200;  // Horizontal spacing
        this.nodeSpacing = 180;   // Vertical spacing - increased
    }

    calculateLayout(automaton) {
        const positions = new Map();
        const layers = this.assignLayers(automaton);

        // Group nodes by layer
        const layerGroups = new Map();
        let maxLayer = 0;

        layers.forEach((layer, stateId) => {
            if (!layerGroups.has(layer)) layerGroups.set(layer, []);
            layerGroups.get(layer).push(stateId);
            maxLayer = Math.max(maxLayer, layer);
        });

        // Calculate positions
        const totalWidth = (maxLayer + 1) * this.layerSpacing + 200;

        // Find max nodes in any layer for height calculation
        let maxNodesInLayer = 0;
        layerGroups.forEach(states => {
            maxNodesInLayer = Math.max(maxNodesInLayer, states.length);
        });

        const totalHeight = Math.max(this.height, maxNodesInLayer * this.nodeSpacing + 100);

        const startX = 140; // Extra padding for start arrow and label

        // Position each layer
        layerGroups.forEach((stateIds, layer) => {
            const layerHeight = stateIds.length * this.nodeSpacing;
            const startY = (totalHeight - layerHeight) / 2;

            stateIds.forEach((stateId, index) => {
                positions.set(stateId, {
                    x: startX + layer * this.layerSpacing,
                    y: startY + index * this.nodeSpacing
                });
            });
        });

        return {
            positions,
            width: totalWidth,
            height: totalHeight
        };
    }

    assignLayers(automaton) {
        const layers = new Map();
        const visited = new Set();

        // BFS from start state
        const queue = [{ state: automaton.startState, layer: 0 }];
        visited.add(automaton.startState.id);
        layers.set(automaton.startState.id, 0);

        while (queue.length > 0) {
            const { state, layer } = queue.shift();

            for (const t of state.transitions) {
                if (!visited.has(t.to.id)) {
                    visited.add(t.to.id);
                    layers.set(t.to.id, layer + 1);
                    queue.push({ state: t.to, layer: layer + 1 });
                } else {
                    // Node already visited - ensure it's not pushed back
                    const existingLayer = layers.get(t.to.id);
                    if (existingLayer < layer + 1) {
                        // This creates a back edge - keep existing layer
                    }
                }
            }
        }

        // Handle any unconnected states
        automaton.states.forEach(s => {
            if (!visited.has(s.id)) {
                layers.set(s.id, 0);
            }
        });

        return layers;
    }
}
