import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChapterProgress } from './ChapterProgress';
import { useChapterTimer } from './useChapterTimer';
import { Chapter1_Problem } from './chapters/Chapter1_Problem';
import { Chapter2_Evidence } from './chapters/Chapter2_Evidence';
import { Chapter3_Formula } from './chapters/Chapter3_Formula';
import { Chapter4_Palette } from './chapters/Chapter4_Palette';
import { Chapter5_Result } from './chapters/Chapter5_Result';

const CHAPTERS = [
  { Component: Chapter1_Problem, duration: 7200, isDark: true },
  { Component: Chapter2_Evidence, duration: 7200, isDark: false },
  { Component: Chapter3_Formula, duration: 7500, isDark: false },
  { Component: Chapter4_Palette, duration: 6800, isDark: true },
  { Component: Chapter5_Result, duration: 99_999_999, isDark: true },
] as const;

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-55%' : '55%',
    opacity: 0,
  }),
};

export function StoryPage() {
  const [chapter, setChapter] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const navigate = useNavigate();

  const go = useCallback(
    (next: number) => {
      if (next < 0) { navigate('/'); return; }
      if (next >= CHAPTERS.length) return;
      setDirection(next > chapter ? 1 : -1);
      setChapter(next);
      setTimerKey(k => k + 1);
    },
    [chapter, navigate],
  );

  const progress = useChapterTimer(
    CHAPTERS[chapter].duration,
    paused,
    () => { if (chapter < CHAPTERS.length - 1) go(chapter + 1); },
    timerKey,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') go(chapter + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'j' || e.key === 'J') go(chapter - 1);
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter, go, navigate]);

  const { isDark } = CHAPTERS[chapter];
  const arrowColor = isDark ? 'rgba(245,240,232,0.35)' : 'rgba(45,38,32,0.3)';
  const ChapterComp = CHAPTERS[chapter].Component;

  return (
    <MotionConfig reducedMotion="user">
      <div
        style={{ position: 'fixed', inset: 0, overflow: 'hidden', userSelect: 'none' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <ChapterProgress
          total={CHAPTERS.length}
          current={chapter}
          progress={progress}
          onNavigate={go}
          isDark={isDark}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={chapter}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ChapterComp />
          </motion.div>
        </AnimatePresence>

        {/* Left arrow */}
        {chapter > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={() => go(chapter - 1)}
            style={{
              position: 'fixed', left: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: arrowColor, fontSize: 36, zIndex: 50,
              padding: '10px 8px', lineHeight: 1, opacity: 0,
            }}
          >
            ‹
          </motion.button>
        )}

        {/* Right arrow */}
        {chapter < CHAPTERS.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={() => go(chapter + 1)}
            style={{
              position: 'fixed', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: arrowColor, fontSize: 36, zIndex: 50,
              padding: '10px 8px', lineHeight: 1, opacity: 0,
            }}
          >
            ›
          </motion.button>
        )}

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            position: 'fixed', bottom: 50, right: 18,
            color: isDark ? '#F5F0E8' : '#2D2620',
            fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
            zIndex: 50, pointerEvents: 'none',
          }}
        >
          → advance · esc exit
        </motion.div>
      </div>
    </MotionConfig>
  );
}
