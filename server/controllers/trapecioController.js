exports.trapecio = (req, res) => {
  try {
    let { f, intervalo, n } = req.body;

    console.log("📥 INPUT RAW:", { f, intervalo, n });

    // Convertir
    let [a, b] = typeof intervalo === "string"
      ? intervalo.split(",").map(Number)
      : intervalo;

    n = Number(n);

    console.log("🔢 PARSED:", { a, b, n });

    // Validación
    if (!f || isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
      console.log("❌ VALIDACIÓN FALLÓ");
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Normalizar función
    const fOriginal = f;

    f = f
      .replace(/\^/g, "**")
      .replace(/(\d)(x)/gi, "$1*$2")
      .replace(/(x)(\d)/gi, "$1*$2")
      .replace(/(\d)(\()/g, "$1*$2")
      .replace(/(\))(x)/g, "$1*$2");

    console.log("🧠 FUNCIÓN:", { original: fOriginal, transformada: f });

    const func = new Function("x", `return ${f}`);

    const h = (b - a) / n;

    console.log("📏 PASO h:", h);

    // 🔥 Extremos
    const fa = func(a);
    const fb = func(b);

    console.log("📍 EXTREMOS:", { a, fa, b, fb });

    if (isNaN(fa) || isNaN(fb)) {
      console.log("❌ ERROR EN EXTREMOS");
      return res.status(400).json({ error: "Error evaluando la función en extremos" });
    }

    // 🔥 Suma intermedia
    let sumaIntermedia = 0;

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const fx = func(x);

      console.log(`🔹 i=${i} | x=${x.toFixed(6)} | f(x)=${fx}`);

      if (isNaN(fx)) {
        console.log("❌ ERROR EN LOOP en x:", x);
        return res.status(400).json({ error: `Error evaluando la función en x=${x}` });
      }

      sumaIntermedia += fx;

      console.log(`   ➕ sumaIntermedia: ${sumaIntermedia}`);
    }

    // 🔥 Fórmula correcta
    const resultado = (h / 2) * (fa + 2 * sumaIntermedia + fb);

    console.log("🧮 RESULTADO FINAL:");
    console.log("   fa:", fa);
    console.log("   fb:", fb);
    console.log("   sumaIntermedia:", sumaIntermedia);
    console.log("   resultado:", resultado);

    res.json({ resultado });

  } catch (error) {
    console.error("💥 ERROR GENERAL:", error);
    res.status(500).json({ error: "Error en Trapecio" });
  }
};