// src/features/gauss/GaussView.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { calcularGauss } from "./gaussSlice";

export default function GaussView() {
  const dispatch = useDispatch();
  const { resultado, status } = useSelector((state) => state.gauss);

  const [A, setA] = useState("");
  const [b, setB] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(calcularGauss({ A, b }));
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
            background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth={1.8}>
              <rect x="3" y="3" width="8" height="5" rx="1"/>
              <rect x="13" y="3" width="8" height="5" rx="1"/>
              <rect x="3" y="10" width="8" height="5" rx="1"/>
              <rect x="13" y="10" width="8" height="5" rx="1"/>
              <line x1="3" y1="19" x2="21" y2="19" strokeDasharray="3 2"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 500 }}>Método de Gauss</h2>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
              Eliminación gaussiana · Ax = b
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Field label="Matriz A" hint="Filas separadas por ; y valores por ,">
            <input
              placeholder="ej: 2,1;3,4"
              value={A}
              onChange={(e) => setA(e.target.value)}
            />
          </Field>

          <Field label="Vector b" hint="Un valor por ecuación, separados por ,">
            <input
              placeholder="ej: 5,6"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </Field>

          <button type="submit" style={{
            width: "100%", height: 40, marginTop: "0.5rem",
            background: "#854F0B", color: "#fff", border: "none",
            borderRadius: "var(--border-radius-md)", fontSize: 14,
            fontWeight: 500, cursor: "pointer",
          }}>
            Resolver sistema
          </button>
        </form>

        {/* States */}
        {(status === "loading" || resultado) && (
          <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "1.25rem 0" }} />
        )}

        {status === "loading" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#BA7517", display: "inline-block" }} />
            Calculando...
          </div>
        )}

        {resultado && (
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "1rem 1.25rem",
          }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              Vector solución x
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {Array.isArray(resultado)
                ? resultado.map((val, i) => (
                    <div key={i} style={{
                      background: "var(--color-background-primary)",
                      border: "0.5px solid var(--color-border-tertiary)",
                      borderRadius: "var(--border-radius-md)",
                      padding: "6px 14px",
                      display: "flex", alignItems: "baseline", gap: 5,
                    }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>x{i + 1}</span>
                      <span style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {typeof val === "number" ? val.toFixed(4) : val}
                      </span>
                    </div>
                  ))
                : (
                  <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>
                    {JSON.stringify(resultado)}
                  </span>
                )}
            </div>
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