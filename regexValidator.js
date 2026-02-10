/**
 * regexValidator.js
 * Validates the token stream for syntax errors.
 */

import { TokenType } from './regexTokenizer.js';

/**
 * Validates the tokens.
 * @param {Array} tokens 
 * @returns {boolean} true if valid
 * @throws {Error} if invalid
 */
export function validate(tokens) {
    let balance = 0;

    if (tokens.length === 0) {
        // Empty regex is valid? usually results in epsilon.
        return true;
    }

    // Check invalid start
    const firstType = tokens[0].type;
    if (firstType === TokenType.STAR || firstType === TokenType.PLUS || firstType === TokenType.OR || firstType === TokenType.RPAREN) {
        throw new Error(`Regex cannot start with '${tokens[0].value}'`);
    }

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = i + 1 < tokens.length ? tokens[i + 1] : null;

        if (token.type === TokenType.LPAREN) {
            balance++;
        } else if (token.type === TokenType.RPAREN) {
            balance--;
            if (balance < 0) throw new Error('Unbalanced parentheses');
        }

        // Check empty parens ()
        if (token.type === TokenType.LPAREN && next && next.type === TokenType.RPAREN) {
            throw new Error('Empty parentheses () are not allowed');
        }

        // Check invalid consecutive operators
        // e.g. ||, *+, (*, |)
        if (token.type === TokenType.OR) {
            if (!next || next.type === TokenType.OR || next.type === TokenType.RPAREN || next.type === TokenType.STAR || next.type === TokenType.PLUS) {
                // regex ending with | or followed by invalid
                throw new Error('Invalid use of OR (|)');
            }
        }
    }

    if (balance !== 0) {
        throw new Error('Unbalanced parentheses');
    }

    return true;
}
