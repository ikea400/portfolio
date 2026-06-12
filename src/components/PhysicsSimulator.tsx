import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Activity, HelpCircle } from 'lucide-react';

interface PhysicalBody {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isDragging: boolean;
  type: 'circle' | 'box';
  width?: number; // for box
  height?: number; // for box
}

export default function PhysicsSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gravity, setGravity] = useState(9.8);
  const [restitution, setRestitution] = useState(0.7); // Bounciness
  const [bodies, setBodies] = useState<PhysicalBody[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [collisionCount, setCollisionCount] = useState(0);
  const [kineticEnergy, setKineticEnergy] = useState(0);

  const dragTargetRef = useRef<number | null>(null);
  const bodiesRef = useRef<PhysicalBody[]>([]);
  const totalCollisionsRef = useRef(0);

  // Colors matching the portfolio theme
  const colors = ['#ffb951', '#4ADE80', '#3b82f6', '#ec4899', '#a855f7'];

  const spawnBody = (x: number, y: number, type: 'circle' | 'box' = 'circle') => {
    const radius = 12 + Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newBody: PhysicalBody = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 4,
      radius,
      color,
      isDragging: false,
      type,
      width: type === 'box' ? radius * 2 : undefined,
      height: type === 'box' ? radius * 2 : undefined,
    };
    
    bodiesRef.current = [...bodiesRef.current, newBody];
    setBodies([...bodiesRef.current]);
  };

  const clearSandbox = () => {
    bodiesRef.current = [];
    setBodies([]);
    totalCollisionsRef.current = 0;
    setCollisionCount(0);
  };

  // Add initial random bodies
  useEffect(() => {
    // Initial spawn
    for (let i = 0; i < 5; i++) {
      spawnBody(100 + i * 50, 60 + Math.random() * 40, i % 2 === 0 ? 'circle' : 'box');
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 500;
    let height = canvas.height = 240;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = 240;
    };
    window.addEventListener('resize', handleResize);

    // Mouse events inside canvas
    const getMouseCoords = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const m = getMouseCoords(e);
      // Find body clicked
      for (const b of bodiesRef.current) {
        let isInside = false;
        if (b.type === 'circle') {
          const dx = m.x - b.x;
          const dy = m.y - b.y;
          isInside = dx * dx + dy * dy < b.radius * b.radius;
        } else {
          const halfW = (b.width || 20) / 2;
          const halfH = (b.height || 20) / 2;
          isInside = m.x >= b.x - halfW && m.x <= b.x + halfW &&
                     m.y >= b.y - halfH && m.y <= b.y + halfH;
        }

        if (isInside) {
          b.isDragging = true;
          b.vx = 0;
          b.vy = 0;
          dragTargetRef.current = b.id;
          break;
        }
      }

      // If clicked empty space, spawn a body
      if (dragTargetRef.current === null) {
        spawnBody(m.x, m.y, Math.random() > 0.4 ? 'circle' : 'box');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragTargetRef.current === null) return;
      const m = getMouseCoords(e);
      bodiesRef.current = bodiesRef.current.map((b) => {
        if (b.id === dragTargetRef.current) {
          // Compute velocity based on drag position displacement
          b.vx = (m.x - b.x) * 0.4;
          b.vy = (m.y - b.y) * 0.4;
          b.x = m.x;
          b.y = m.y;
        }
        return b;
      });
    };

    const handleMouseUp = () => {
      if (dragTargetRef.current !== null) {
        const target = bodiesRef.current.find(b => b.id === dragTargetRef.current);
        if (target) {
          target.isDragging = false;
        }
        dragTargetRef.current = null;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Dynamic Physics Loop
    const updatePhysics = () => {
      ctx.clearRect(0, 0, width, height);

      // Floor line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - 10);
      ctx.lineTo(width, height - 10);
      ctx.stroke();

      const gravityScale = gravity * 0.15;
      const list = bodiesRef.current;

      // 1. Update positions & handle wall collisions
      for (const b of list) {
        if (!b.isDragging) {
          // Apply gravity
          b.vy += gravityScale;
          
          // Apply position integration
          b.x += b.vx;
          b.y += b.vy;

          // Air resistance / friction damping
          b.vx *= 0.99;
          b.vy *= 0.99;

          // Boundary checks
          const size = b.type === 'circle' ? b.radius : (b.width || 20) / 2;
          
          // Bottom boundary
          if (b.y > height - 10 - size) {
            b.y = height - 10 - size;
            b.vy = -b.vy * restitution;
            b.vx *= 0.95; // Ground friction
          }
          // Top boundary
          if (b.y < size) {
            b.y = size;
            b.vy = -b.vy * restitution;
          }
          // Left boundary
          if (b.x < size) {
            b.x = size;
            b.vx = -b.vx * restitution;
          }
          // Right boundary
          if (b.x > width - size) {
            b.x = width - size;
            b.vx = -b.vx * restitution;
          }
        }
      }

      // 2. Resolve Collisions (Elastic rigid impulses)
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const b1 = list[i];
          const b2 = list[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const r1 = b1.type === 'circle' ? b1.radius : (b1.width || 20) / 2;
          const r2 = b2.type === 'circle' ? b2.radius : (b2.width || 20) / 2;
          const minDist = r1 + r2;

          if (dist < minDist) {
            totalCollisionsRef.current++;
            
            // Collision normal vector
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlapping bodies to avoid clipping/sticking
            const overlap = minDist - dist;
            if (!b1.isDragging) {
              b1.x -= nx * overlap * 0.5;
              b1.y -= ny * overlap * 0.5;
            }
            if (!b2.isDragging) {
              b2.x += nx * overlap * 0.5;
              b2.y += ny * overlap * 0.5;
            }

            // Relative velocities
            const rvx = b2.vx - b1.vx;
            const rvy = b2.vy - b1.vy;

            // Relative velocity along normal
            const velAlongNormal = rvx * nx + rvy * ny;

            // Only resolve if velocities are approaching
            if (velAlongNormal < 0) {
              // Elastic impulse scalar
              const impulse = -(1 + restitution) * velAlongNormal;
              
              // Apply equal but opposite forces based on basic mass approximation (r^2)
              const mass1 = r1 * r1;
              const mass2 = r2 * r2;
              const totalMass = mass1 + mass2;

              const impulse1 = (impulse * mass2) / totalMass;
              const impulse2 = (impulse * mass1) / totalMass;

              if (!b1.isDragging) {
                b1.vx -= nx * impulse1;
                b1.vy -= ny * impulse1;
              }
              if (!b2.isDragging) {
                b2.vx += nx * impulse2;
                b2.vy += ny * impulse2;
              }
            }
          }
        }
      }

      // 3. Draw Bodies
      for (const b of list) {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.isDragging ? 12 : 3;

        if (b.type === 'circle') {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const w = b.width || 20;
          const h = b.height || 20;
          ctx.fillRect(b.x - w / 2, b.y - h / 2, w, h);
        }

        // Reflection highlight overlay for shiny look
        ctx.shadowBlur = 0; // reset
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        if (b.type === 'circle') {
          ctx.beginPath();
          ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Calculate stats
      let totalEnergy = 0;
      for (const b of list) {
        const mass = b.radius * b.radius;
        const velSq = b.vx * b.vx + b.vy * b.vy;
        totalEnergy += 0.5 * mass * velSq;
      }
      
      setKineticEnergy(Math.round(totalEnergy / 100));
      setActiveCount(list.length);
      setCollisionCount(totalCollisionsRef.current);

      animationId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [gravity, restitution]);

  return (
    <div className="bg-[#1b1b1d] border border-glass-border p-6 rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-metadata-caps text-secondary uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} /> Modular 2D Rigid Body Physics Sandbox
          </h4>
          <p className="text-xs text-on-surface-variant mt-1 font-sans">
            Spawns physical circles and boxes. Click empty canvas fields to insert bodies, drag/toss them with constraints, or adjust physical parameters.
          </p>
        </div>

        <button
          onClick={clearSandbox}
          className="border border-glass-border text-[10px] font-metadata-caps text-on-surface-variant hover:text-primary hover:border-primary px-3 py-1.5 rounded flex items-center gap-1 transition-colors uppercase cursor-pointer"
        >
          <RotateCcw size={10} /> Reset Canvas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Render Workspace */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="text-center font-mono text-[9px] text-on-surface-variant opacity-60 mb-2 uppercase select-none flex items-center justify-center gap-1">
            2D Physics Vector Solver (HTML5 Canvas) <HelpCircle size={10} title="Click inside canvas to spawn blocks" />
          </div>

          <canvas
            ref={canvasRef}
            className="w-full bg-[#131315] border border-glass-border rounded-lg shadow-inner cursor-pointer"
          />
        </div>

        {/* Physics Solver Controls and Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-glass-border bg-[#131315] p-5 rounded-md space-y-4">
            <span className="text-[10px] font-metadata-caps text-secondary uppercase tracking-wider block">
              Vector Math Integrator Variables
            </span>

            {/* Sliders */}
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Gravity (Acceleration):</span>
                  <span>{gravity.toFixed(1)} m/s²</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full accent-secondary bg-glass-border"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Coefficient of Restitution (Elasticity):</span>
                  <span>{(restitution * 100).toFixed(0)}% Bouncy</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={restitution}
                  onChange={(e) => setRestitution(parseFloat(e.target.value))}
                  className="w-full accent-secondary bg-glass-border"
                />
              </div>
            </div>

            {/* Readout Metrics */}
            <div className="pt-3 border-t border-glass-border/30 grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
              <div className="bg-[#1b1b1d] p-2 rounded border border-glass-border/40">
                <span className="text-on-surface-variant block text-[8px] uppercase">Active Bodies</span>
                <span className="text-primary font-bold text-xs mt-1 block">{activeCount}</span>
              </div>
              <div className="bg-[#1b1b1d] p-2 rounded border border-glass-border/40">
                <span className="text-on-surface-variant block text-[8px] uppercase">Total Collisions</span>
                <span className="text-[#2ADE80] font-bold text-xs mt-1 block">{collisionCount}</span>
              </div>
              <div className="bg-[#1b1b1d] p-2 rounded border border-glass-border/40">
                <span className="text-on-surface-variant block text-[8px] uppercase">Kinetic Energy</span>
                <span className="text-cyan-400 font-bold text-xs mt-1 block">{kineticEnergy}J</span>
              </div>
            </div>
          </div>

          {/* ODE Integrator C++20 snippet display */}
          <div className="bg-[#0e0e10] border border-glass-border p-4 rounded font-mono text-[9px] text-cyan-400/80 leading-relaxed overflow-x-auto">
            <span className="text-white font-semibold">EulerIntegrator.cpp snippet:</span>
            <pre className="mt-1">
{`void EulerIntegrator::integrate(std::vector<Body*>& bodies, float dt) {
    for (auto* body : bodies) {
        if (body->isStatic()) continue;
        body->velocity += body->acceleration * dt;
        body->position += body->velocity * dt;
        body->velocity *= (1.0f - friction * dt);
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
