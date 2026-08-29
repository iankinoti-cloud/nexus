import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';

interface KaizenModalProps {
  open: boolean;
  onGuest: () => void;
  onClose: () => void;
}

export function KaizenModal({ open, onGuest, onClose }: KaizenModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="kaizen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(20px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full flex flex-col items-center text-center"
            style={{
              maxWidth: 400,
              background: 'var(--surface)',
              border: '1px solid rgba(var(--accent-rgb),0.22)',
              borderRadius: 'var(--radius-blob)',
              padding: '40px 32px 32px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(var(--accent-rgb),0.08)',
              position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.35)',
                padding: 4,
              }}
            >
              <X size={15} />
            </button>

            {/* 改善 kanji */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 72,
                lineHeight: 1,
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--accent) 0%, rgba(var(--accent-rgb),0.5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 16,
                filter: 'drop-shadow(0 0 32px rgba(var(--accent-rgb),0.3))',
              }}
            >
              改善
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <div
                style={{
                  fontSize: 'calc(13px * var(--fs))',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  color: 'var(--accent)',
                } as React.CSSProperties}
              >
                KAIZEN
              </div>
              <h2
                style={{
                  color: 'var(--text)',
                  fontSize: 'calc(20px * var(--fs))',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                The philosophy of continuous improvement.
              </h2>
              <p
                style={{
                  color: 'var(--text-dim)',
                  fontSize: 'calc(13px * var(--fs))',
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                Google sign-in is in our improvement pipeline. In the meantime, explore the full
                NEXUS workspace as a guest.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGuest}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
              style={{
                background: 'var(--accent)',
                color: '#FFFFFF',
                fontSize: 'calc(14px * var(--fs))',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Explore as Guest <ArrowRight size={15} />
            </motion.button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-dim)',
                fontSize: 'calc(12px * var(--fs))',
                marginTop: 14,
                opacity: 0.7,
              }}
            >
              ← Back to sign-in
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
