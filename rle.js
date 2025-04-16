/**
 * Run-Length Encoding (RLE) compression and decompression
 */

function compress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }

    const result = [];
    let count = 1;
    let current = input[0];

    for (let i = 1; i < input.length; i++) {
        if (input[i] === current && count < 255) {
            count++;
        } else {
            result.push(count, current);
            current = input[i];
            count = 1;
        }
    }
    result.push(count, current);

    return Buffer.from(result);
}

function decompress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }

    const result = [];
    for (let i = 0; i < input.length; i += 2) {
        const count = input[i];
        const value = input[i + 1];
        for (let j = 0; j < count; j++) {
            result.push(value);
        }
    }

    return Buffer.from(result);
}

module.exports = {
    compress,
    decompress
}; 