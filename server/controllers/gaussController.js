exports.gauss = (req, res) => {
  try {
    let { A, b } = req.body;

    // Convertir strings a matrices
    if (typeof A === "string") {
      A = A.split(";").map(row => row.split(",").map(Number));
    }
    if (typeof b === "string") {
      b = b.split(",").map(Number);
    }

    const n = A.length;

    if (!A || !b || A.length !== b.length) {
      return res.status(400).json({ error: "Dimensiones inválidas" });
    }

    // Copia de la matriz
    A = A.map(row => [...row, b[A.indexOf(row)]]);

    // Eliminación con pivoteo parcial
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
          maxRow = k;
        }
      }
      [A[i], A[maxRow]] = [A[maxRow], A[i]];

      for (let j = i + 1; j < n; j++) {
        let factor = A[j][i] / A[i][i];
        for (let k = i; k <= n; k++) {
          A[j][k] -= factor * A[i][k];
        }
      }
    }

    // Sustitución hacia atrás
    let x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = A[i][n];
      for (let j = i + 1; j < n; j++) {
        x[i] -= A[i][j] * x[j];
      }
      x[i] /= A[i][i];
    }

    res.json({ resultado: x });

  } catch (error) {
    res.status(500).json({ error: "Error en Gauss" });
  }
};