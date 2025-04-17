#!/usr/bin/env node

const fs = require('fs');
const path = require('path'); // Keep path for potential future use, though not strictly needed now
const { compress: rleCompress, decompress: rleDecompress } = require('./rle');
const { compress: lzCompress, decompress: lzDecompress } = require('./lz');

function printUsageAndExit(error = null, exitCode = 0) {
    if (error) {
        console.error(`Error: ${error}\n`);
    }
    console.log(`
Usage:
  js-compressor compress <input-file> <output-file> [--rle|--lz]
  js-compressor decompress <compressed-file> <output-file> [--rle|--lz]
  js-compressor --help

Options:
  Input/output must be file paths.
  --rle           Use Run-Length Encoding (default for compress).
  --lz            Use LZ77 Encoding.
  --rle, --lz     Hint for decompression algorithm (optional, not currently used by simple decompress).
    `);
    process.exit(error ? 1 : exitCode);
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        printUsageAndExit();
    }

    const command = args[0];
    const inputFile = args[1];
    const outputFile = args[2];

    if (!command || !inputFile || !outputFile) {
        printUsageAndExit('Missing required arguments.');
    }
    
    // Stdin/stdout not supported in this simple version
    if (inputFile === '-' || outputFile === '-') {
        printUsageAndExit('Stdin/Stdout is not supported in this version. Please provide file paths.');
    }

    if (!fs.existsSync(inputFile)) {
        printUsageAndExit(`Input file not found: ${inputFile}`);
    }

    try {
        const inputData = fs.readFileSync(inputFile);
        let outputData;
        let operation = 'unknown';
        let algorithm = 'unknown';

        if (command === 'compress') {
            operation = 'Compress';
            let useRle = args.includes('--rle');
            let useLz = args.includes('--lz');

             if (useRle && useLz) {
                 printUsageAndExit('Cannot specify both --rle and --lz for compression.');
            }
            if (!useRle && !useLz) {
                 console.log('Defaulting to RLE compression.');
                useRle = true; // Default to RLE
            }

            if (useRle) {
                algorithm = 'RLE';
                outputData = rleCompress(inputData);
            } else { // useLz must be true
                algorithm = 'LZ77';
                outputData = lzCompress(inputData);
            }
            console.log(`Compressing ${inputFile} to ${outputFile} using ${algorithm}...`);

        } else if (command === 'decompress') {
             operation = 'Decompress';
             // Note: Simple decompress functions don't use the hints currently
             // Need to decide which one to try. For now, let's require a hint
             // or implement a try-catch mechanism.
             const hintRle = args.includes('--rle');
             const hintLz = args.includes('--lz');

            if (hintRle && hintLz) {
                 printUsageAndExit('Cannot specify both --rle and --lz hint for decompression.');
            }
            
            // For simplicity, let's just try RLE for now if no hint, 
            // or implement a more robust try/catch later.
             // A real implementation might check magic bytes if they were added.
             if (hintLz) {
                 algorithm = 'LZ77';
                 console.log(`Decompressing ${inputFile} to ${outputFile} using ${algorithm}...`);
                 outputData = lzDecompress(inputData);
             } else {
                 algorithm = 'RLE'; // Default or if --rle specified
                 console.log(`Decompressing ${inputFile} to ${outputFile} using ${algorithm}...`);
                 outputData = rleDecompress(inputData);
             }

        } else {
            printUsageAndExit(`Unknown command '${command}'.`);
        }

        fs.writeFileSync(outputFile, outputData);
        console.log(`${operation}ion successful.`);

    } catch (error) {
         // Clean up potentially partially written file on error
         if (outputFile !== '-' && fs.existsSync(outputFile)) {
             try {
                 fs.unlinkSync(outputFile);
             } catch (unlinkErr) {
                 console.error(`Failed to clean up output file ${outputFile}: ${unlinkErr}`);
             }
         }
         printUsageAndExit(`${operation}ion failed: ${error.message || error}`);
    }
}

main(); // No catch needed as errors are handled within main now 