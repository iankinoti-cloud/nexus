import { Component, type ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router';
import { AlertTriangle, RotateCcw } from 'lucide-react';

function Fallback({ title, detail, onReset }: { title: string; detail?: string; onReset?: () => void }) {
  return (
    <div
      className="flex-1 flex items-center justify-center p-6 h-full w-full"
      style={{ background: 'var(--bg)', minHeight: 240 }}
    >
      <div
        className="glass glass-strong flex flex-col items-center text-center rounded-2xl px-6 py-8"
        style={{ maxWidth: 380, border: '1px solid rgba(255,107,107,0.28)' }}
      >
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{ width: 48, height: 48, background: 'rgba(255,107,107,0.1)' }}
        >
          <AlertTriangle size={22} style={{ color: '#FF6B6B' }} />
        </div>
        <div style={{ color: 'var(--text)', fontSize: 'calc(16px * var(--fs))', fontWeight: 600, marginBottom: 6 }}>
          {title}
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))', lineHeight: 1.5, marginBottom: 20 }}>
          {detail || 'This panel hit a snag. The rest of NEXUS is still running — reload to bring it back.'}
        </p>
        <button
          onClick={onReset ?? (() => window.location.reload())}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{
            background: 'rgba(var(--accent-rgb),0.12)',
            border: '1px solid rgba(var(--accent-rgb),0.35)',
            color: 'var(--accent)',
            fontSize: 'calc(13px * var(--fs))',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          {onReset ? 'Try again' : 'Reload NEXUS'}
        </button>
      </div>
    </div>
  );
}

/**
 * Route-level error element — a crash inside a page renders here, inside the
 * shell, so the sidebar/nav stay alive and only the panel degrades.
 */
export function RouteError() {
  const error = useRouteError();
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : undefined;
  return <Fallback title="This view ran into a problem" detail={detail} />;
}

/**
 * Top-level class boundary — catches anything the router boundary can't
 * (provider/shell render errors) so the demo never goes fully blank.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-dvh w-full flex" style={{ background: 'var(--bg)' }}>
          <Fallback
            title="NEXUS needs a refresh"
            detail={this.state.error.message}
            onReset={() => this.setState({ error: null })}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
