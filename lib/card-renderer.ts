import { ReadingDNA } from './social';

export interface CardData {
  displayName: string;
  username: string;
  readingDNA: ReadingDNA;
}

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

export function renderDNACard(canvas: HTMLCanvasElement, data: CardData): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  bgGrad.addColorStop(0, '#18181b');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Accent border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40);

  // Corner accents
  drawCornerAccent(ctx, 20, 20, 1, 1);
  drawCornerAccent(ctx, CARD_WIDTH - 20, 20, -1, 1);
  drawCornerAccent(ctx, 20, CARD_HEIGHT - 20, 1, -1);
  drawCornerAccent(ctx, CARD_WIDTH - 20, CARD_HEIGHT - 20, -1, -1);

  // Title
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('LINEAGE LIT', 60, 65);

  ctx.fillStyle = '#71717a';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('READING DNA', 200, 65);

  // User name
  ctx.fillStyle = '#fafafa';
  ctx.font = 'bold 42px system-ui, sans-serif';
  ctx.fillText(data.displayName, 60, 130);

  ctx.fillStyle = '#71717a';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText(`@${data.username}`, 60, 160);

  // Literary DNA badges
  let badgeX = 60;
  const badgeY = 200;
  ctx.font = 'bold 16px system-ui, sans-serif';
  data.readingDNA.literaryDNA.forEach((trait) => {
    const width = ctx.measureText(trait).width + 24;
    // Badge background
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    roundRect(ctx, badgeX, badgeY, width, 34, 17);
    ctx.fill();
    // Badge border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1;
    roundRect(ctx, badgeX, badgeY, width, 34, 17);
    ctx.stroke();
    // Badge text
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(trait, badgeX + 12, badgeY + 23);
    badgeX += width + 12;
  });

  // Stats row
  const statsY = 280;
  drawStat(ctx, 60, statsY, String(data.readingDNA.totalBooks), 'Books Read');
  drawStat(ctx, 260, statsY, String(data.readingDNA.totalAuthors), 'Authors');
  drawStat(ctx, 460, statsY, `${data.readingDNA.influenceScore}%`, 'Influence');
  drawStat(ctx, 660, statsY, `Top ${data.readingDNA.topAuthors.length}`, 'Authors');

  // Genre bars
  const barStartY = 390;
  ctx.fillStyle = '#71717a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('GENRE BREAKDOWN', 60, barStartY - 10);

  data.readingDNA.favoriteGenres.slice(0, 4).forEach((genre, i) => {
    const y = barStartY + i * 40 + 10;

    // Label
    ctx.fillStyle = '#d4d4d8';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(genre.name, 60, y + 12);

    // Percentage
    ctx.fillStyle = '#71717a';
    ctx.fillText(`${genre.percentage}%`, 300, y + 12);

    // Bar background
    ctx.fillStyle = '#27272a';
    roundRect(ctx, 360, y, 500, 16, 8);
    ctx.fill();

    // Bar fill
    const grad = ctx.createLinearGradient(360, y, 360 + 500 * genre.percentage / 100, y);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(1, '#ea580c');
    ctx.fillStyle = grad;
    roundRect(ctx, 360, y, 500 * genre.percentage / 100, 16, 8);
    ctx.fill();
  });

  // Era timeline at bottom right
  const eraY = 390;
  ctx.fillStyle = '#71717a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('ERA BREAKDOWN', 900, eraY - 10);

  data.readingDNA.eraBreakdown.forEach((era, i) => {
    const y = eraY + i * 50 + 10;
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(String(era.count), 900, y + 20);
    ctx.fillStyle = '#71717a';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(era.era, 940, y + 20);
  });

  // Footer
  ctx.fillStyle = '#52525b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('lineagelit.com', CARD_WIDTH - 160, CARD_HEIGHT - 40);
}

function drawCornerAccent(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) {
  ctx.beginPath();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.moveTo(x, y + dy * 20);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dx * 20, y);
  ctx.stroke();
}

function drawStat(ctx: CanvasRenderingContext2D, x: number, y: number, value: string, label: string) {
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.fillText(value, x, y + 30);
  ctx.fillStyle = '#71717a';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(label, x, y + 52);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
