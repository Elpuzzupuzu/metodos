// src/features/gauss/GaussView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { calcularGauss } from "./gaussSlice";
import ChartCard from "../../components/ChartCard";
import Chart from "chart.js/auto";

export default function GaussView() {
  const dispatch = useDispatch();
  const { resultado, status } = useSelector((state) => state.gauss);

  const [A, setA] = useState("");
  const [b, setB] = useState("");

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularGauss({ A, b }));
  };

  // 🔥 Gráfica con Chart.js
  useEffect(() => {
    if (!Array.isArray(resultado)) return;

    const data = resultado.map((val, i) => ({
      x: `x${i + 1}`,
      y: typeof val === "number" ? val : 0,
    }));

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.x),
        datasets: [
          {
            label: "Valor de variables",
            data: data.map((d) => d.y),
            backgroundColor: data.map((d) =>
              d.y >= 0 ? "rgba(133,79,11,0.8)" : "rgba(226,75,74,0.8)"
            ),
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Valor: ${ctx.raw.toFixed(6)}`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Variables" },
          },
          y: {
            title: { display: true, text: "Magnitud" },
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
    <>
      {/* CARD PRINCIPAL */}
      <div style={{ maxWidth: "480px" }}>
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
                background: "#FAEEDA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth={1.8}>
                <rect x="3" y="3" width="8" height="5" rx="1" />
                <rect x="13" y="3" width="8" height="5" rx="1" />
                <rect x="3" y="10" width="8" height="5" rx="1" />
                <rect x="13" y="10" width="8" height="5" rx="1" />
                <line x1="3" y1="19" x2="21" y2="19" strokeDasharray="3 2" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 500 }}>Método de Gauss</h2>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                Eliminación gaussiana · Ax = b
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Field label="Matriz A" hint="ej: 2,1;3,4">
              <input value={A} onChange={(e) => setA(e.target.value)} />
            </Field>

            <Field label="Vector b" hint="ej: 5,6">
              <input value={b} onChange={(e) => setB(e.target.value)} />
            </Field>

            <button
              type="submit"
              style={{
                width: "100%",
                height: 40,
                marginTop: "0.5rem",
                background: "#854F0B",
                color: "#fff",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
              }}
            >
              Resolver sistema
            </button>
          </form>

          {/* Resultado */}
          {resultado && (
            <div
              style={{
                marginTop: "1rem",
                background: "var(--color-background-secondary)",
                padding: "1rem",
                borderRadius: "var(--border-radius-md)",
              }}
            >
              {resultado.map((val, i) => (
                <div key={i}>
                  x{i + 1} = {typeof val === "number" ? val.toFixed(4) : val}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 CHART */}
      {Array.isArray(resultado) && (
        <ChartCard
          title="Visualización del resultado"
          subtitle="Magnitud de cada variable"
          loading={status === "loading"}
        >
          <div style={{ height: 220 }}>
            <canvas ref={canvasRef} />
          </div>
        </ChartCard>
      )}
    </>
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