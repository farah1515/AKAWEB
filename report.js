// Comprehensive Performance Analysis
class AlgorithmPerformanceAnalyzer {
  constructor(originalData) {
    this.originalData = originalData;
  }

  // Generate test datasets of varying sizes
  generateTestDatasets(sizes) {
    return sizes.map((size) => {
      // Duplicate the original dataset to create larger datasets
      let dataset = [];
      while (dataset.length < size) {
        dataset = dataset.concat(this.originalData.slice(0, size - dataset.length));
      }
      return dataset;
    });
  }

  // Measure sorting performance
  measureSortPerformance(datasets, isRecursive) {
    return datasets.map((dataset) => {
      const startTime = performance.now();

      if (isRecursive) {
        mergeSortRecursive([...dataset]);
      } else {
        mergeSortIterative([...dataset]);
      }

      const endTime = performance.now();
      return endTime - startTime;
    });
  }

  // Measure search performance
  measureSearchPerformance(datasets, isRecursive) {
    return datasets.map((dataset) => {
      // Sort the dataset first
      const sortedDataset = isRecursive ? mergeSortRecursive([...dataset]) : mergeSortIterative([...dataset]);

      // Measure search time for different scenarios
      const searchTerms = [
        sortedDataset[0].name, // First item
        sortedDataset[Math.floor(sortedDataset.length / 2)].name, // Middle item
        sortedDataset[sortedDataset.length - 1].name, // Last item
        "NonExistentTerm", // Non-existent term
      ];

      const searchTimes = searchTerms.map((term) => {
        const startTime = performance.now();

        if (isRecursive) {
          binarySearchRecursive(sortedDataset, term);
        } else {
          binarySearchIterative(sortedDataset, term);
        }

        const endTime = performance.now();
        return endTime - startTime;
      });

      // Return average search time
      return searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
    });
  }

  // Generate comprehensive analysis
  analyzeAlgorithms() {
    // Define input sizes to test
    const inputSizes = [1, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

    // Generate test datasets
    const testDatasets = this.generateTestDatasets(inputSizes);

    // Measure sorting performances
    const recursiveSortTimes = this.measureSortPerformance(testDatasets, true);
    const iterativeSortTimes = this.measureSortPerformance(testDatasets, false);

    // Measure search performances
    const recursiveSearchTimes = this.measureSearchPerformance(testDatasets, true);
    const iterativeSearchTimes = this.measureSearchPerformance(testDatasets, false);

    // Prepare results for visualization
    return {
      inputSizes,
      recursiveSortTimes,
      iterativeSortTimes,
      recursiveSearchTimes,
      iterativeSearchTimes,
    };
  }

  // Generate HTML report with charts
  generatePerformanceReport(results) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Algorithm Performance Analysis</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
                canvas { max-width: 100%; height: 400px; }
            </style>
        </head>
        <body>
            <h1>Algorithm Performance Analysis</h1>
            
            <h2>Sorting Performance</h2>
            <canvas id="sortChart"></canvas>
            
            <h2>Search Performance</h2>
            <canvas id="searchChart"></canvas>

            <script>
                const ctx1 = document.getElementById('sortChart').getContext('2d');
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(results.inputSizes)},
                        datasets: [
                            {
                                label: 'Recursive Sort',
                                data: ${JSON.stringify(results.recursiveSortTimes)},
                                borderColor: 'blue',
                                tension: 0.1
                            },
                            {
                                label: 'Iterative Sort',
                                data: ${JSON.stringify(results.iterativeSortTimes)},
                                borderColor: 'red',
                                tension: 0.1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: 'Input Size' } },
                            y: { title: { display: true, text: 'Time (milliseconds)' } }
                        }
                    }
                });

                const ctx2 = document.getElementById('searchChart').getContext('2d');
                new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(results.inputSizes)},
                        datasets: [
                            {
                                label: 'Recursive Search',
                                data: ${JSON.stringify(results.recursiveSearchTimes)},
                                borderColor: 'green',
                                tension: 0.1
                            },
                            {
                                label: 'Iterative Search',
                                data: ${JSON.stringify(results.iterativeSearchTimes)},
                                borderColor: 'orange',
                                tension: 0.1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: 'Input Size' } },
                            y: { title: { display: true, text: 'Time (milliseconds)' } }
                        }
                    }
                });
            </script>
        </body>
        </html>
        `;
  }

  // Export results to CSV for further analysis
  exportResultsToCSV(results) {
    const headers = ["Input Size", "Recursive Sort Time", "Iterative Sort Time", "Recursive Search Time", "Iterative Search Time"];

    const rows = results.inputSizes.map((size, index) => [size, results.recursiveSortTimes[index], results.iterativeSortTimes[index], results.recursiveSearchTimes[index], results.iterativeSearchTimes[index]]);

    // Convert to CSV
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return csvContent;
  }

  // Complexity Class Determination
  determineComplexityClass(times, inputSizes) {
    // Basic logarithmic regression
    const logSizes = inputSizes.map((size) => Math.log(size));
    const logTimes = times.map((time) => Math.log(time));

    // Simple linear regression
    const n = logSizes.length;
    const sumX = logSizes.reduce((a, b) => a + b, 0);
    const sumY = logTimes.reduce((a, b) => a + b, 0);
    const sumXY = logSizes.reduce((sum, x, i) => sum + x * logTimes[i], 0);
    const sumXX = logSizes.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // Interpret slope
    if (Math.abs(slope - 1) < 0.5) return "O(n)";
    if (Math.abs(slope - Math.log(2)) < 0.5) return "O(log n)";
    if (Math.abs(slope - Math.log(Math.log(2))) < 0.5) return "O(log log n)";

    return `O(n^${slope.toFixed(2)})`;
  }
}

// Usage in main script
document.addEventListener("DOMContentLoaded", () => {
  // Ensure disabilities data is loaded
  if (disabilities && disabilities.length > 0) {
    const analyzer = new AlgorithmPerformanceAnalyzer(disabilities);
    const results = analyzer.analyzeAlgorithms();

    // Determine complexity classes
    const sortComplexityRecursive = analyzer.determineComplexityClass(results.recursiveSortTimes, results.inputSizes);
    const sortComplexityIterative = analyzer.determineComplexityClass(results.iterativeSortTimes, results.inputSizes);
    const searchComplexityRecursive = analyzer.determineComplexityClass(results.recursiveSearchTimes, results.inputSizes);
    const searchComplexityIterative = analyzer.determineComplexityClass(results.iterativeSearchTimes, results.inputSizes);

    // Generate and save reports
    const htmlReport = analyzer.generatePerformanceReport(results);
    const csvReport = analyzer.exportResultsToCSV(results);

    // Log complexity classes
    console.log("Sorting Complexity (Recursive):", sortComplexityRecursive);
    console.log("Sorting Complexity (Iterative):", sortComplexityIterative);
    console.log("Search Complexity (Recursive):", searchComplexityRecursive);
    console.log("Search Complexity (Iterative):", searchComplexityIterative);

    // Optional: Save reports (would require server-side implementation)
    // You might want to provide download links or save functionality
  }
});
