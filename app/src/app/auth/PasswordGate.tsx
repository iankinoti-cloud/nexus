import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import nexusEmblem from '../../imports/NEXUS-_-EMBLEM.jpeg';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const RELOCK_INTERVAL_MS = 30_000;
const ERROR_MESSAGE = 'MAYBE THE INTERNET MESSIAH KNOWS';
const CHAR_DELAY_MS = 55;

async function verifyPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

function TypewriterError({ active }: { active: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(ERROR_MESSAGE.slice(0, i));
      if (i >= ERROR_MESSAGE.length) clearInterval(id);
    }, CHAR_DELAY_MS);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setCursorOn(c => !c), 530);
    return () => clearInterval(id);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          style={{ width: '100%', overflow: 'hidden' }}
        >
          <div
            style={{
              background: 'rgba(220,20,20,0.07)',
              border: '1px solid rgba(220,20,20,0.3)',
              borderRadius: 8,
              padding: '9px 12px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#FF2222',
              textShadow: '0 0 12px rgba(255,34,34,0.55)',
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>{displayed}</span>
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: '1em',
                background: '#FF2222',
                marginLeft: 2,
                opacity: cursorOn ? 1 : 0,
                boxShadow: '0 0 6px #FF2222',
                transition: 'opacity 0.05s',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PasswordModal({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  async function submit() {
    if (!value || loading) return;
    setLoading(true);
    setError(false);
    const ok = await verifyPassword(value);
    setLoading(false);
    if (ok) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => {
        setShake(false);
        inputRef.current?.focus();
      }, 600);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(18px)' }}
    >
      <motion.div
        key="password-modal"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, scale: 1, y: 0, x: 0 }}
        transition={shake
          ? { duration: 0.55, ease: 'easeInOut' }
          : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        className="w-full flex flex-col items-center"
        style={{
          maxWidth: 360,
          background: 'var(--surface)',
          border: `1px solid ${error ? 'rgba(220,20,20,0.3)' : 'rgba(var(--accent-rgb),0.18)'}`,
          borderRadius: 20,
          padding: '36px 28px 32px',
          boxShadow: error
            ? '0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(220,20,20,0.08)'
            : '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(var(--accent-rgb),0.08)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{ width: 68, height: 68, boxShadow: '0 0 40px rgba(var(--accent-rgb),0.2)' }}
        >
          <ImageWithFallback src={nexusEmblem} alt="NEXUS" className="w-full h-full object-cover" />
        </div>

        <div
          className="tracking-widest mb-1"
          style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, letterSpacing: '0.2em' }}
        >
          NEXUS
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 28, textAlign: 'center' }}>
          This workspace is access-restricted.
        </p>

        <div className="w-full relative mb-3">
          <Lock
            size={14}
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: error ? '#FF2222' : 'var(--text-dim)', pointerEvents: 'none',
              transition: 'color 0.2s',
            }}
          />
          <input
            ref={inputRef}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => { setValue(e.target.value); setError(false); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            disabled={loading}
            placeholder="Access password"
            style={{
              width: '100%',
              background: 'var(--bg)',
              border: `1px solid ${error ? 'rgba(220,20,20,0.45)' : 'rgba(var(--accent-rgb),0.15)'}`,
              borderRadius: 10,
              padding: '10px 38px 10px 34px',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
              opacity: loading ? 0.6 : 1,
              transition: 'border-color 0.2s, opacity 0.15s',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            disabled={loading}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2,
            }}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <TypewriterError active={error} />

        <motion.button
          whileHover={{ opacity: loading ? 1 : 0.9 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={submit}
          disabled={loading}
          className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(var(--accent-rgb),0.15)',
            border: '1px solid rgba(var(--accent-rgb),0.35)',
            color: 'var(--accent)',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />}
          {loading ? 'Verifying…' : 'Unlock Access'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (locked) return;
    const id = setTimeout(() => setLocked(true), RELOCK_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [locked]);

  return (
    <>
      {children}
      <AnimatePresence>
        {locked && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PasswordModal onUnlock={() => setLocked(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
