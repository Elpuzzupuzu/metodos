// src/features/lagrange/LagrangeView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { calcularLagrange } from "./lagrangeSlice";

export default function LagrangeView() {
  const dispatch = useDispatch();
  const { resultado, status, error } = useSelector((state) => state.lagrange);

  const [puntos, setPuntos] = useState("");
  const [xp, setXp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularLagrange({ puntos, xp: Number(xp) }));
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
            background: "#EEF6E1", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
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
          <Field label="Puntos (x, y)" hint="Separa cada punto con ; y coordenadas con ,">
            <input
              placeholder="ej: 1,2;2,3;3,5"
              value={puntos}
              onChange={(e) => setPuntos(e.target.value)}
            />
          </Field>

          <Field label="Valor a interpolar (xp)" hint="Punto donde se estima el valor de f(x)">
            <input
              type="number"
              step="any"
              placeholder="ej: 2.5"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </Field>

          <button type="submit" style={{
            width: "100%", height: 40, marginTop: "0.5rem",
            background: "#3B6D11", color: "#fff", border: "none",
            borderRadius: "var(--border-radius-md)", fontSize: 14,
            fontWeight: 500, cursor: "pointer",
          }}>
            Calcular interpolación
          </button>
        </form>

        {/* States */}
        {(status === "loading" || error || resultado !== null) && (
          <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "1.25rem 0" }} />
        )}

        {status === "loading" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#639922", display: "inline-block" }} />
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
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>f({xp}) ≈</span>
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