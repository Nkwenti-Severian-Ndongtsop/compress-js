#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { compress: rleCompress, decompress: rleDecompress } = require('./rle');
const { compress: lzCompress, decompress: lzDecompress } = require('./lz');

function printUsage() {
    console.log(`
Usage:
    js-compressor compress <input-file> <output-file> [--rle|--lz]
    js-compressor decompress <compressed-file> <output-file>
    js-compressor --help
    `);
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        printUsage();
        process.exit(0);
    }

    const command = args[0];
    const inputFile = args[1];
    const outputFile = args[2];

    if (!inputFile || !outputFile) {
        console.error('Error: Missing required arguments');
        printUsage();
        process.exit(1);
    }

    try {
        const inputData = fs.readFileSync(inputFile);

        if (command === 'compress') {
            const algorithm = args[3];
            let compressedData;

            if (algorithm === '--rle') {
                compressedData = rleCompress(inputData);
            } else if (algorithm === '--lz') {
                compressedData = lzCompress(inputData);
            } else {
                console.error('Error: Please specify compression algorithm (--rle or --lz)');
                printUsage();
                process.exit(1);
            }

            fs.writeFileSync(outputFile, compressedData);
            console.log(`File compressed successfully to ${outputFile}`);
        } else if (command === 'decompress') {
            const decompressedData = rleDecompress(inputData);
            fs.writeFileSync(outputFile, decompressedData);
            console.log(`File decompressed successfully to ${outputFile}`);
        } else {
            console.error('Error: Unknown command');
            printUsage();
            process.exit(1);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main(); 