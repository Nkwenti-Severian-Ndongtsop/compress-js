# JS-Compressor

[![Docker Build and Push](https://github.com/Nkwenti-Severian-Ndongtsop/compress-js/actions/workflows/docker.yml/badge.svg)](https://github.com/Nkwenti-Severian-Ndongtsop/compress-js/actions/workflows/docker.yml)

A simple CLI tool to compress and decompress files using RLE and LZ77 algorithms, implemented in JavaScript (Node.js).
This is the JavaScript counterpart to the [Rust version](https://github.com/nkwenti-severian-ndongtsop/compress-rs) in the same repository.

## Features

- Compress files using RLE (Run-Length Encoding)
- Compress files using LZ77 algorithm
- Decompress files compressed with RLE or LZ77
- Simple command-line interface
- Docker support

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or later recommended)
- [npm](https://www.npmjs.com/) (Usually included with Node.js)

### From Source

1.  Clone the repository (if you haven't already):
    ```bash
    git clone https://github.com/Nkwenti-Severian-Ndongtsop/compress-js.git
    cd compress-js
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Link the package globally (optional, to use `compress-js` anywhere):
    ```bash
    npm link
    ```
    Alternatively, run using `node index.js ...` from the `compress-js` directory.

### Using Docker

Pull the pre-built image from GitHub Container Registry:

```bash
docker pull ghcr.io/nkwenti-severian-ndongtsop/compress-js:latest
```

## Usage

### Basic CLI Usage

Replace `compress-js` with `node index.js` if you didn't run `npm link`.

```bash
# Show help
compress-js --help

# Compress a file using RLE
compress-js compress <input-file> <output-file.rle> --rle

# Compress a file using LZ77
compress-js compress <input-file> <output-file.lz77> --lz

# Decompress a file (RLE or LZ77)
# Providing the algorithm hint (--rle or --lz) might be needed for ambiguous files
compress-js decompress <compressed-file> <output-file> [--rle|--lz]
```

### Using Docker

Mount your local directory containing the files into the container's `/data` directory.

1.  Create a directory and a test file:
    ```bash
    mkdir -p my_files
    echo "aaaaaabbbbbbbcccccccddddd ABCABCABC" > my_files/input.txt
    ```

2.  Run compression/decompression using Docker:
    ```bash
    # Compress using RLE
    docker run --rm -v "$(pwd)/my_files:/data" ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest compress /data/input.txt /data/output.rle --rle

    # Compress using LZ77
    docker run --rm -v "$(pwd)/my_files:/data" ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest compress /data/input.txt /data/output.lz77 --lz

    # Decompress RLE file
    docker run --rm -v "$(pwd)/my_files:/data" ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest decompress /data/output.rle /data/decompressed_rle.txt --rle

    # Decompress LZ77 file
    docker run --rm -v "$(pwd)/my_files:/data" ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest decompress /data/output.lz77 /data/decompressed_lz77.txt --lz
    ```

3.  Verify the output:
    ```bash
    diff my_files/input.txt my_files/decompressed_rle.txt
    diff my_files/input.txt my_files/decompressed_lz77.txt
    ```

## Testing

Run the unit tests from the `compress-js` directory:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file in the parent directory for details. 