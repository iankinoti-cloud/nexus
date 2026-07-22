// NEXUS film assembler.
// Cuts framed masters into beats, xfade-chains them with intro/outro cards,
// burns styled subtitles, and builds an audio bed where a "tock" lands on every
// REAL click (mapped from the Playwright timestamp logs). VO is mixed in if
// assets/vo.wav exists (music ducks under it); otherwise a silent-cut is produced.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
const ff = args => sh('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
const R = f => JSON.parse(readFileSync(f, 'utf8'));

const D = R('raw/desktop/manifest.json');
const P = R('raw/phone/manifest.json');
const X = 0.4;           // xfade seconds
const FPS = 30;
const dm = 'out/desktop-framed.mp4', pm = 'out/phone-framed.mp4';

// ── Timeline: source, in-point (s), duration (s), section tag, subtitle line ──
const SEG = [
  { src: 'card', img: 'assets/card-intro.png', dur: 7.5, tag: '', sub: "Creative teams don't have a work problem. They have a knowing problem." },
  { src: dm, man: D, ss: 1.0,  dur: 9.5, tag: 'MISSION CONTROL', sub: 'This is NEXUS. Executive clarity, in real time.' },
  { src: dm, man: D, ss: 10.5, dur: 6.5, tag: 'PROJECTS',        sub: 'Every project — intelligent from kickoff to close.' },
  { src: dm, man: D, ss: 17.0, dur: 6.0, tag: 'PEOPLE',          sub: 'See your team with clarity — before they burn out.' },
  { src: dm, man: D, ss: 23.3, dur: 20.2, tag: 'CORE INTELLIGENCE', sub: 'Ask it anything. The intelligence at the heart of everything answers.' },
  { src: dm, man: D, ss: 45.3, dur: 5.2, tag: 'BUSINESS IMPACT', sub: 'Measurable outcomes, from day one.' },
  { src: pm, man: P, ss: 6.5,  dur: 6.5, tag: 'CLIENTS',   sub: 'And it lives in your pocket — relationships, not records.' },
  { src: pm, man: P, ss: 13.0, dur: 7.0, tag: 'NOTIFICATIONS', sub: 'Every signal that matters, the moment it matters.' },
  { src: pm, man: P, ss: 20.0, dur: 9.0, tag: 'KNOWLEDGE', sub: 'Your organization never forgets.' },
  { src: 'card', img: 'assets/card-outro.png', dur: 9.0, tag: '', sub: '' },
];

// Final start time of each segment given xfade overlap.
const starts = [];
SEG.reduce((acc, s, i) => { starts[i] = i === 0 ? 0 : acc; return acc + s.dur - X; }, 0);
const total = SEG.reduce((a, s) => a + s.dur, 0) - X * (SEG.length - 1);
console.log(`timeline: ${total.toFixed(1)}s across ${SEG.length} segments`);

// ── 1. Build normalized segment clips ────────────────────────────────────────
const norm = 'fps=' + FPS + ',scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p';
SEG.forEach((s, i) => {
  const out = `out/seg${String(i).padStart(2, '0')}.mp4`;
  if (s.src === 'card') {
    const frames = Math.round(s.dur * FPS);
    // Static card — locked to frame, gentle fade in/out only (no zoom = no jitter).
    ff(['-loop', '1', '-t', String(s.dur), '-r', String(FPS), '-i', s.img,
      '-vf', `scale=1920:1080,fade=t=in:st=0:d=0.7,fade=t=out:st=${(s.dur - 0.7).toFixed(2)}:d=0.7,setsar=1,format=yuv420p`,
      '-frames:v', String(frames), '-an', out]);
  } else {
    // Phone beats: static push-in so the device reads large in a 16:9 frame.
    // No animated zoom — the frame stays locked; the UI's own motion carries it.
    const extra = (s.src === pm) ? ',scale=2592:1458:flags=lanczos,crop=1920:1080' : '';
    ff(['-ss', String(s.ss), '-t', String(s.dur), '-i', s.src,
      '-vf', norm + extra, '-an', out]);
  }
  console.log('seg', i, 'ok');
});

// ── 2. xfade-chain into a single video master ────────────────────────────────
const inputs = SEG.flatMap((_, i) => ['-i', `out/seg${String(i).padStart(2, '0')}.mp4`]);
let fc = '', prev = '0:v';
for (let i = 1; i < SEG.length; i++) {
  const off = (starts[i]).toFixed(3);
  const outLbl = i === SEG.length - 1 ? 'vout' : `x${i}`;
  fc += `[${prev}][${i}:v]xfade=transition=fade:duration=${X}:offset=${off}[${outLbl}];`;
  prev = outLbl;
}
fc = fc.replace(/;$/, '');
ff([...inputs, '-filter_complex', fc, '-map', '[vout]',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-crf', '18', 'out/video-master.mp4']);
console.log('video-master.mp4 built');

// ── 3. Subtitles (.ass burned + .srt sidecar) ────────────────────────────────
const TEAL = '&H00C5D14F'; // ASS is &HAABBGGRR ; teal #4FD1C5 -> BGR C5D14F
const toAss = t => {
  const cs = Math.round((t % 1) * 100), s = Math.floor(t) % 60, m = Math.floor(t / 60) % 60, h = Math.floor(t / 3600);
  return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
};
const wrap = (txt, n = 42) => {
  const w = txt.split(' '); let line = '', out = [];
  for (const x of w) { if ((line + ' ' + x).trim().length > n) { out.push(line.trim()); line = x; } else line += ' ' + x; }
  if (line.trim()) out.push(line.trim());
  return out.join('\\N');
};
let ass = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Line,Liberation Sans,46,&H00F4F4F5,&H90000000,&H90000000,0,0,1,0,3,2,180,180,172,1
Style: Tag,Liberation Sans,24,${TEAL},&H00000000,&H00000000,1,0,1,0,0,2,180,180,248,1
[Events]
Format: Layer, Start, End, Style, MarginL, MarginR, MarginV, Effect, Text
`;
let srt = '', si = 1;
SEG.forEach((s, i) => {
  if (!s.sub) return;
  const st = starts[i] + 0.35, en = starts[i] + s.dur - 0.3;
  ass += `Dialogue: 0,${toAss(st)},${toAss(en)},Line,,,,,${wrap(s.sub)}\n`;
  if (s.tag) ass += `Dialogue: 0,${toAss(st)},${toAss(en)},Tag,,,,,${s.tag}\n`;
  const f = t => { const ms = Math.round((t % 1) * 1000), sec = Math.floor(t) % 60, mn = Math.floor(t / 60) % 60, hr = Math.floor(t / 3600); return `${String(hr).padStart(2,'0')}:${String(mn).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms).padStart(3,'0')}`; };
  srt += `${si++}\n${f(st)} --> ${f(en)}\n${s.sub}\n\n`;
});
writeFileSync('assets/subs.ass', ass);
writeFileSync('out/NEXUS-film.srt', srt);
ff(['-i', 'out/video-master.mp4', '-vf',
  "eq=contrast=1.04:saturation=1.06:gamma=0.98,vignette=PI/4.6," +
  "subtitles=assets/subs.ass:fontsdir=/usr/share/fonts",
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', 'out/video-subbed.mp4']);
console.log('subtitles burned');

// ── 4. Map every real click to final-timeline time ───────────────────────────
const clickTimes = [];
SEG.forEach((s, i) => {
  if (s.src === 'card' || !s.man) return;
  for (const c of s.man.clicks) {
    const t = c.t / 1000;
    if (t >= s.ss && t <= s.ss + s.dur) clickTimes.push(starts[i] + (t - s.ss));
  }
});
clickTimes.sort((a, b) => a - b);
console.log('clicks on timeline:', clickTimes.map(t => t.toFixed(1)).join(', '));

// ── 5. Audio: tock per click + ambient music bed (+ VO if present) ────────────
ff(['-f', 'lavfi', '-i', 'anoisesrc=d=0.07:c=pink:a=0.7',
  '-af', 'highpass=f=420,lowpass=f=3200,afade=t=out:st=0.006:d=0.06,volume=1.4', 'assets/tock.wav']);
const T = total.toFixed(2);
ff(['-f', 'lavfi', '-i', `sine=frequency=110:duration=${T}`,
    '-f', 'lavfi', '-i', `sine=frequency=164.81:duration=${T}`,
    '-f', 'lavfi', '-i', `sine=frequency=220:duration=${T}`,
    '-filter_complex',
    '[0][1][2]amix=inputs=3:normalize=0,tremolo=f=0.12:d=0.35,lowpass=f=360,aecho=0.8:0.6:70:0.3,volume=0.5[a]',
    '-map', '[a]', 'assets/music.wav']);

const hasVO = existsSync('assets/vo.wav');
// Build click track: one delayed tock per click, summed (no normalize).
const tockInputs = clickTimes.flatMap(() => ['-i', 'assets/tock.wav']);
let ac = `[0:a]volume=${hasVO ? '0.34' : '0.62'}[mus];`;
const musIdx = 0; // input 0 = music
// tock inputs start at index 1
clickTimes.forEach((t, k) => { ac += `[${k + 1}:a]adelay=${Math.round(t * 1000)}:all=1,volume=0.9[c${k}];`; });
const mixLabels = clickTimes.map((_, k) => `[c${k}]`).join('');
let nMix = 1 + clickTimes.length; // mus + clicks
let voPart = '';
if (hasVO) { voPart = `[${1 + clickTimes.length}:a]volume=1.0[vo];`; nMix += 1; }
ac += voPart + `[mus]${mixLabels}${hasVO ? '[vo]' : ''}amix=inputs=${nMix}:normalize=0:duration=longest,` +
      `alimiter=limit=0.95,aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:${T},afade=t=out:st=${(total - 1).toFixed(2)}:d=1[aout]`;
const audioInputs = ['-i', 'assets/music.wav', ...tockInputs, ...(hasVO ? ['-i', 'assets/vo.wav'] : [])];
ff([...audioInputs, '-filter_complex', ac, '-map', '[aout]', 'out/audio-mix.wav']);
console.log('audio mixed', hasVO ? '(with VO)' : '(silent-cut: music + clicks)');

// ── 6. Mux ───────────────────────────────────────────────────────────────────
ff(['-i', 'out/video-subbed.mp4', '-i', 'out/audio-mix.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'out/NEXUS-film.mp4']);
console.log(`\n✅ out/NEXUS-film.mp4  (${total.toFixed(1)}s)`);
