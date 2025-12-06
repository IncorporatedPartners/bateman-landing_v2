// src/canvas.tsx
import React, { useEffect, useRef } from "react";

const EMERALD = "#047857";
const OXBLOOD = "#BE123C";
const BG = "#020617";

interface Candle {
  x: number;
  width: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

const generateCandles = (count: number, height: number): Candle[] => {
  const candles: Candle[] = [];
  let lastClose = height * 0.6;

  for (let i = 0; i < count; i++) {
    const body = (Math.random() - 0.5) * (height * 0.08);
    const close = Math.max(
      height * 0.15,
      Math.min(height * 0.85, lastClose + body)
    );
    const open = close + (Math.random() - 0.5) * (height * 0.05);
    const high = Math.max(open, close) + Math.random() * (height * 0.05);
    const low = Math.min(open, close) - Math.random() * (height * 0.05);

    candles.push({
      x: i,
      width: 1,
      open,
      close,
      high,
      low,
    });

    lastClose = close;
  }

  return candles;
};

const drawCandles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  candles: Candle[]
) => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, width, height);

  const paddingX = 32;
  const usableWidth = width - paddingX * 2;
  const spacing = usableWidth / candles.length;

  candles.forEach((c, idx) => {
    const baseX = paddingX + idx * spacing + spacing * 0.1;
    const bodyWidth = spacing * 0.6;

    const isBull = c.close >= c.open;
    const color = isBull ? EMERALD : OXBLOOD;

    // Wick
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX + bodyWidth / 2, c.high);
    ctx.lineTo(baseX + bodyWidth / 2, c.low);
    ctx.stroke();

    // Body
    ctx.fillStyle = color;
    const bodyTop = Math.min(c.open, c.close);
    const bodyHeight = Math.max(Math.abs(c.close - c.open), 3);
    ctx.fillRect(baseX, bodyTop, bodyWidth, bodyHeight);
  });

  // Subtle horizontal grid
  ctx.strokeStyle = "rgba(148,163,184,0.15)";
  ctx.lineWidth = 1;
  const rows = 4;
  for (let i = 1; i < rows; i++) {
    const y = (height / rows) * i;
    ctx.beginPath();
    ctx.moveTo(paddingX, y);
    ctx.lineTo(width - paddingX, y);
    ctx.stroke();
  }
};

const MarketCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let candles = generateCandles(48, rect.height);

      const render = () => {
        drawCandles(ctx, rect.width, rect.height, candles);
      };

      render();

      return { rect, render, ctx, candlesRef: { get: () => candles, set: (c: Candle[]) => (candles = c) } };
    };

    const state = setup();
    if (!state) return;

    const interval = window.setInterval(() => {
      const { rect, render, candlesRef } = state;
      const current = candlesRef.get();
      const jittered = [...current];

      for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * jittered.length);
        const replacement = generateCandles(1, rect.height)[0];
        replacement.x = index;
        jittered[index] = replacement;
      }

      candlesRef.set(jittered);
      render();
    }, 900);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-full w-full border-t border-black bg-black">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default MarketCanvas;
