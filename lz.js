/**
 * LZ77 compression and decompression
 */

function compress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }

    const result = [];
    let pos = 0;

    while (pos < input.length) {
        let bestMatch = { offset: 0, length: 0 };
        const searchStart = Math.max(0, pos - 255);
        const searchEnd = pos;

        for (let i = searchStart; i < searchEnd; i++) {
            let length = 0;
            while (pos + length < input.length && 
                   input[i + length] === input[pos + length] && 
                   length < 255) {
                length++;
            }
            if (length > bestMatch.length) {
                bestMatch = { offset: pos - i, length };
            }
        }

        if (bestMatch.length > 0) {
            result.push(bestMatch.offset, bestMatch.length);
            pos += bestMatch.length;
        } else {
            result.push(0, 0, input[pos]);
            pos++;
        }
    }

    return Buffer.from(result);
}

function decompress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }

    const result = [];
    let pos = 0;

    while (pos < input.length) {
        const offset = input[pos++];
        const length = input[pos++];

        if (length === 0) {
            result.push(input[pos++]);
        } else {
            const start = result.length - offset;
            for (let i = 0; i < length; i++) {
                result.push(result[start + i]);
            }
        }
    }

    return Buffer.from(result);
}

module.exports = {
    compress,
    decompress
}; 