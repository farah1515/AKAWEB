// Recursive Merge Sort
function mergeSortRecursive(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return mergeRecursive(mergeSortRecursive(left), mergeSortRecursive(right));
}

function mergeRecursive(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].name <= right[rightIndex].name) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Iterative Merge Sort (previously implemented)
function mergeSortIterative(arr) {
  if (arr.length <= 1) return arr;

  const temp = new Array(arr.length);
  for (let width = 1; width < arr.length; width = width * 2) {
    for (let i = 0; i < arr.length; i = i + 2 * width) {
      merge(arr, i, Math.min(i + width, arr.length), Math.min(i + 2 * width, arr.length), temp);
    }
  }
  return arr;
}

function merge(arr, left, right, end, temp) {
  let i = left;
  let j = right;
  let k = left;

  while (i < right && j < end) {
    if (arr[i].name <= arr[j].name) {
      temp[k] = arr[i];
      i++;
    } else {
      temp[k] = arr[j];
      j++;
    }
    k++;
  }

  while (i < right) {
    temp[k] = arr[i];
    i++;
    k++;
  }

  while (j < end) {
    temp[k] = arr[j];
    j++;
    k++;
  }

  for (i = left; i < end; i++) {
    arr[i] = temp[i];
  }
}

// Recursive Binary Search
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) {
    return -1;
  }

  const mid = Math.floor((left + right) / 2);
  const midValue = arr[mid].name.toLowerCase();
  const targetValue = target.toLowerCase();

  if (midValue === targetValue) {
    return mid;
  }

  if (targetValue < midValue) {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }

  return binarySearchRecursive(arr, target, mid + 1, right);
}

// Iterative Binary Search (previously implemented)
function binarySearchIterative(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid].name.toLowerCase() === target.toLowerCase()) return mid;
    if (arr[mid].name.toLowerCase() < target.toLowerCase()) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// Updated search function to demonstrate both recursive and iterative approaches
function searchDisability(isRecursive = false) {
  const searchTerm = document.getElementById("searchInput").value;

  const sortedDisabilities = isRecursive ? mergeSortRecursive([...disabilities]) : mergeSortIterative([...disabilities]);

  const result = isRecursive ? binarySearchRecursive(sortedDisabilities, searchTerm) : binarySearchIterative(sortedDisabilities, searchTerm);

  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = "";

  if (result !== -1) {
    const disability = sortedDisabilities[result];
    resultsDiv.innerHTML = `
            <div class="col-md-6 mx-auto">
                <div class="card search-result">
                    <div class="card-body">
                        <h5 class="card-title">${disability.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Kategori: ${disability.category}</h6>
                        <p class="card-text">${disability.description}</p>
                        <p class="small text-muted">Searched using ${isRecursive ? "Recursive" : "Iterative"} Algorithm</p>
                    </div>
                </div>
            </div>
        `;
  } else {
    resultsDiv.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Tidak ditemukan hasil untuk "${searchTerm}"</p>
            </div>
        `;
  }
}

// Menampilkan kategori
function displayCategories() {
  const categoryList = document.getElementById("categoryList");
  const categories = [...new Set(disabilities.map((d) => d.category))];

  categories.forEach((category) => {
    const categoryDisabilities = disabilities.filter((d) => d.category === category);
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "col-md-6 mb-4";
    categoryDiv.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    ${category}
                </div>
                <div class="card-body">
                    ${categoryDisabilities
                      .map(
                        (d) => `
                            <div class="disability-card p-2 mb-2 border rounded">
                                <h6>${d.name}</h6>
                                <p class="small text-muted mb-0">${d.description}</p>
                            </div>
                        `
                      )
                      .join("")}
                </div>
            </div>
        `;
    categoryList.appendChild(categoryDiv);
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
});
