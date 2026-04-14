// src/features/trapecio/TrapecioView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { calcularTrapecio } from "./trapecioSlice";
import Chart from "chart.js/auto";

export default function TrapecioView() {
  const dispatch = useDispatch();
  const { resultado, status, error } = useSelector((state) => state.trapecio);

  const [f, setF] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [n, setN] = useState("");

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularTrapecio({ f, intervalo, n: Number(n) }));
  };

  useEffect(() => {
    if (resultado === null) return;

    const partes = intervalo.split(",").map((s) => s.trim());
    if (partes.length !== 2 || partes.some(isNaN)) return;

    const a = parseFloat(partes[0]);
    const b = parseFloat(partes[1]);
    const nVal = parseInt(n);
    if (isNaN(a) || isNaN(b) || isNaN(nVal) || a >= b || nVal < 1) return;

    const parseFn = (expr) => {
      const e = expr
        .replace(/\^/g, "**")
        .replace(/(\d)(x)/gi, "$1*$2")
        .replace(/([a-z])(\d)/gi, "$1*$2");
      // eslint-disable-next-line no-new-func
      return (x) => Function("x", "return " + e)(x);
    };

    const fn = parseFn(f);
    const h = (b - a) / nVal;

    // Curva continua
    const curvePoints = 120;
    const curveStep = (b - a) / curvePoints;
    const curveData = Array.from({ length: curvePoints + 1 }, (_, i) => {
      const x = a + i * curveStep;
      return { x, y: fn(x) };
    });

    // Puntos de los trapecios (vértices)
    const trapXs = Array.from({ length: nVal + 1 }, (_, i) => a + i * h);
    const trapData = trapXs.map((x) => ({ x, y: fn(x) }));

    // Relleno de área: puntos de la poligonal + base
    const fillData = [
      { x: a, y: 0 },
      ...trapData,
      { x: b, y: 0 },
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            // Área rellena de trapecios
            label: "Área aproximada",
            data: fillData,
            showLine: true,
            fill: true,
            backgroundColor: "rgba(55,138,221,0.15)",
            borderColor: "rgba(55,138,221,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            tension: 0,
            order: 3,
          },
          {
            // Líneas verticales de los trapecios
            label: "_trapLines",
            data: trapData,
            showLine: false,
            pointRadius: 4,
            pointBackgroundColor: "#185FA5",
            pointBorderColor: "#fff",
            pointBorderWidth: 1.5,
            order: 2,
          },
          {
            // Curva real de f(x)
            label: `f(x) = ${f}`,
            data: curveData,
            showLine: true,
            fill: false,
            borderColor: "#185FA5",
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.3,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: (item) => item.dataset.label !== "_trapLines",
            callbacks: {
              label: (ctx) =>
                ctx.dataset.label === "Área aproximada"
                  ? null
                  : `f(${ctx.parsed.x.toFixed(3)}) = ${ctx.parsed.y.toFixed(5)}`,
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "x", color: "#888", font: { size: 12 } },
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: { color: "#888", font: { size: 11 }, maxTicksLimit: 8 },
          },
          y: {
            title: { display: true, text: "f(x)", color: "#888", font: { size: 12 } },
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: { color: "#888", font: { size: 11 }, maxTicksLimit: 6 },
          },
        },
      },
    });
  }, [resultado]);   // se redibuja cada vez que llega un nuevo resultado

  // Limpia el chart al desmontar
  useEffect(() => {
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.5rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--border-radius-md)",
            background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth={1.8}>
              <polyline points="3 17 8 7 16 7 21 17" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 500 }}>Regla del trapecio</h2>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
              Integración numérica
            </p>
          </div>
        </div>

        {/* Layout: form + gráfica */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Formulario */}
          <div>
            <form onSubmit={handleSubmit}>
              <Field label="Función f(x)" hint="Usa * para multiplicación y ^ para potencia">
                <input placeholder="ej: x^2 + 2*x" value={f} onChange={(e) => setF(e.target.value)} />
              </Field>
              <Field label="Intervalo [a, b]" hint="Separa los límites con una coma">
                <input placeholder="ej: 0,2" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
              </Field>
              <Field label="Número de divisiones (n)" hint="A mayor n, mayor precisión">
                <input type="number" placeholder="ej: 10" value={n} onChange={(e) => setN(e.target.value)} />
              </Field>
              <button type="submit" style={{
                width: "100%", height: 40, marginTop: "0.5rem",
                background: "#185FA5", color: "#fff", border: "none",
                borderRadius: "var(--border-radius-md)", fontSize: 14,
                fontWeight: 500, cursor: "pointer",
              }}>
                Calcular integral
              </button>
            </form>

            {/* Resultado */}
            {(status === "loading" || error || resultado !== null) && (
              <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "1.25rem 0" }} />
            )}

            {status === "loading" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#378ADD", display: "inline-block" }} />
                Calculando...
              </div>
            )}

            {error && (
              <div style={{
                background: "var(--color-background-danger)",
                border: "0.5px solid var(--color-border-danger)",
                borderRadius: "var(--border-radius-md)",
                padding: "0.75rem 1rem", fontSize: 13,
                color: "var(--color-text-danger)",
              }}>
                Error: {JSON.stringify(error)}
              </div>
            )}

            {resultado !== null && (
              <>
                <div style={{
                  background: "var(--color-background-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  padding: "1rem 1.25rem",
                  display: "flex", alignItems: "baseline", gap: 8,
                }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Resultado</span>
                  <span style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    {resultado}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {[`n = ${n}`, `h = ${((parseFloat(intervalo.split(",")[1]) - parseFloat(intervalo.split(",")[0])) / parseInt(n)).toFixed(4)}`, `[${intervalo}]`].map((t) => (
                    <span key={t} style={{
                      fontSize: 11, background: "#E6F1FB", color: "#185FA5",
                      borderRadius: "var(--border-radius-md)", padding: "2px 8px", fontWeight: 500,
                    }}>{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Gráfica */}
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "1rem",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: resultado !== null ? "flex-start" : "center",
            alignItems: resultado !== null ? "stretch" : "center",
          }}>
            {resultado === null ? (
              <div style={{ textAlign: "center", color: "var(--color-text-tertiary)" }}>
                <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} style={{ opacity: 0.4 }}>
                  <polyline points="3 17 8 7 16 7 21 17" /><line x1="3" y1="17" x2="21" y2="17" />
                </svg>
                <p style={{ fontSize: 12, marginTop: 8 }}>Ingresa datos para ver la gráfica</p>
              </div>
            ) : (
              <>
                <div style={{ position: "relative", width: "100%", height: 240 }}>
                  <canvas ref={canvasRef} role="img" aria-label="Gráfica de integración numérica por regla del trapecio" />
                </div>
                {/* Leyenda */}
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 14, height: 3, background: "#185FA5", borderRadius: 2, display: "inline-block" }} />
                    f(x) = {f}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 14, height: 14, background: "rgba(55,138,221,0.2)", border: "1px solid rgba(55,138,221,0.6)", borderRadius: 2, display: "inline-block" }} />
                    Área de trapecios
                  </span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{hint}</span>}
    </div>
  );
}