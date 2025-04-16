# JS-Compressor

A simple CLI tool to compress and decompress files using RLE and LZ77 algorithms, implemented in JavaScript.

## Features

- Compress files using RLE (Run-Length Encoding)
- Compress files using LZ77 algorithm
- Decompress files compressed with either algorithm
- Simple command-line interface

## Installation

### From Source

```bash
npm install -g
```

### Using Docker

Pull the image from GitHub Container Registry:

```bash
docker pull ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest
```

## Usage

### Basic Usage

```bash
# Compress a file using RLE
js-compressor compress <input-file> <output-file> --rle

# Compress a file using LZ77
js-compressor compress <input-file> <output-file> --lz

# Decompress a file
js-compressor decompress <compressed-file> <output-file>
```

### Using Docker

1. Create a directory for your files:
```bash
mkdir -p test_files
```

2. Create a test file:
```bash
echo "This is a test file with repeated characters aaaaaaabbbbbbbccccccc" > test_files/input.txt
```

3. Run compression using Docker:

```bash
# Compress using RLE
docker run -v $(pwd)/test_files:/data ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest compress /data/input.txt /data/output.rle --rle

# Compress using LZ77
docker run -v $(pwd)/test_files:/data ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest compress /data/input.txt /data/output.lz77 --lz
```

4. Decompress and verify:
```bash
# Decompress the RLE file
docker run -v $(pwd)/test_files:/data ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest decompress /data/output.rle /data/decompressed_rle.txt

# Decompress the LZ77 file
docker run -v $(pwd)/test_files:/data ghcr.io/nkwenti-severian-ndongtsop/js-compressor:latest decompress /data/output.lz77 /data/decompressed_lz77.txt

# Verify the decompressed files match the original
diff test_files/input.txt test_files/decompressed_rle.txt
diff test_files/input.txt test_files/decompressed_lz77.txt
```

## Testing

The project includes unit tests for both compression algorithms. To run the tests:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 