// src/features/lagrange/LagrangeView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { calcularLagrange } from "./lagrangeSlice";
import Chart from "chart.js/auto";

export default function LagrangeView() {
  const dispatch = useDispatch();
  const { resultado, status, error } = useSelector((state) => state.lagrange);

  const [puntos, setPuntos] = useState("");
  const [xp, setXp] = useState("");

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularLagrange({ puntos, xp: Number(xp) }));
  };

  // 🔥 Gráfica
  useEffect(() => {
    if (resultado === null) return;

    // Parsear puntos
    const pts = puntos.split(";").map((p) => {
      const [x, y] = p.split(",").map(Number);
      return { x, y };
    });

    if (pts.some((p) => isNaN(p.x) || isNaN(p.y))) return;

    // Función de Lagrange
    const lagrange = (x) => {
      let sum = 0;
      for (let i = 0; i < pts.length; i++) {
        let term = pts[i].y;
        for (let j = 0; j < pts.length; j++) {
          if (i !== j) {
            term *= (x - pts[j].x) / (pts[i].x - pts[j].x);
          }
        }
        sum += term;
      }
      return sum;
    };

    // Rango
    const xs = pts.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const curvePoints = 120;
    const step = (maxX - minX) / curvePoints;

    const curveData = Array.from({ length: curvePoints + 1 }, (_, i) => {
      const x = minX + i * step;
      return { x, y: lagrange(x) };
    });

    // Punto evaluado
    const xpVal = parseFloat(xp);
    const evalPoint = {
      x: xpVal,
      y: lagrange(xpVal),
    };

    // Destruir gráfica anterior
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Polinomio de Lagrange",
            data: curveData,
            showLine: true,
            borderColor: "#3B6D11",
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: "Puntos",
            data: pts,
            pointRadius: 5,
            backgroundColor: "#3B6D11",
          },
          {
            label: "xp",
            data: [evalPoint],
            pointRadius: 6,
            backgroundColor: "#ff6b6b",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "x" },
          },
          y: {
            title: { display: true, text: "f(x)" },
          },
        },
      },
    });
  }, [resultado]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div style={{ maxWidth: "600px" }}>
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--border-radius-md)",
              background: "#EEF6E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth={1.8}>
              <circle cx="5" cy="19" r="1.5" fill="#3B6D11" />
              <circle cx="10" cy="10" r="1.5" fill="#3B6D11" />
              <circle cx="17" cy="14" r="1.5" fill="#3B6D11" />
              <path d="M5 19 Q9 6 10 10 Q13 16 17 14" strokeDasharray="3 2" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 500 }}>Interpolación de Lagrange</h2>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
              Estimación por puntos conocidos
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Field label="Puntos (x, y)" hint="ej: 1,2;2,3;3,5">
            <input value={puntos} onChange={(e) => setPuntos(e.target.value)} />
          </Field>

          <Field label="Valor xp">
            <input type="number" value={xp} onChange={(e) => setXp(e.target.value)} />
          </Field>

          <button
            type="submit"
            style={{
              width: "100%",
              height: 40,
              marginTop: "0.5rem",
              background: "#3B6D11",
              color: "#fff",
              border: "none",
              borderRadius: "var(--border-radius-md)",
              cursor: "pointer",
            }}
          >
            Calcular
          </button>
        </form>

        {/* Resultado */}
        {resultado !== null && (
          <>
            <div
              style={{
                marginTop: "1rem",
                background: "var(--color-background-secondary)",
                padding: "1rem",
                borderRadius: "var(--border-radius-md)",
              }}
            >
              f({xp}) ≈ <strong>{resultado}</strong>
            </div>

            {/* Gráfica */}
            <div
              style={{
                marginTop: "1rem",
                height: 260,
                background: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-md)",
                padding: "1rem",
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontSize: 12 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11 }}>{hint}</div>}
    </div>
  );
}