// src/components/ChartCard.jsx
export default function ChartCard({ children, title, subtitle }) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "1.25rem 1.5rem",
      marginTop: 12,
    }}>
      {title && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}