// src/App.jsx
import { useState } from "react";
import GaussView from "./features/gauss/GaussView";
import LagrangeView from "./features/lagrange/LagrangeView";
import TrapecioView from "./features/trapecio/TrapecioView";

const METODOS = [
  {
    id: "gauss",
    label: "Gauss",
    subtitle: "Eliminación gaussiana",
    accent: "#854F0B",
    bg: "#FAEEDA",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth={1.8}>
        <rect x="3" y="3" width="8" height="5" rx="1"/>
        <rect x="13" y="3" width="8" height="5" rx="1"/>
        <rect x="3" y="10" width="8" height="5" rx="1"/>
        <rect x="13" y="10" width="8" height="5" rx="1"/>
        <line x1="3" y1="19" x2="21" y2="19" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    id: "lagrange",
    label: "Lagrange",
    subtitle: "Interpolación polinomial",
    accent: "#3B6D11",
    bg: "#EEF6E1",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth={1.8}>
        <circle cx="5" cy="19" r="1.5" fill="#3B6D11"/>
        <circle cx="10" cy="10" r="1.5" fill="#3B6D11"/>
        <circle cx="17" cy="14" r="1.5" fill="#3B6D11"/>
        <path d="M5 19 Q9 6 10 10 Q13 16 17 14" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    id: "trapecio",
    label: "Trapecio",
    subtitle: "Integración numérica",
    accent: "#185FA5",
    bg: "#E6F1FB",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth={1.8}>
        <polyline points="3 17 8 7 16 7 21 17"/>
        <line x1="3" y1="17" x2="21" y2="17"/>
      </svg>
    ),
  },
];

function App() {
  const [metodo, setMetodo] = useState("gauss");
  const active = METODOS.find((m) => m.id === metodo);

  const renderMetodo = () => {
    switch (metodo) {
      case "gauss":     return <GaussView />;
      case "lagrange":  return <LagrangeView />;
      case "trapecio":  return <TrapecioView />;
      default:          return <GaussView />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Métodos numéricos
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
            Herramientas de cálculo numérico aplicado
          </p>
        </div>

        {/* Nav tabs */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: "1.25rem",
        }}>
          {METODOS.map((m) => {
            const isActive = metodo === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMetodo(m.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  gap: 6, padding: "10px 12px", cursor: "pointer",
                  background: isActive ? "var(--color-background-primary)" : "transparent",
                  border: isActive
                    ? `0.5px solid ${m.accent}`
                    : "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-md)",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "var(--border-radius-md)",
                  background: isActive ? m.bg : "var(--color-background-secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {m.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? m.accent : "var(--color-text-primary)", margin: 0 }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0, marginTop: 1 }}>
                    {m.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {renderMetodo()}
        </div>

      </div>
    </div>
  );
}

export default App;