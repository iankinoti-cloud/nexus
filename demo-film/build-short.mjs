// NEXUS short-form trailer — fast cut of the REAL footage synced to Ian's
// ElevenLabs voiceover (~19.3s). Reuses the framed masters + plates; his VO is
// the spine, music ducked underneath.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const sh = (c, a) => execFileSync(c, a, { stdio: ['ignore', 'inherit', 'inherit'] });
const ff = a => sh('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const FPS = 30, X = 0.25;
const dm = 'out/desktop-framed.mp4', pm = 'out/phone-framed.mp4';
const VO = process.env.VO || `${process.env.HOME}/Downloads/NEXUS/NEXUS AUDIO.mpeg`;

// Fast-cut beats timed to the VO's rapid read.
const SEG = [
  { src: 'card', img: 'assets/card-intro.png', dur: 3.6, tag: '', sub: 'They have a knowing problem.' },
  { src: dm, ss: 4.6,  dur: 2.4, tag: 'MISSION CONTROL', sub: 'Executive clarity, in real time.' },
  { src: dm, ss: 32.3, dur: 3.0, tag: 'CORE · LIVE AI',  sub: 'Ask it anything.' },
  { src: dm, ss: 11.0, dur: 2.2, tag: 'PROJECTS',        sub: 'Kickoff to close.' },
  { src: dm, ss: 17.4, dur: 2.2, tag: 'PEOPLE',          sub: 'Before the burnout.' },
  { src: pm, ss: 7.8,  dur: 2.4, tag: 'MOBILE',          sub: 'In your pocket.' },
  { src: dm, ss: 46.8, dur: 2.2, tag: 'IMPACT',          sub: 'Outcomes from day one.' },
  { src: 'card', img: 'assets/card-outro.png', dur: 3.1, tag: '', sub: '' },
];

const starts = [];
SEG.reduce((acc, s, i) => { starts[i] = i === 0 ? 0 : acc; return acc + s.dur - X; }, 0);
const total = SEG.reduce((a, s) => a + s.dur, 0) - X * (SEG.length - 1);
console.log('short timeline:', total.toFixed(2), 's');

const norm = `fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p`;
SEG.forEach((s, i) => {
  const out = `out/short${String(i).padStart(2, '0')}.mp4`;
  if (s.src === 'card') {
    const fr = Math.round(s.dur * FPS);
    ff(['-loop', '1', '-t', String(s.dur), '-r', String(FPS), '-i', s.img,
      '-vf', `scale=2112:1188,zoompan=z='min(1+0.06*on/${fr},1.06)':d=1:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':s=1920x1080:fps=${FPS},` +
             `fade=t=in:st=0:d=0.5,fade=t=out:st=${(s.dur - 0.5).toFixed(2)}:d=0.5,setsar=1,format=yuv420p`,
      '-frames:v', String(fr), '-an', out]);
  } else {
    const extra = (s.src === pm) ? ',scale=2592:1458:flags=lanczos,crop=1920:1080' : '';
    ff(['-ss', String(s.ss), '-t', String(s.dur), '-i', s.src, '-vf', norm + extra, '-an', out]);
  }
});

// xfade chain
const inputs = SEG.flatMap((_, i) => ['-i', `out/short${String(i).padStart(2, '0')}.mp4`]);
let fc = '', prev = '0:v';
for (let i = 1; i < SEG.length; i++) {
  const lbl = i === SEG.length - 1 ? 'vout' : `x${i}`;
  fc += `[${prev}][${i}:v]xfade=transition=fade:duration=${X}:offset=${starts[i].toFixed(3)}[${lbl}];`;
  prev = lbl;
}
fc = fc.replace(/;$/, '');
ff([...inputs, '-filter_complex', fc, '-map', '[vout]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-crf', '18', 'out/short-video.mp4']);

// Subtitles
const TEAL = '&H00C5D14F';
const toAss = t => { const cs = Math.round((t % 1) * 100), s = Math.floor(t) % 60, m = Math.floor(t / 60) % 60; return `0:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`; };
let ass = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Line,DejaVu Sans,50,&H00F4F4F5,&H90000000,&H90000000,1,0,1,0,3,2,160,160,150,1
Style: Tag,DejaVu Sans,24,${TEAL},&H00000000,&H00000000,1,0,1,0,0,2,160,160,224,1
[Events]
Format: Layer, Start, End, Style, MarginL, MarginR, MarginV, Effect, Text
`;
SEG.forEach((s, i) => {
  if (!s.sub) return;
  const st = starts[i] + 0.2, en = starts[i] + s.dur - 0.15;
  ass += `Dialogue: 0,${toAss(st)},${toAss(en)},Line,,,,,${s.sub}\n`;
  if (s.tag) ass += `Dialogue: 0,${toAss(st)},${toAss(en)},Tag,,,,,${s.tag}\n`;
});
writeFileSync('assets/subs-short.ass', ass);
ff(['-i', 'out/short-video.mp4', '-vf', 'subtitles=assets/subs-short.ass:fontsdir=/usr/share/fonts', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', 'out/short-subbed.mp4']);

// Audio: his VO (leveled) + ducked ambient bed
ff(['-f', 'lavfi', '-i', `sine=frequency=110:duration=${total.toFixed(2)}`,
    '-f', 'lavfi', '-i', `sine=frequency=164.81:duration=${total.toFixed(2)}`,
    '-filter_complex', '[0][1]amix=inputs=2:normalize=0,tremolo=f=0.12:d=0.3,lowpass=f=340,volume=0.5[a]',
    '-map', '[a]', 'assets/music-short.wav']);
ff(['-i', VO, '-i', 'assets/music-short.wav', '-filter_complex',
  '[0:a]loudnorm=I=-15:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo[vo];' +
  '[1:a]volume=0.16,aformat=sample_rates=48000:channel_layouts=stereo[mus];' +
  '[vo][mus]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.96[aout]',
  '-map', '[aout]', 'out/short-audio.wav']);

// Mux — audio (VO) drives final length
ff(['-i', 'out/short-subbed.mp4', '-i', 'out/short-audio.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', 'out/NEXUS-short.mp4']);
console.log('\n✅ out/NEXUS-short.mp4');
