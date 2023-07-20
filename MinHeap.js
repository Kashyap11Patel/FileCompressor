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
