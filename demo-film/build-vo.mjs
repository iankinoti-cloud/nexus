// Final audio for the 82s film, built from components so CLICKS stay audible:
//   • music  → ducked under the voice (sidechain)
//   • voice  → each ElevenLabs line on its beat
//   • clicks → a "tock" on every real nav click, ON TOP, NOT ducked (prominent)
// Muxes onto the graded, locked-frame video (out/video-subbed.mp4).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'inherit', 'inherit'] });
const R = f => JSON.parse(readFileSync(f, 'utf8'));
const D = R('raw/desktop/manifest.json'), P = R('raw/phone/manifest.json');

// Mirror build.mjs SEG (src/ss/dur) to recover beat starts + map clicks.
const dm = 'desktop', pm = 'phone';
const SEG = [
  { src: 'card', dur: 7.5 },
  { src: dm, man: D, ss: 1.0,  dur: 9.5 },
  { src: dm, man: D, ss: 10.5, dur: 6.5 },
  { src: dm, man: D, ss: 17.0, dur: 6.0 },
  { src: dm, man: D, ss: 23.3, dur: 20.2 },
  { src: dm, man: D, ss: 45.3, dur: 5.2 },
  { src: pm, man: P, ss: 6.5,  dur: 6.5 },
  { src: pm, man: P, ss: 13.0, dur: 7.0 },
  { src: pm, man: P, ss: 20.0, dur: 9.0 },
  { src: 'card', dur: 9.0 },
];
const X = 0.4;
const starts = [];
SEG.reduce((acc, s, i) => { starts[i] = i === 0 ? 0 : acc; return acc + s.dur - X; }, 0);
const total = SEG.reduce((a, s) => a + s.dur, 0) - X * (SEG.length - 1);

// Click timestamps on the final timeline.
const clickTimes = [];
SEG.forEach((s, i) => {
  if (!s.man) return;
  for (const c of s.man.clicks) {
    const t = c.t / 1000;
    if (t >= s.ss && t <= s.ss + s.dur) clickTimes.push(starts[i] + (t - s.ss));
  }
});
clickTimes.sort((a, b) => a - b);
console.log('clicks (s):', clickTimes.map(t => t.toFixed(1)).join(', '));

// VO placement: line(i+1) → segment i, small offset so voice lands just after the cut.
const OFF = [1.2, 0.35, 0.35, 0.35, 0.55, 0.3, 0.35, 0.35, 0.35, 0.7];
const vDelays = starts.map((s, i) => Math.round((s + OFF[i]) * 1000));

// Punchy click "tock": short filtered white-noise transient, loud.
ff(['-f', 'lavfi', '-i', 'anoisesrc=d=0.055:c=white:a=0.9',
  '-af', 'highpass=f=1100,lowpass=f=6500,afade=t=out:st=0.005:d=0.05,volume=2.2', 'assets/tock.wav']);

// Inputs: 0=music, 1..10=VO, 11=tock
const voIn = vDelays.flatMap((_, i) => ['-i', `assets/vo/line${String(i + 1).padStart(2, '0')}.mp3`]);
const TOCK = 1 + vDelays.length; // index 11

let fc = '';
// Voice
vDelays.forEach((d, i) => { fc += `[${i + 1}:a]adelay=${d}|${d},volume=1.25[v${i}];`; });
fc += vDelays.map((_, i) => `[v${i}]`).join('') + `amix=inputs=${vDelays.length}:normalize=0[vosum];`;
fc += `[vosum]asplit=2[vok0][vomix];`;
fc += `[vok0]apad,atrim=0:${(total + 0.1).toFixed(2)}[vokey];`;
// Music ducked under voice
fc += `[0:a]volume=1.0[musraw];`;
fc += `[musraw][vokey]sidechaincompress=threshold=0.04:ratio=9:attack=20:release=320:makeup=1[musduck];`;
// Clicks — un-ducked, on top
fc += `[${TOCK}:a]asplit=${clickTimes.length}` + clickTimes.map((_, i) => `[t${i}]`).join('') + ';';
clickTimes.forEach((t, i) => { fc += `[t${i}]adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)},volume=1.7[k${i}];`; });
fc += clickTimes.map((_, i) => `[k${i}]`).join('') + `amix=inputs=${clickTimes.length}:normalize=0[clicks];`;
// Final blend
fc += `[musduck][vomix][clicks]amix=inputs=3:normalize=0:duration=longest,alimiter=limit=0.97,` +
      `aformat=sample_rates=48000:channel_layouts=stereo[aout]`;

ff(['-i', 'assets/music.wav', ...voIn, '-i', 'assets/tock.wav',
  '-filter_complex', fc, '-map', '[aout]', 'out/audio-voiced.wav']);
ff(['-i', 'out/video-subbed.mp4', '-i', 'out/audio-voiced.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'out/NEXUS-film-voiced.mp4']);
console.log('✅ out/NEXUS-film-voiced.mp4 (clicks un-ducked + audible)');
