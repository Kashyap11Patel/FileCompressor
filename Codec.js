class HuffmanNode {
  constructor(symbol, frequency) {
    this.symbol = symbol;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}

//to calculate frequency
function calculateFrequency(input) {
  const frequencyMap = new Map();
  for (let char of input) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }
  return frequencyMap;
}

//build huffmanTree
function buildHuffmanTree(frequencyMap) {
  const minHeap = new MinHeap();
  for (let [symbol, frequency] of frequencyMap) {
    minHeap.insert(new HuffmanNode(symbol, frequency));
  }

  while (minHeap.size() > 1) {
    const left = minHeap.extractMin();
    const right = minHeap.extractMin();

    const parent = new HuffmanNode(null, left.frequency + right.frequency);
    parent.left = left;
    parent.right = right;

    minHeap.insert(parent);
  }

  return minHeap.extractMin();
}

// generate Codes
// dfs
function generateHuffmanCodes(root, code = '', huffManCodes = new Map()) {
  if (root) {
    if (root.symbol) {
      huffManCodes.set(root.symbol, code);
    }
    generateHuffmanCodes(root.left, code + '0', huffManCodes);
    generateHuffmanCodes(root.right, code + '1', huffManCodes);
  }
  return huffManCodes;
}

function serializeHuffmanTree(root) {
  if (!root) return '';

  if (root.symbol) {
    return `1${root.symbol}`;
  }
  return `0${serializeHuffmanTree(root.left)}${serializeHuffmanTree(
    root.right,
  )}`;
}

function deserializeHuffmanTree(data, index = 0) {
  if (!data || index >= data.length) return null;

  if (data[index] === '1') {
    index++;
    const symbol = data[index];
    return new HuffmanNode(symbol, 0);
  } else if (data[index] === '0') {
    index++;
    const leftNode = deserializeHuffmanTree(data, index);
    const rightNode = deserializeHuffmanTree(data, index);
    const node = new HuffmanNode(null, 0);
    node.left = leftNode;
    node.right = rightNode;
    return node;
  }
  return null;
}

// commpress data
function huffmanCompress(input) {
  const huffmanCodes = generateHuffmanCodes(root);

  let compressedData = '';
  for (let char of input) {
    compressedData += huffmanCodes.get(char);
  }

  return compressedData;
}

// encode input
export function Encode(input) {
  const frequencyMap = calculateFrequency(input);
  const root = buildHuffmanTree(frequencyMap);
  const huffmanTreeString = serializeHuffmanTree(root);

  const compressedData = huffmanCompress(root);
  const encodedData = compressedData + '\n' + huffmanTreeString;

  return encodedData;
}

// huffman Decompression of data
function huffmanDecompress(compressedData, huffmanCodes) {
  const reverseHuffmanCodes = new Map(
    [...huffmanCodes.entries()].map(([k, v]) => (v, k)),
  );

  let currentCode = '';
  let decompressedData = '';

  for (let bit of compressedData) {
    currentCode += bit;
    if (reverseHuffmanCodes.has(currentCode)) {
      decompressedData += reverseHuffmanCodes.get(currentCode);
      currentCode = '';
    }
  }

  return decompressedData;
}

//decode data
export function Decode(input) {
  const newlineIndex = input.indexOf('\n');
  const huffmanTreeString = input.slice(0, newlineIndex);
  const compressedData = input.slice(newlineIndex + 1);

  const huffManCodes = deserializeHuffmanTree(huffmanTreeString, 0);
  const decompressedData = huffmanDecompress(compressedData, huffManCodes);

  return decompressedData;
}
