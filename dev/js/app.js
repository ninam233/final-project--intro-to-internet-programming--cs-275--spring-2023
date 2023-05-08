window.onload = () => {
        const title = document.createElement('h1');
        title.innerHTML = '<b>Flipping a Matrix Along a Diagonal</b>';
        const canvas = document.createElement('div');
        canvas.classList.add('canvas');
        const originalMatrixTitle = document.createElement('h2');
        originalMatrixTitle.textContent = 'Original Matrix';
        const flippedMatrixTitle = document.createElement('h2');
        flippedMatrixTitle.textContent = 'Flipped Matrix';

        const makeMatrix = (n) => {
          let counter = 1;
          const matrix = [];

          for (let row = 0; row < n; row++) {
            const tableRow = [];

            for (let col = 0; col < n; col++) {
              tableRow.push(counter++);
            }

            matrix.push(tableRow);
          }

          return matrix;
        };

        const flipMatrix = (matrix) => {
          const n = matrix.length - 1;

          for (let row = 0; row < n; row++) {
            for (let col = 0; col < n - row; col++) {
              const temp = matrix[n - row][n - col];
              matrix[n - row][n - col] = matrix[row][col];
              matrix[row][col] = temp;
            }
          }

          return matrix;
        };

        const makeTable = (matrix) => {
          const table = document.createElement('table');

          for (let row = 0; row < matrix.length; row++) {
            const tr = table.insertRow();

            for (let col = 0; col < matrix.length; col++) {
              const td = tr.insertCell();

              if (col === matrix.length - 1 - row) {
                td.classList.add('diagonal');
              }

              td.textContent = matrix[row][col];
            }
          }

          return table;
        };

        const handleMatrixSizeInput = () => {
          const input = prompt('Enter the size of the matrix (minimum 2):');
          const matrixSize = parseInt(input);

          if (isNaN(matrixSize) || matrixSize < 2) {
            alert('Please enter an integer value greater than or equal to 2');
            return;
          }

          const matrix = makeMatrix(matrixSize);

          canvas.innerHTML = '';

          document.body.appendChild(canvas);
          canvas.appendChild(originalMatrixTitle);
          canvas.appendChild(makeTable(matrix));

          const flippedMatrix = flipMatrix(matrix);

          canvas.appendChild(flippedMatrixTitle);
          canvas.appendChild(makeTable(flippedMatrix));
        };

        const generateMatrixButton = document.getElementById('generate-matrix-button');
        generateMatrixButton.addEventListener('click', handleMatrixSizeInput);
};
