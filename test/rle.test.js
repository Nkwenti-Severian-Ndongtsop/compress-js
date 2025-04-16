const assert = require('assert');
const { compress, decompress } = require('../rle');

describe('RLE Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('AAABBBCCCCCDDDDE');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle empty input', () => {
        const input = Buffer.from('');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle single character input', () => {
        const input = Buffer.from('A');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle maximum run length', () => {
        const input = Buffer.from('A'.repeat(255));
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
}); 