exports.lagrange = (req, res) => {
  try {
    let { puntos, xp } = req.body;

    if (typeof puntos === "string") {
      puntos = puntos.split(";").map(p => p.split(",").map(Number));
    }

    const x = puntos.map(p => p[0]);
    const y = puntos.map(p => p[1]);

    let n = x.length;
    let yp = 0;

    for (let i = 0; i < n; i++) {
      let li = 1;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          if (x[i] === x[j]) {
            return res.status(400).json({ error: "Valores x repetidos" });
          }
          li *= (xp - x[j]) / (x[i] - x[j]);
        }
      }
      yp += li * y[i];
    }

    res.json({ resultado: yp });

  } catch (error) {
    res.status(500).json({ error: "Error en Lagrange" });
  }
};