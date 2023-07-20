const Nax = 10000000;
class MinHeap {
  constructor() {
    this.heap = [];
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  getMin() {
    return this.heap[0];
  }

  insert(node) {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    const min = this.getMin();
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return min;
  }

  heapifyUp(index) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (
      index > 0 &&
      this.heap[index].frequency < this.heap[parentIndex].frequency
    ) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    const leftVal =
      leftChildIndex < this.heap.length
        ? this.heap[leftChildIndex].frequency
        : Nax;
    const rightVal =
      rightChildIndex < this.heap.length
        ? this.heap[rightChildIndex].frequency
        : Nax;
    const currVal = this.heap[index].frequency;

    if (leftVal < rightVal && leftVal < currVal) {
      this.swap(index, leftChildIndex);
      this.heapifyDown(leftChildIndex);
    } else if (rightVal < leftVal && rightVal < currVal) {
      this.swap(index, rightChildIndex);
      this.heapifyDown(rightChildIndex);
    }
  }

  size() {
    return this.heap.length;
  }
}

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

function serializeHuffmanTree(huffmanCodes) {
  var data = '';
  for (let [k, v] of huffmanCodes) {
    data = `${data}${v}${k}`;
  }
  return data;
}

function deserializeHuffmanTree(data) {
  const huffmanCodes = new Map();
  var currCode = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i] === '0' || data[i] === '1') currCode += data[i];
    else {
      huffmanCodes.set(currCode, data[i]);
      currCode = '';
    }
  }
  return huffmanCodes;
}

// commpress data
function huffmanCompress(input, huffmanCodes) {
  let compressedData = '';
  for (let char of input) {
    compressedData += huffmanCodes.get(char);
  }

  return compressedData;
}

function convertTodec(binary_string) {
  let rem = (8 - (binary_string.length % 8)) % 8;
  console.log(rem);
  let padding = '';
  for (let i = 0; i < rem; i++) padding = padding + '0';
  binary_string = binary_string + padding;
  console.log(binary_string);

  let result = '';
  for (let i = 0; i < binary_string.length; i += 8) {
    let num = 0;
    for (let j = 0; j < 8; j++) {
      num = num * 2 + (binary_string[i + j] - '0');
    }
    console.log(num);
    result = result + String.fromCharCode(num);
    console.log(result);
  }
  result = result + '\n' + rem;
  return result;
}

// encode input
function Encode(input) {
  const frequencyMap = calculateFrequency(input);
  const root = buildHuffmanTree(frequencyMap);
  const huffmanCodes = generateHuffmanCodes(root);
  const huffmanTreeString = serializeHuffmanTree(huffmanCodes);

  const binaryData = huffmanCompress(input, huffmanCodes);
  const compressedData = convertTodec(binaryData);
  const encodedData = compressedData + '\n' + huffmanTreeString;
  return encodedData;
}

// huffman Decompression of data
function huffmanDecompress(compressedData, huffmanCodes) {
  let currentCode = '';
  let decompressedData = '';

  for (let bit of compressedData) {
    currentCode += bit;
    if (huffmanCodes.has(currentCode)) {
      decompressedData += huffmanCodes.get(currentCode);
      currentCode = '';
    }
  }

  return decompressedData;
}

function convertToBin(compressedData, toRemove) {
  let binary_string = '';
  for (let i = 0; i < compressedData.length; i++) {
    let num = compressedData[i].charCodeAt(0);
    let bin = '';
    for (let j = 0; j < 8; j++) {
      bin = (num % 2) + bin;
      num = Math.floor(num / 2);
    }
    binary_string = binary_string + bin;
  }
  binary_string = binary_string.substring(0, binary_string.length - toRemove);
  return binary_string;
}

//decode data
function Decode(input) {
  const data = input.split('\n');
  const compressedData = data[0];
  const huffmanTreeString = data[2];
  const toRemove = data[1];
  const binaryData = convertToBin(compressedData, toRemove);
  const huffmanCodes = deserializeHuffmanTree(huffmanTreeString, 0);
  const decompressedData = huffmanDecompress(binaryData, huffmanCodes);

  return decompressedData;
}

window.onload = function () {
  console.log("we're good to go");

  decodeBtn = document.getElementById('decode');
  encodeBtn = document.getElementById('encode');
  fileForm = document.getElementById('fileform');
  uploadFile = document.getElementById('uploadFile');
  submitBtn = document.getElementById('submitbtn');
  step1 = document.getElementById('step1');
  step2 = document.getElementById('step2');
  step3 = document.getElementById('step3');
  isSubmitted = false;
  submitBtn.onclick = function () {
    var data = uploadFile.files[0];
    if (data === undefined) {
      alert(
        'No file uploaded.\nPlease upload a valid .txt file and try again!',
      );
      return;
    }
    let nameSplit = data.name.split('.');
    var extension = nameSplit[nameSplit.length - 1].toLowerCase();
    if (extension != 'txt') {
      alert(
        'Invalid file type (.' +
          extension +
          ') \nPlease upload a valid .txt file and try again!',
      );
      return;
    }
    alert('File submitted!');
    isSubmitted = true;
    onclickChanges('Done!! File uploaded !', step1);
  };

  encodeBtn.onclick = function () {
    console.log('encode onclick');
    var data = uploadFile.files[0];
    if (data === undefined) {
      alert('No file uploaded.\nPlease upload a file and try again!');
      return;
    }
    if (isSubmitted === false) {
      alert(
        'File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!',
      );
      return;
    }
    // if (data.size === 0) {
    //   alert(
    //     'WARNING: You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!',
    //   );
    // } else if (data.size <= 350) {
    //   alert(
    //     'WARNING: The uploaded file is very small in size (' +
    //       data.size +
    //       ' bytes) !\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!',
    //   );
    // } else if (data.size < 1000) {
    //   alert(
    //     'WARNING: The uploaded file is small in size (' +
    //       data.size +
    //       " bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!",
    //   );
    // }
    onclickChanges('Done!! Your file will be Compressed', step2);
    // onclickChanges2('Compressing your file ...', 'Compressed');
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const encodedData = Encode(fileContent);
      console.log(encodedData);
    };
    reader.readAsText(data, 'UTF-8');
  };

  decodeBtn.onclick = function () {
    console.log('decode onclick');
    var data = uploadFile.files[0];
    if (data === undefined) {
      alert('No file uploaded.\nPlease upload a file and try again!');
      return;
    }
    if (isSubmitted === false) {
      alert(
        'File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!',
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const dncodedData = Decode(fileContent);
      console.log(dncodedData);
    };
    reader.readAsText(data, 'UTF-8');
  };
};
function onclickChanges(firstMsg, step) {
  step.innerHTML = '';
  let msg = document.createElement('span');
  msg.className = 'text2';
  msg.innerHTML = firstMsg;
  step.appendChild(msg);
}

function onclickChanges2(secMsg, word) {
  decodeBtn.disabled = true;
  encodeBtn.disabled = true;
  step3.innerHTML = '';
  let msg2 = document.createElement('span');
  msg2.className = 'text2';
  msg2.innerHTML = secMsg;
  step3.appendChild(msg2);
  // var br = document.createElement("br");
  // step3.appendChild(br);
  let msg3 = document.createElement('span');
  msg3.className = 'text2';
  msg3.innerHTML = ' , ' + word + ' file will be downloaded automatically!';
  step3.appendChild(msg3);
}

function myDownloadFile(fileName, text) {
  let a = document.createElement('a');
  a.href = 'data:application/octet-stream,' + encodeURIComponent(text);
  a.download = fileName;
  a.click();
}
