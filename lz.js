/**
 * LZ77 compression and decompression (Simplified, Buffer-based)
 * Uses format: Literal=0x00+byte, Match=0x01+offset+length
 */

const LITERAL_FLAG = 0x00;
const MATCH_FLAG = 0x01;
const WINDOW_SIZE = 20; // Window size closer to requirement
const MAX_MATCH_LENGTH = 255;
const MIN_MATCH_LENGTH = 3;

function compress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }
    if (input.length === 0) return Buffer.alloc(0);

    const output = [];
    let pos = 0;

    while (pos < input.length) {
        let bestMatchOffset = 0;
        let bestMatchLength = 0;
        // Search window is [max(0, pos - WINDOW_SIZE), pos)
        const searchStart = Math.max(0, pos - WINDOW_SIZE);
        const lookaheadLimit = Math.min(MAX_MATCH_LENGTH, input.length - pos);

        // Search backwards for the longest match
        for (let i = searchStart; i < pos; i++) {
            let currentLength = 0;
            while (
                currentLength < lookaheadLimit && 
                input[i + currentLength] === input[pos + currentLength]
            ) {
                currentLength++;
            }

            // >= prefers longer matches, and more recent (smaller offset) if same length
            if (currentLength >= bestMatchLength) { 
                bestMatchLength = currentLength;
                bestMatchOffset = pos - i; 
            }
        }

        // Encode match if it meets criteria
        if (bestMatchLength >= MIN_MATCH_LENGTH && bestMatchOffset <= 255) {
            output.push(MATCH_FLAG); 
            output.push(bestMatchOffset); 
            output.push(bestMatchLength); 
            pos += bestMatchLength;
        } else {
            // Encode literal
            output.push(LITERAL_FLAG); 
            output.push(input[pos]); 
            pos++;
        }
    }

    return Buffer.from(output);
}

function decompress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }
    if (input.length === 0) return Buffer.alloc(0);

    const output = [];
    let pos = 0;

    while (pos < input.length) {
        const flag = input[pos++];
        if (flag === LITERAL_FLAG) {
            // Literal byte follows
             if (pos >= input.length) {
                throw new Error("Invalid LZ77 data: missing literal byte after flag.");
            }
            output.push(input[pos++]); 
        } else if (flag === MATCH_FLAG) {
             // (offset, length) pair follows
             if (pos + 1 >= input.length) {
                 throw new Error("Invalid LZ77 data: incomplete match token at end.");
            }
             const offset = input[pos++];
             const length = input[pos++];

             if (offset === 0 || length < MIN_MATCH_LENGTH) { // Length must be >= MIN_MATCH_LENGTH
                  throw new Error(`Invalid LZ77 match token (offset=${offset}, length=${length})`);
             }
            if (offset > output.length) {
                 throw new Error(`Invalid LZ77 offset ${offset} > history size ${output.length}`);
             }

            const start = output.length - offset;
            for (let i = 0; i < length; i++) {
                output.push(output[start + i]);
            }
        } else {
             throw new Error(`Invalid LZ77 flag byte: ${flag}`);
        }
    }

    return Buffer.from(output);
}

module.exports = {
    compress,
    decompress
}; 