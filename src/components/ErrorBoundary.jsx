import { ErrorBoundary } from 'react-error-boundary'

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0C0C0C',
        color: '#EDE7D9',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#D4A574' }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: '0.9rem', color: 'rgba(237,231,217,0.5)', maxWidth: 400, marginBottom: '1.5rem' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '0.625rem 1.5rem',
            borderRadius: 9999,
            border: 'none',
            background: 'linear-gradient(135deg, #D4A574, #A67C52)',
            color: '#0C0C0C',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '0.625rem 1.5rem',
            borderRadius: 9999,
            border: '1px solid rgba(212,165,116,0.2)',
            color: '#D4A574',
            fontSize: '0.85rem',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Reload home
        </a>
      </div>
    </div>
  )
}

export { ErrorBoundary, Fallback }
