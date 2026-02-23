export function MeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 50% 40% at 85% 5%, rgba(34,197,94,0.05), transparent)',
            'radial-gradient(ellipse 50% 40% at 15% 90%, rgba(139,92,246,0.04), transparent)',
          ].join(', '),
        }}
      />
    </div>
  );
}
