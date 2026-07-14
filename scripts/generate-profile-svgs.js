const fs = require("fs");
const path = require("path");

const dir = path.join("public", "profiles");
fs.mkdirSync(dir, { recursive: true });

const people = [
  { n: "marina", tones: ["#2A1816", "#1A1210"], accent: "#FF2A16", shape: "orbit" },
  { n: "clara", tones: ["#141C24", "#0C1014"], accent: "#C7C9CC", shape: "slash" },
  { n: "helena", tones: ["#1C1822", "#0E0C12"], accent: "#F3F2EE", shape: "arc" },
  { n: "sofia", tones: ["#161A18", "#0A0C0A"], accent: "#FF2A16", shape: "dot" },
  { n: "beatriz", tones: ["#221A14", "#100C08"], accent: "#C7C9CC", shape: "orbit" },
  { n: "laura", tones: ["#141820", "#0A0C10"], accent: "#F3F2EE", shape: "slash" },
  { n: "isabela", tones: ["#201418", "#100A0C"], accent: "#FF2A16", shape: "arc" },
  { n: "julia", tones: ["#181C1A", "#0C0E0C"], accent: "#C7C9CC", shape: "dot" },
  { n: "camila", tones: ["#1A1622", "#0C0A12"], accent: "#F3F2EE", shape: "orbit" },
  { n: "valentina", tones: ["#1E1814", "#0E0C0A"], accent: "#FF2A16", shape: "arc" },
  { n: "amanda", tones: ["#182018", "#0A100A"], accent: "#C7C9CC", shape: "slash" },
  { n: "renata", tones: ["#201818", "#100C0C"], accent: "#F3F2EE", shape: "orbit" },
];

function deco(shape, ac) {
  if (shape === "orbit") {
    return `<circle cx="450" cy="400" r="150" fill="none" stroke="${ac}" stroke-width="1.8" opacity="0.4"/><circle cx="450" cy="400" r="95" fill="none" stroke="${ac}" stroke-width="1.2" opacity="0.22" stroke-dasharray="10 12"/><circle cx="450" cy="400" r="8" fill="${ac}" opacity="0.7"/>`;
  }
  if (shape === "slash") {
    return `<path d="M280 260 L620 560" stroke="${ac}" stroke-width="1.6" opacity="0.35"/><path d="M300 240 L640 540" stroke="${ac}" stroke-width="1" opacity="0.18"/>`;
  }
  if (shape === "arc") {
    return `<path d="M220 480 Q450 220 680 480" fill="none" stroke="${ac}" stroke-width="1.8" opacity="0.35"/><path d="M260 500 Q450 300 640 500" fill="none" stroke="${ac}" stroke-width="1.2" opacity="0.2"/>`;
  }
  return `<circle cx="380" cy="360" r="6" fill="${ac}" opacity="0.5"/><circle cx="520" cy="420" r="10" fill="${ac}" opacity="0.35"/><circle cx="450" cy="500" r="4" fill="${ac}" opacity="0.45"/>`;
}

for (const p of people) {
  const max = ["marina", "valentina", "amanda"].includes(p.n) ? 3 : 2;
  for (let v = 1; v <= max; v++) {
    const a = p.tones[0];
    const offset = v === 2 ? "40" : v === 3 ? "-30" : "0";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs>
    <radialGradient id="r" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </radialGradient>
  </defs>
  <rect width="900" height="1200" fill="url(#r)"/>
  <g transform="translate(0,${offset})">${deco(p.shape, p.accent)}</g>
  <text x="450" y="860" text-anchor="middle" fill="#F3F2EE" font-family="system-ui,sans-serif" font-size="40" font-weight="600" letter-spacing="10">${p.n.toUpperCase()}</text>
  <text x="450" y="910" text-anchor="middle" fill="#999996" font-family="system-ui,sans-serif" font-size="16">Prototipo - Perfil ficticio</text>
  <text x="450" y="1120" text-anchor="middle" fill="#999996" font-family="system-ui,sans-serif" font-size="13" opacity="0.55" letter-spacing="6">VORA</text>
</svg>
`;
    fs.writeFileSync(path.join(dir, `${p.n}-${v}.svg`), svg);
  }
}

console.log("ok", fs.readdirSync(dir).length);
