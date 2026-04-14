// src/features/trapecio/TrapecioView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { calcularTrapecio } from "./trapecioSlice";

export default function TrapecioView() {
  const dispatch = useDispatch();
  const { resultado, status, error } = useSelector((state) => state.trapecio);

  const [f, setF] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [n, setN] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularTrapecio({ f, intervalo, n: Number(n) }));
  };

  return (
    <div style={{ maxWidth: "480px" }}>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Field label="Función f(x)" hint="Usa * para multiplicación y ^ para potencia">
            <input
              placeholder="ej: x^2 + 2*x"
              value={f}
              onChange={(e) => setF(e.target.value)}
            />
          </Field>

          <Field label="Intervalo [a, b]" hint="Separa los límites con una coma">
            <input
              placeholder="ej: 0,2"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
            />
          </Field>

          <Field label="Número de divisiones (n)" hint="A mayor n, mayor precisión">
            <input
              type="number"
              placeholder="ej: 10"
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
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

        {/* Results */}
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
        )}
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