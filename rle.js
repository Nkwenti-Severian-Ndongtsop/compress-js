/**
 * Run-Length Encoding (RLE) compression and decompression
 */

function compress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }
    if (input.length === 0) return Buffer.alloc(0); // Return empty buffer for empty input

    const result = [];
    let count = 1;
    let current = input[0];

    for (let i = 1; i < input.length; i++) {
        if (input[i] === current && count < 255) {
            count++;
        } else {
            // RLE format: [byte, count]
            result.push(current, count); 
            current = input[i];
            count = 1;
        }
    }
    // Add the last sequence
    result.push(current, count);

    return Buffer.from(result);
}

function decompress(input) {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input);
    }
    // RLE format expects pairs [byte, count]. 
    // No magic byte in this simple version. Check for odd length.
    if (input.length % 2 !== 0) {
        throw new Error("Invalid RLE data: odd number of bytes.");
    }
     if (input.length === 0) return Buffer.alloc(0);

    const result = [];
    for (let i = 0; i < input.length; i += 2) {
        const value = input[i];
        const count = input[i + 1];
         if (count === 0) {
            throw new Error("Invalid RLE sequence: count cannot be zero.");
        }
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