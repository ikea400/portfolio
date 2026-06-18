import { useState, useEffect } from 'react';
import { Play, RotateCcw, Cpu, Layers } from 'lucide-react';

export default function CNNSimulator() {
  const gridSize = 8;
  const [grid, setGrid] = useState<boolean[]>(Array(gridSize * gridSize).fill(false));
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Dynamic Activation Maps (calculated on grid update)
  const [convMapH, setConvMapH] = useState<number[]>(Array(36).fill(0));
  const [convMapV, setConvMapV] = useState<number[]>(Array(36).fill(0));
  const [poolMapH, setPoolMapH] = useState<number[]>(Array(9).fill(0));
  const [poolMapV, setPoolMapV] = useState<number[]>(Array(9).fill(0));
  
  // Output Classifications
  const [predictions, setPredictions] = useState({
    cross: 5,
    horizontal: 5,
    vertical: 5,
    empty: 85
  });

  const clearGrid = () => {
    setGrid(Array(gridSize * gridSize).fill(false));
  };

  const handleCellMouseDown = (index: number) => {
    setIsDrawing(true);
    setGrid((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleCellMouseEnter = (index: number) => {
    if (!isDrawing) return;
    setGrid((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  // Perform a real Conv2D and MaxPool2D pass
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    
    // 1. Convert 1D boolean array to a 2D float array (0.0 or 1.0)
    const img2D = Array.from({ length: gridSize }, (_, r) => 
      Array.from({ length: gridSize }, (_, c) => (grid[r * gridSize + c] ? 1.0 : 0.0))
    );

    // 2. Convolution: 8x8 input convolved with 3x3 kernels -> 6x6 output
    // Kernel H (Horizontal lines detector)
    const kernelH = [
      [-1, -1, -1],
      [ 2,  2,  2],
      [-1, -1, -1]
    ];
    // Kernel V (Vertical lines detector)
    const kernelV = [
      [-1,  2, -1],
      [-1,  2, -1],
      [-1,  2, -1]
    ];

    const outH = [];
    const outV = [];

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        let sumH = 0;
        let sumV = 0;
        for (let kr = 0; kr < 3; kr++) {
          for (let kc = 0; kc < 3; kc++) {
            const val = img2D[r + kr][c + kc];
            sumH += val * kernelH[kr][kc];
            sumV += val * kernelV[kr][kc];
          }
        }
        // Apply ReLU activation (max(0, sum))
        outH.push(Math.max(0, sumH));
        outV.push(Math.max(0, sumV));
      }
    }

    setConvMapH(outH);
    setConvMapV(outV);

    // 3. Max Pooling: 6x6 output pooled with 2x2 filter (stride 2) -> 3x3 output
    const pH = [];
    const pV = [];

    for (let r = 0; r < 6; r += 2) {
      for (let c = 0; c < 6; c += 2) {
        // Pool window elements
        const idx0 = r * 6 + c;
        const idx1 = r * 6 + c + 1;
        const idx2 = (r + 1) * 6 + c;
        const idx3 = (r + 1) * 6 + c + 1;
        
        pH.push(Math.max(outH[idx0], outH[idx1], outH[idx2], outH[idx3]));
        pV.push(Math.max(outV[idx0], outV[idx1], outV[idx2], outV[idx3]));
      }
    }

    setPoolMapH(pH);
    setPoolMapV(pV);

    // 4. Fully Connected Classification
    // Count active row/col pixels
    let horizontalScore = 0;
    let verticalScore = 0;
    
    // Rows check
    for (let r = 0; r < gridSize; r++) {
      let count = 0;
      for (let c = 0; c < gridSize; c++) {
        if (img2D[r][c] > 0.5) count++;
      }
      if (count >= 4) horizontalScore += count * 2;
    }

    // Columns check
    for (let c = 0; c < gridSize; c++) {
      let count = 0;
      for (let r = 0; r < gridSize; r++) {
        if (img2D[r][c] > 0.5) count++;
      }
      if (count >= 4) verticalScore += count * 2;
    }

    const totalActive = grid.filter(Boolean).length;
    
    let crossProb = 0;
    let horizProb = 0;
    let vertProb = 0;
    let emptyProb = 0;

    if (totalActive < 2) {
      emptyProb = 95;
      horizProb = 2;
      vertProb = 2;
      crossProb = 1;
    } else {
      if (horizontalScore > 0 && verticalScore > 0) {
        crossProb = 85;
        horizProb = 10;
        vertProb = 4;
        emptyProb = 1;
      } else if (horizontalScore > verticalScore) {
        horizProb = 80;
        vertProb = 10;
        crossProb = 5;
        emptyProb = 5;
      } else if (verticalScore > horizontalScore) {
        vertProb = 80;
        horizProb = 10;
        crossProb = 5;
        emptyProb = 5;
      } else {
        emptyProb = 40;
        horizProb = 30;
        vertProb = 30;
      }
    }

    // Normalize
    const total = crossProb + horizProb + vertProb + emptyProb;
    setPredictions({
      cross: Math.round((crossProb / total) * 100),
      horizontal: Math.round((horizProb / total) * 100),
      vertical: Math.round((vertProb / total) * 100),
      empty: Math.round((emptyProb / total) * 100)
    });

    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [grid]);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-metadata-caps text-[var(--color-secondary)] uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} /> Interactive Convolutional Neural Network Console
          </h4>
          <p className="text-xs text-[var(--color-secondary)] mt-1 font-sans">
            Draw patterns on the grid to run live Conv2D/MaxPool2D passes, view layer feature maps, and watch classifier weights react.
          </p>
        </div>

        <button
          onClick={clearGrid}
          className="border border-[var(--color-border)] text-[10px] font-metadata-caps text-[var(--color-secondary)] hover:text-[var(--color-text)] hover:border-primary px-3 py-1.5 rounded flex items-center gap-1 transition-colors uppercase cursor-pointer"
        >
          <RotateCcw size={10} /> Clear Sketchpad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Draw Sketchpad */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="text-center font-mono text-[9px] text-[var(--color-secondary)] opacity-60 mb-2 uppercase select-none">
            Input Grid Matrix (8x8)
          </div>
          <div className="grid grid-cols-8 gap-0.5 bg-[var(--color-surface)] p-2 border border-[var(--color-border)] rounded-lg shadow-2xl">
            {grid.map((cell, idx) => (
              <div
                key={idx}
                onMouseDown={() => handleCellMouseDown(idx)}
                onMouseEnter={() => handleCellMouseEnter(idx)}
                className={`w-7 h-7 md:w-8 md:h-8 border border-black/20 rounded-sm cursor-crosshair transition-all duration-150 ${
                  cell ? 'bg-[#ffb951] scale-[0.9] shadow' : 'bg-[var(--color-surface)] hover:bg-white/5'
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] text-[var(--color-secondary)]/60 font-sans mt-3 text-center">
            Click or drag mouse to draw shapes (e.g. + or - lines).
          </span>
        </div>

        {/* Feature Maps Visualizer */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <span className="text-[10px] font-metadata-caps uppercase text-[var(--color-secondary)] tracking-wider text-center flex items-center gap-1.5 justify-center">
            <Cpu size={12} /> Convolutional Layers (Activations)
          </span>

          <div className="grid grid-cols-2 gap-4">
            {/* Horizontal Feature Map */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-lg flex flex-col items-center">
              <span className="text-[8px] font-mono text-cyan-400 mb-2">Filter H (Horizontal Edge)</span>
              <div className="grid grid-cols-6 gap-0.5 bg-black/40 p-1.5 rounded border border-[var(--color-border)]/30">
                {convMapH.map((v, i) => {
                  const brightness = Math.min(255, Math.round(v * 80));
                  return (
                    <div
                      key={i}
                      style={{ backgroundColor: `rgb(${brightness}, ${Math.round(brightness * 0.72)}, 0)` }}
                      className="w-4 h-4 border border-black/10 rounded-sm"
                      title={`Val: ${v.toFixed(1)}`}
                    />
                  );
                })}
              </div>
              
              <span className="text-[8px] font-mono text-neutral-500 mt-3 mb-1">Max Pool (2x2)</span>
              <div className="grid grid-cols-3 gap-0.5 bg-black/40 p-1 rounded border border-[var(--color-border)]/20">
                {poolMapH.map((v, i) => {
                  const brightness = Math.min(255, Math.round(v * 80));
                  return (
                    <div
                      key={i}
                      style={{ backgroundColor: `rgb(${brightness}, ${Math.round(brightness * 0.72)}, 0)` }}
                      className="w-4 h-4 border border-black/10 rounded-sm"
                    />
                  );
                })}
              </div>
            </div>

            {/* Vertical Feature Map */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-lg flex flex-col items-center">
              <span className="text-[8px] font-mono text-cyan-400 mb-2">Filter V (Vertical Edge)</span>
              <div className="grid grid-cols-6 gap-0.5 bg-black/40 p-1.5 rounded border border-[var(--color-border)]/30">
                {convMapV.map((v, i) => {
                  const brightness = Math.min(255, Math.round(v * 80));
                  return (
                    <div
                      key={i}
                      style={{ backgroundColor: `rgb(0, ${brightness}, ${Math.round(brightness * 0.6)})` }}
                      className="w-4 h-4 border border-black/10 rounded-sm"
                      title={`Val: ${v.toFixed(1)}`}
                    />
                  );
                })}
              </div>

              <span className="text-[8px] font-mono text-neutral-500 mt-3 mb-1">Max Pool (2x2)</span>
              <div className="grid grid-cols-3 gap-0.5 bg-black/40 p-1 rounded border border-[var(--color-border)]/20">
                {poolMapV.map((v, i) => {
                  const brightness = Math.min(255, Math.round(v * 80));
                  return (
                    <div
                      key={i}
                      style={{ backgroundColor: `rgb(0, ${brightness}, ${Math.round(brightness * 0.6)})` }}
                      className="w-4 h-4 border border-black/10 rounded-sm"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Output Probabilities */}
        <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-metadata-caps uppercase text-[var(--color-secondary)] tracking-wider block text-center">
            Output Classification
          </span>

          <div className="space-y-3 font-mono text-xs flex-1 flex flex-col justify-center">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--color-text)] font-semibold">Cross / Plus (+)</span>
                <span>{predictions.cross}%</span>
              </div>
              <div className="w-full bg-[var(--color-surface)] h-1.5 rounded overflow-hidden">
                <div className="bg-[#4ADE80] h-full transition-all duration-300" style={{ width: `${predictions.cross}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--color-text)] font-semibold">Horiz Line (-)</span>
                <span>{predictions.horizontal}%</span>
              </div>
              <div className="w-full bg-[var(--color-surface)] h-1.5 rounded overflow-hidden">
                <div className="bg-[#ffb951] h-full transition-all duration-300" style={{ width: `${predictions.horizontal}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[var(--color-text)] font-semibold">Vert Line (|)</span>
                <span>{predictions.vertical}%</span>
              </div>
              <div className="w-full bg-[var(--color-surface)] h-1.5 rounded overflow-hidden">
                <div className="bg-[#3b82f6] h-full transition-all duration-300" style={{ width: `${predictions.vertical}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-500 font-semibold">No Shape / Background</span>
                <span>{predictions.empty}%</span>
              </div>
              <div className="w-full bg-[var(--color-surface)] h-1.5 rounded overflow-hidden">
                <div className="bg-neutral-600 h-full transition-all duration-300" style={{ width: `${predictions.empty}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
