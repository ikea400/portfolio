import { useEffect, useRef } from 'react';

export default function BackgroundGrid({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas.parentElement || document.body);

    // Grid spacing & particle configuration
    const spacing = 32;
    let time = 0;

    // --- METEOR ANIMATION CONFIGURATION ---
    interface Sparkle {
      x: number;
      y: number;
      alpha: number;
      size: number;
    }

    interface Meteor {
      x: number;
      y: number;
      speed: number;
      length: number;
      angle: number;
      width: number;
      alpha: number;
      color: string;
      sparkles: Sparkle[];
    }

    const meteors: Meteor[] = [];
    const numMeteors = 8;
    const mouseAvoidRadius = 220;

    const createMeteor = (isInitial = false): Meteor => {
      const angle = Math.PI * 0.75; // 135 degrees (falling down-left)
      const startX = isInitial 
        ? Math.random() * width * 1.5 
        : Math.random() * (width + 200) - 100;
      const startY = isInitial 
        ? Math.random() * height - 100 
        : -150 - Math.random() * 100;

      const isOrange = Math.random() < 0.35;
      const color = isDarkMode 
        ? (isOrange ? '255, 185, 81' : '230, 242, 255')
        : (isOrange ? '37, 99, 235' : '15, 23, 42');

      return {
        x: startX,
        y: startY,
        speed: 2 + Math.random() * 4,
        length: 60 + Math.random() * 90,
        angle: angle,
        width: 1 + Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.3,
        color,
        sparkles: []
      };
    };

    for (let i = 0; i < numMeteors; i++) {
      meteors.push(createMeteor(true));
    }

    // Helper: minimum distance from point to segment AB
    const getDistanceToSegment = (
      px: number, py: number,
      ax: number, ay: number,
      bx: number, by: number
    ) => {
      const abx = bx - ax;
      const aby = by - ay;
      const apx = px - ax;
      const apy = py - ay;
      
      const ab_len_sq = abx * abx + aby * aby;
      if (ab_len_sq === 0) return Math.sqrt(apx * apx + apy * apy);
      
      let t = (apx * abx + apy * aby) / ab_len_sq;
      t = Math.max(0, Math.min(1, t));
      
      const projx = ax + t * abx;
      const projy = ay + t * aby;
      
      const dx = px - projx;
      const dy = py - projy;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const draw = () => {
      time += 0.01;
      ctx.fillStyle = isDarkMode ? '#09090B' : '#FAFAFA';
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Meteors (before grid dots to layer correctly)
      for (const meteor of meteors) {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        // Reset if off-screen (bottom/left bounds)
        if (meteor.y > height + 150 || meteor.x < -150) {
          Object.assign(meteor, createMeteor(false));
        }

        // Distance from mouse to meteor head for smooth avoidance
        const mdx = mouse.x - meteor.x;
        const mdy = mouse.y - meteor.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        let meteorAlpha = meteor.alpha;
        if (mdist < mouseAvoidRadius) {
          meteorAlpha *= (mdist / mouseAvoidRadius);
        }

        if (meteorAlpha > 0.01) {
          const ax = meteor.x;
          const ay = meteor.y;
          const bx = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const by = meteor.y - Math.sin(meteor.angle) * meteor.length;

          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, `rgba(${meteor.color}, ${meteorAlpha})`);
          grad.addColorStop(0.2, `rgba(${meteor.color}, ${meteorAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${meteor.color}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = meteor.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();

          // Spawn sparkling dust
          if (Math.random() < 0.25) {
            meteor.sparkles.push({
              x: meteor.x + (Math.random() - 0.5) * 3,
              y: meteor.y + (Math.random() - 0.5) * 3,
              alpha: meteorAlpha * 0.7,
              size: 0.4 + Math.random() * 0.8
            });
          }
        }

        // Update and draw sparkles
        for (let i = meteor.sparkles.length - 1; i >= 0; i--) {
          const s = meteor.sparkles[i];
          s.x -= Math.cos(meteor.angle) * 0.4;
          s.y -= Math.sin(meteor.angle) * 0.4;
          s.alpha -= 0.015;

          if (s.alpha <= 0) {
            meteor.sparkles.splice(i, 1);
          } else {
            let sparkleAlpha = s.alpha;
            const smdx = mouse.x - s.x;
            const smdy = mouse.y - s.y;
            const smdist = Math.sqrt(smdx * smdx + smdy * smdy);
            if (smdist < mouseAvoidRadius) {
              sparkleAlpha *= (smdist / mouseAvoidRadius);
            }

            if (sparkleAlpha > 0.01) {
              ctx.fillStyle = `rgba(${meteor.color}, ${sparkleAlpha})`;
              ctx.beginPath();
              ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      const startX = Math.floor(0 / spacing) * spacing;
      const startY = Math.floor(0 / spacing) * spacing;

      for (let x = startX; x < width; x += spacing) {
        for (let y = startY; y < height; y += spacing) {
          // Dynamic offset/movement simulating noise
          const waveX = Math.sin(time + (x * 0.005) + (y * 0.002)) * 1.5;
          const waveY = Math.cos(time + (y * 0.005) + (x * 0.002)) * 1.5;

          const dotX = x + waveX;
          const dotY = y + waveY;

          // Distance to mouse
          const dx = mouse.x - dotX;
          const dy = mouse.y - dotY;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);

          // Calculate meteor influence
          let meteorInfluence = 0;
          const influenceRadius = 48;

          for (const meteor of meteors) {
            const ax = meteor.x;
            const ay = meteor.y;
            const bx = meteor.x - Math.cos(meteor.angle) * meteor.length;
            const by = meteor.y - Math.sin(meteor.angle) * meteor.length;

            const dist = getDistanceToSegment(dotX, dotY, ax, ay, bx, by);
            if (dist < influenceRadius) {
              const factor = 1 - dist / influenceRadius;
              
              // Boost near the head of the meteor for a bright leading pulse
              const hdx = meteor.x - dotX;
              const hdy = meteor.y - dotY;
              const distToHead = Math.sqrt(hdx * hdx + hdy * hdy);
              const headBoost = distToHead < 60 ? (1 - distToHead / 60) * 0.5 : 0;

              meteorInfluence = Math.max(meteorInfluence, (factor * 0.5 + headBoost) * meteor.alpha);
            }
          }

          let alpha = 0.05;
          let size = 1.0;

          // Calculate mouse hover factor
          let mouseFactor = 0;
          if (distToMouse < mouseAvoidRadius) {
            mouseFactor = 1 - distToMouse / mouseAvoidRadius;
          }

          if (mouseFactor > 0) {
            // Blend hover interaction and meteor influence smoothly
            const blendedMeteorInfluence = meteorInfluence * (1 - mouseFactor);
            alpha += mouseFactor * 0.25 + blendedMeteorInfluence * 0.45;
            size += mouseFactor * 1.5 + blendedMeteorInfluence * 1.0;
          } else {
            // Outside mouse radius: full meteor shower glow
            alpha += meteorInfluence * 0.45;
            size += meteorInfluence * 1.0;
          }

          ctx.fillStyle = isDarkMode 
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`;
          ctx.beginPath();
          ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      id="shader-canvas-ANIMATION_5"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-60 bg-[var(--color-background)]"
    />
  );
}
