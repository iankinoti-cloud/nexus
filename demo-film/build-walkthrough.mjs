// Fluent product walkthrough, cut to the continuous ElevenLabs narration.
// Each beat transitions exactly when George moves to that topic. No subtitles,
// no clicks — just voice over a ducked music bed. Locked frames, real emblem.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'inherit', 'inherit'] });
const NT = JSON.parse(readFileSync('assets/vo/narration_times.json', 'utf8'));
const S = NT.section_start;              // 8 section start times (voice clock)
const NDUR = NT.dur;
const V0 = 1.2, TAIL = 2.0, X = 0.3, FPS = 30;
const dm = 'out/desktop-framed.mp4', pm = 'out/phone-framed.mp4';

// Beat targets on the film clock. Mobile section (S[6]) shows two phone screens.
const mobMid = (S[6] + S[7]) / 2;
const t = [
  0,                 // intro card (hook, S0)
  V0 + S[1],         // dashboard
  V0 + S[2],         // core
  V0 + S[3],         // projects
  V0 + S[4],         // people
  V0 + S[5],         // analytics
  V0 + S[6],         // phone · clients
  V0 + mobMid,       // phone · knowledge
  V0 + S[7],         // outro card (close)
];
const end = V0 + NDUR + TAIL;
const targets = [...t, end];
const gap = i => targets[i + 1] - targets[i];

const BEAT = [
  { src: 'card', img: 'assets/card-intro.png' },
  { src: dm, ss: 4.6 },
  { src: dm, ss: 32.3 },
  { src: dm, ss: 11.0 },
  { src: dm, ss: 17.4 },
  { src: dm, ss: 46.8 },
  { src: pm, ss: 7.8 },
  { src: pm, ss: 22.0 },
  { src: 'card', img: 'assets/card-outro.png' },
];
const n = BEAT.length;
BEAT.forEach((b, i) => { b.dur = (i < n - 1) ? gap(i) + X : gap(i); });
console.log('beat durations:', BEAT.map(b => b.dur.toFixed(2)).join(', '));
console.log('total:', BEAT.reduce((a, b) => a + b.dur, 0) - X * (n - 1), 's');

// 1. Segments — locked frame (no zoom); phone gets a static push-in.
const norm = `fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p`;
BEAT.forEach((b, i) => {
  const out = `out/wt${String(i).padStart(2, '0')}.mp4`;
  if (b.src === 'card') {
    const fr = Math.round(b.dur * FPS);
    ff(['-loop', '1', '-t', b.dur.toFixed(3), '-r', String(FPS), '-i', b.img,
      '-vf', `scale=1920:1080,fade=t=in:st=0:d=0.6,fade=t=out:st=${(b.dur - 0.6).toFixed(2)}:d=0.6,setsar=1,format=yuv420p`,
      '-frames:v', String(fr), '-an', out]);
  } else {
    const extra = (b.src === pm) ? ',scale=2592:1458:flags=lanczos,crop=1920:1080' : '';
    ff(['-ss', b.ss.toFixed(3), '-t', b.dur.toFixed(3), '-i', b.src, '-vf', norm + extra, '-an', out]);
  }
});

// 2. xfade chain + grade (no subtitles).
const inputs = BEAT.flatMap((_, i) => ['-i', `out/wt${String(i).padStart(2, '0')}.mp4`]);
let fc = '', prev = '0:v', off = 0;
for (let i = 1; i < n; i++) {
  off += BEAT[i - 1].dur - X;
  const lbl = i === n - 1 ? 'vx' : `x${i}`;
  fc += `[${prev}][${i}:v]xfade=transition=fade:duration=${X}:offset=${off.toFixed(3)}[${lbl}];`;
  prev = lbl;
}
fc += `[vx]eq=contrast=1.04:saturation=1.06:gamma=0.98,vignette=PI/4.6[vout]`;
ff([...inputs, '-filter_complex', fc, '-map', '[vout]',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-crf', '19', 'out/wt-video.mp4']);
console.log('wt-video.mp4 built');

// 3. Audio — continuous narration + ducked music bed (no clicks).
const T = end.toFixed(2);
ff(['-f', 'lavfi', '-i', `sine=frequency=110:duration=${T}`,
    '-f', 'lavfi', '-i', `sine=frequency=164.81:duration=${T}`,
    '-f', 'lavfi', '-i', `sine=frequency=220:duration=${T}`,
    '-filter_complex', '[0][1][2]amix=inputs=3:normalize=0,tremolo=f=0.12:d=0.35,lowpass=f=360,aecho=0.8:0.6:70:0.3,volume=0.5[a]',
    '-map', '[a]', 'assets/music-wt.wav']);
ff(['-i', 'assets/music-wt.wav', '-i', 'assets/vo/narration.mp3', '-filter_complex',
  `[1:a]adelay=${Math.round(V0 * 1000)}|${Math.round(V0 * 1000)},loudnorm=I=-15:TP=-1.5:LRA=11,apad,atrim=0:${T},asplit=2[vok][vom];` +
  `[0:a]volume=0.5[mus];` +
  `[mus][vok]sidechaincompress=threshold=0.05:ratio=9:attack=20:release=350:makeup=1[musd];` +
  `[musd][vom]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.97,aformat=sample_rates=48000:channel_layouts=stereo[aout]`,
  '-map', '[aout]', '-t', T, 'out/wt-audio.wav']);

ff(['-i', 'out/wt-video.mp4', '-i', 'out/wt-audio.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'out/NEXUS-walkthrough.mp4']);
console.log('✅ out/NEXUS-walkthrough.mp4');
