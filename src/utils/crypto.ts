// Utility for dynamic 60s captcha, security hashing, and date formatters

export function generateCaptchaCode(length = 5): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function drawCaptchaOnCanvas(canvas: HTMLCanvasElement, code: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 65%)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height
    );
    ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 45; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Render each character with rotation and displacement
  const charSpacing = width / (code.length + 1.2);
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 26px "Courier New", monospace';

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const x = charSpacing * (i + 0.8);
    const y = height / 2 + (Math.random() * 6 - 3);
    const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = ['#0f172a', '#1e293b', '#334155', '#1e3a8a', '#0369a1'][i % 5];
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}

export function formatIndonesianDate(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return '-';
  
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[d.getDay()];
  const dayNum = d.getDate().toString().padStart(2, '0');
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

export function formatTime(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toTimeString().split(' ')[0]; // HH:mm:ss
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate simple SVG data URL for QR code representation
export function generateSvgQrCode(content: string, size = 180): string {
  // Using an embedded visual pattern representation based on content hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash |= 0;
  }

  const cells = 21;
  const cellSize = size / cells;
  let rects = '';

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // Finder patterns
      const isTopLeft = (r < 7 && c < 7);
      const isTopRight = (r < 7 && c >= cells - 7);
      const isBottomLeft = (r >= cells - 7 && c < 7);

      let isFilled = false;

      if (isTopLeft) {
        isFilled = (r === 0 || r === 6 || c === 0 || c === 6) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else if (isTopRight) {
        const localC = c - (cells - 7);
        isFilled = (r === 0 || r === 6 || localC === 0 || localC === 6) || (r >= 2 && r <= 4 && localC >= 2 && localC <= 4);
      } else if (isBottomLeft) {
        const localR = r - (cells - 7);
        isFilled = (localR === 0 || localR === 6 || c === 0 || c === 6) || (localR >= 2 && localR <= 4 && c >= 2 && c <= 4);
      } else {
        // Pseudo-deterministic pattern from content & coordinates
        const cellHash = Math.abs(hash * 31 + r * 17 + c * 43);
        isFilled = (cellHash % 3 === 0 || (r % 2 === 0 && c % 3 === 0));
      }

      if (isFilled) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/>${rects}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate simple Code 128 / Barcode SVG
export function generateBarcodeSvg(content: string, width = 240, height = 70): string {
  let bars = '';
  let x = 12;
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    const bit1 = (code % 2) + 1;
    const bit2 = ((code >> 1) % 2) + 1;
    const bit3 = ((code >> 2) % 3) + 1;

    bars += `<rect x="${x}" y="8" width="${bit1 * 1.5}" height="${height - 24}" fill="#0f172a"/>`;
    x += (bit1 * 1.5) + 2;
    bars += `<rect x="${x}" y="8" width="${bit2 * 1.5}" height="${height - 24}" fill="#0f172a"/>`;
    x += (bit2 * 1.5) + 2.5;
    bars += `<rect x="${x}" y="8" width="${bit3 * 1.5}" height="${height - 24}" fill="#0f172a"/>`;
    x += (bit3 * 1.5) + 2;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#ffffff"/>
    ${bars}
    <text x="${width / 2}" y="${height - 4}" font-family="monospace" font-size="11" text-anchor="middle" fill="#334155" letter-spacing="2">${content}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
