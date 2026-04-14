exports.trapecio = (req, res) => {
  try {
    let { f, intervalo, n } = req.body;

    let [a, b] = typeof intervalo === "string"
      ? intervalo.split(",").map(Number)
      : intervalo;

    if (!f || isNaN(a) || isNaN(b) || !n) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Reemplazo básico para potencia
    f = f.replace(/\^/g, "**");

    const func = new Function("x", `return ${f}`);

    let h = (b - a) / n;
    let suma = (func(a) + func(b)) / 2;

    for (let i = 1; i < n; i++) {
      suma += func(a + i * h);
    }

    let resultado = h * suma;

    res.json({ resultado });

  } catch (error) {
    res.status(500).json({ error: "Error en Trapecio" });
  }
};