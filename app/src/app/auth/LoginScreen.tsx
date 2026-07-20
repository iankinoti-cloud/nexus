import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import nexusEmblem from '../../imports/NEXUS-_-EMBLEM.jpeg';
import { authErrorFromUrl } from '../lib/supabase';
import { useAuth } from './AuthProvider';

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      style={{ colorScheme: 'light', flexShrink: 0 } as React.CSSProperties}
    >
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function LoginScreen() {
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const [authError] = useState<string | null>(authErrorFromUrl);

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex flex-col items-center text-center"
        style={{ maxWidth: 380 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl overflow-hidden mb-6"
          style={{ width: 88, height: 88, boxShadow: '0 0 60px rgba(var(--accent-rgb),0.15)' }}
        >
          <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
        </motion.div>

        <div className="tracking-widest mb-1" style={{ color: 'var(--text)', fontSize: 'calc(22px * var(--fs))', fontWeight: 700, letterSpacing: '0.22em' }}>
          NEXUS
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(14px * var(--fs))', marginBottom: authError ? 20 : 36 }}>
          The Operating System for Creative Enterprises.
        </p>

        {authError && (
          <div
            className="w-full flex items-start gap-2 rounded-lg px-3 py-2.5 mb-4 text-left"
            style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)' }}
          >
            <AlertTriangle size={14} style={{ color: '#FF6B6B', flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: '#FF6B6B', fontSize: 'calc(12px * var(--fs))', lineHeight: 1.5 }}>
              Sign-in failed: {authError}
            </span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01, background: '#FFFFFF' }}
          whileTap={{ scale: 0.98 }}
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-xl py-3 mb-3"
          style={{
            background: 'var(--text)',
            color: '#0B0B0F',
            fontSize: 'calc(14px * var(--fs))',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        <motion.button
          whileHover={{ borderColor: 'rgba(var(--accent-rgb),0.4)', color: 'var(--accent)' }}
          whileTap={{ scale: 0.98 }}
          onClick={continueAsGuest}
          className="w-full rounded-xl py-3"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-dim)',
            fontSize: 'calc(13px * var(--fs))',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Explore as guest
        </motion.button>

        <p style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', marginTop: 28, opacity: 0.6 }}>
          Guest sessions run locally. Sign in to sync your workspace across devices.
        </p>
      </motion.div>
    </div>
  );
}
