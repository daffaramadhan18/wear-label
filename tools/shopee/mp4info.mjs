// Minimal MP4 box walker: duration from moov/mvhd, pixel size from the video
// track's tkhd. Enough to say whether a clip is usable, without pulling ffmpeg.
import fs from "node:fs";

function boxes(buf, start, end, cb) {
  let p = start;
  while (p + 8 <= end) {
    let size = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    let head = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(p + 8));
      head = 16;
    } else if (size === 0) {
      size = end - p;
    }
    if (size < head || p + size > end) break;
    cb(type, p + head, p + size);
    p += size;
  }
}

export function probe(file) {
  const buf = fs.readFileSync(file);
  let dur = null;
  let w = null;
  let h = null;
  boxes(buf, 0, buf.length, (t, s, e) => {
    if (t !== "moov") return;
    boxes(buf, s, e, (t2, s2, e2) => {
      if (t2 === "mvhd") {
        const ver = buf[s2];
        const ts = ver === 1 ? buf.readUInt32BE(s2 + 20) : buf.readUInt32BE(s2 + 12);
        const d = ver === 1 ? Number(buf.readBigUInt64BE(s2 + 24)) : buf.readUInt32BE(s2 + 16);
        if (ts) dur = d / ts;
      }
      if (t2 === "trak") {
        boxes(buf, s2, e2, (t3, s3) => {
          if (t3 !== "tkhd") return;
          const ver = buf[s3];
          const off = ver === 1 ? s3 + 88 : s3 + 76;
          const tw = buf.readUInt32BE(off) / 65536;
          const th = buf.readUInt32BE(off + 4) / 65536;
          if (tw > 0 && th > 0) {
            w = Math.round(tw);
            h = Math.round(th);
          }
        });
      }
    });
  });
  return { bytes: buf.length, dur, w, h };
}

if (process.argv[2]) {
  for (const f of process.argv.slice(2)) {
    const r = probe(f);
    const name = f.split(/[\\/]/).slice(-2).join("/");
    console.log(
      `${name.padEnd(48)} ${r.w}x${r.h}`.padEnd(66) +
        `${r.dur ? r.dur.toFixed(1) + "s" : "?"}`.padEnd(8) +
        `${(r.bytes / 1048576).toFixed(2)} MB`
    );
  }
}
