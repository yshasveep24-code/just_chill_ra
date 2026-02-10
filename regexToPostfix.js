/**
 * regexToPostfix.js
 * Converts infix regex tokens to postfix notation (RPN).
 * Inserts explicit concatenation operators.
 */

import { TokenType } from './regexTokenizer.js';

const CONCAT = 'CONCAT'; // explicit concatenation operator type

/* Operator Precedence & Associativity */
// * + : highest, left
// . (concat) : medium, left
// | : lowest, left

function getPrecedence(opType) {
    if (opType === TokenType.STAR || opType === TokenType.PLUS) return 3;
    if (opType === CONCAT) return 2;
    if (opType === TokenType.OR) return 1;
    return 0;
}

/**
 * Converts tokens to postfix.
 * Implicit concatenation is inserted during this process.
 * @param {Array} tokens 
 * @returns {Array} Postfix tokens
 */
export function toPostfix(tokens) {
    const output = [];
    const stack = [];

    // Helper to process explicit concatenation
    // We rewrite the token stream or handle it on the fly. 
    // Let's create a new stream with explicit CONCAT tokens first.
    const explicitTokens = insertExplicitConcat(tokens);

    for (const token of explicitTokens) {
        if (token.type === TokenType.LITERAL) {
            output.push(token);
        } else if (token.type === TokenType.LPAREN) {
            stack.push(token);
        } else if (token.type === TokenType.RPAREN) {
            while (stack.length > 0 && stack[stack.length - 1].type !== TokenType.LPAREN) {
                output.push(stack.pop());
            }
            if (stack.length === 0) throw new Error("Mismatched parentheses");
            stack.pop(); // Pop LPAREN
        } else {
            // Operator
            while (
                stack.length > 0 &&
                stack[stack.length - 1].type !== TokenType.LPAREN &&
                getPrecedence(stack[stack.length - 1].type) >= getPrecedence(token.type)
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length > 0) {
        const op = stack.pop();
        if (op.type === TokenType.LPAREN) throw new Error("Mismatched parentheses");
        output.push(op);
    }

    return output;
}

/**
 * Inserts explicit concatenation tokens between:
 * - Literal & Literal
 * - Literal & LPAREN
 * - RPAREN & Literal
 * - RPAREN & LPAREN
 * - Star/Plus & Literal
 * - Star/Plus & LPAREN
 */
function insertExplicitConcat(tokens) {
    if (tokens.length === 0) return [];

    const res = [];

    for (let i = 0; i < tokens.length; i++) {
        const t1 = tokens[i];
        res.push(t1);

        if (i + 1 < tokens.length) {
            const t2 = tokens[i + 1];

            const t1IsOperand = (t1.type === TokenType.LITERAL || t1.type === TokenType.STAR || t1.type === TokenType.PLUS || t1.type === TokenType.RPAREN);
            const t2IsOperand = (t2.type === TokenType.LITERAL || t2.type === TokenType.LPAREN);

            if (t1IsOperand && t2IsOperand) {
                res.push({ type: CONCAT, value: '.' });
            }
        }
    }
    return res;
}
