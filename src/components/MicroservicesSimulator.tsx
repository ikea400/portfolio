import { useState, useEffect } from 'react';
import { Play, Activity, Server, Database, GitCommit, ShieldAlert, Cpu } from 'lucide-react';

interface Log {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export default function MicroservicesSimulator() {
  const [commitMsg, setCommitMsg] = useState('feat: optimize redis key index retrieval');
  const [pipelineState, setPipelineState] = useState<'idle' | 'linting' | 'testing' | 'docker' | 'deploying' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  
  // Service node statuses
  const [graphqlOnline, setGraphqlOnline] = useState(true);
  const [pythonApiOnline, setPythonApiOnline] = useState(true);
  const [redisOnline, setRedisOnline] = useState(true);
  
  const [logs, setLogs] = useState<Log[]>([
    { time: '15:10:02', msg: 'System Boot: Cluster orchestrator running.', type: 'info' },
    { time: '15:10:04', msg: 'Gateway connected at http://localhost:8080/graphql', type: 'success' },
    { time: '15:10:05', msg: 'Redis cache pool bound (127.0.0.1:6379)', type: 'info' }
  ]);

  const addLog = (msg: string, type: Log['type'] = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ time, msg, type }, ...prev].slice(0, 12));
  };

  const handlePushCommit = () => {
    if (pipelineState !== 'idle' && pipelineState !== 'completed' && pipelineState !== 'failed') return;
    
    setPipelineState('linting');
    setProgress(5);
    addLog(`[CI/CD] Commit received: "${commitMsg}". Triggering GitHub Actions runner...`, 'info');
    
    // Step 1: Linting
    setTimeout(() => {
      setPipelineState('testing');
      setProgress(30);
      addLog('[CI/CD] Step 1/4 completed: ESLint & Prettier passed.', 'success');
      
      // Step 2: Testing
      setTimeout(() => {
        setPipelineState('docker');
        setProgress(60);
        addLog('[CI/CD] Step 2/4 completed: 24 unit tests executed in Jest/GTest. (100% pass)', 'success');
        
        // Step 3: Docker Build
        setTimeout(() => {
          setPipelineState('deploying');
          setProgress(85);
          addLog('[CI/CD] Step 3/4 completed: Built python-backend:latest Docker image. Pushed to registry.', 'success');
          
          // Step 4: Deploying
          setTimeout(() => {
            setPipelineState('completed');
            setProgress(100);
            addLog('[CI/CD] Step 4/4 completed: VM container deployment successful. VM runner active.', 'success');
            setTimeout(() => setPipelineState('idle'), 3000);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Simulate requests flowing through the system every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (pipelineState !== 'idle' && pipelineState !== 'completed') return;

      const randomLatency = redisOnline ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 80) + 60;
      
      if (!graphqlOnline) {
        addLog('[ROUTER] GraphQL Gateway unreachable. Client request failed.', 'error');
      } else if (!pythonApiOnline) {
        addLog('[ROUTER] GraphQL Gateway -> Python API Node: HTTP 502 Bad Gateway.', 'error');
      } else if (!redisOnline) {
        addLog(`[ROUTER] Cache Miss -> Hitting PostgreSQL database. Response compiled in ${randomLatency}ms.`, 'warn');
      } else {
        addLog(`[ROUTER] Cache Hit -> Redis cluster served key request in ${randomLatency}ms.`, 'success');
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [graphqlOnline, pythonApiOnline, redisOnline, pipelineState]);

  // Compute live latency metrics
  let statusText = 'HEALTHY';
  let statusColor = 'text-[#2ADE80]';
  let avgLatency = '4ms';

  if (!graphqlOnline || !pythonApiOnline) {
    statusText = 'OFFLINE';
    statusColor = 'text-red-500';
    avgLatency = 'ERR';
  } else if (!redisOnline) {
    statusText = 'DEGRADED';
    statusColor = 'text-[#ffb951]';
    avgLatency = '74ms';
  }

  return (
    <div className="bg-[#1b1b1d] border border-glass-border p-6 rounded-lg space-y-6">
      <div>
        <h4 className="text-sm font-metadata-caps text-secondary uppercase tracking-widest flex items-center gap-2">
          <Cpu size={14} /> Microservices CI/CD &amp; Routing Simulator
        </h4>
        <p className="text-xs text-on-surface-variant mt-1 font-sans">
          Simulate GitHub Actions automation on push events, orchestrate node failures, and watch service failovers and DB fallback latencies live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: CI/CD Runner Panel */}
        <div className="lg:col-span-5 bg-[#131315] border border-glass-border p-4 rounded-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-metadata-caps uppercase text-secondary tracking-wider block">
              CI/CD pipeline (VM runner)
            </span>
            <div className="flex flex-col space-y-1">
              <span className="text-[9px] font-mono text-on-surface-variant">COMMIT MESSAGE</span>
              <input
                type="text"
                value={commitMsg}
                disabled={pipelineState !== 'idle' && pipelineState !== 'completed'}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="bg-[#201f21] border border-glass-border text-xs font-mono p-2 text-primary focus:outline-none focus:border-secondary rounded"
              />
            </div>
            
            <button
              onClick={handlePushCommit}
              disabled={pipelineState !== 'idle'}
              className="w-full bg-secondary text-on-secondary py-2 text-xs font-metadata-caps uppercase hover:bg-[#ffe2b3] transition-colors rounded tracking-widest flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <GitCommit size={14} /> {pipelineState === 'idle' ? 'PUSH COMMIT' : 'RUNNING PIPELINE...'}
            </button>
          </div>

          {/* Pipeline Visual Steps */}
          <div className="space-y-3 py-2 border-t border-glass-border/30">
            <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
              <span>PIPELINE PROGRESS:</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#201f21] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#ffb951] h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span>1. Lint checks (ESLint)</span>
                <span className={pipelineState === 'linting' ? 'text-[#ffb951] animate-pulse' : (progress >= 30 ? 'text-[#2ADE80]' : 'text-neutral-600')}>{pipelineState === 'linting' ? 'RUNNING' : (progress >= 30 ? 'PASSED' : 'WAITING')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. Integration Tests (GTest)</span>
                <span className={pipelineState === 'testing' ? 'text-[#ffb951] animate-pulse' : (progress >= 60 ? 'text-[#2ADE80]' : 'text-neutral-600')}>{pipelineState === 'testing' ? 'RUNNING' : (progress >= 60 ? 'PASSED' : 'WAITING')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3. Build Docker container</span>
                <span className={pipelineState === 'docker' ? 'text-[#ffb951] animate-pulse' : (progress >= 85 ? 'text-[#2ADE80]' : 'text-neutral-600')}>{pipelineState === 'docker' ? 'RUNNING' : (progress >= 85 ? 'PASSED' : 'WAITING')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>4. VM container deployment</span>
                <span className={pipelineState === 'deploying' ? 'text-[#ffb951] animate-pulse' : (progress === 100 ? 'text-[#2ADE80]' : 'text-neutral-600')}>{pipelineState === 'deploying' ? 'RUNNING' : (progress === 100 ? 'SUCCESS' : 'WAITING')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Cluster Graph & Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#131315] border border-glass-border p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-metadata-caps uppercase text-secondary tracking-wider">
                Microservices cluster topology
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColor === 'text-[#2ADE80]' ? 'bg-[#2ADE80]' : (statusColor === 'text-red-500' ? 'bg-red-500' : 'bg-amber-400')} animate-pulse`} />
                <span className={`text-[10px] font-mono font-semibold ${statusColor}`}>{statusText}</span>
              </div>
            </div>

            {/* Topology Map */}
            <div className="bg-[#1c1c1e]/60 border border-glass-border/40 rounded p-4 flex flex-col items-center justify-between min-h-[140px] space-y-4 relative">
              
              {/* Node Layout Row 1: Client Gateway */}
              <div className="flex flex-col items-center z-10">
                <div className={`px-3 py-1 rounded text-center border font-mono text-[10px] ${graphqlOnline ? 'bg-[#131315] border-glass-border text-white' : 'bg-red-950/20 border-red-500/30 text-red-500'}`}>
                  GraphQL Gateway
                  <span className="block text-[8px] opacity-60">Port 8080</span>
                </div>
              </div>

              {/* Connecting lines */}
              <div className="absolute top-[35px] bottom-[35px] w-[1px] bg-glass-border/30 z-0"></div>

              {/* Node Layout Row 2: Python API backend */}
              <div className="flex flex-col items-center z-10">
                <div className={`px-3 py-1 rounded text-center border font-mono text-[10px] ${pythonApiOnline ? 'bg-[#131315] border-glass-border text-white' : 'bg-red-950/20 border-red-500/30 text-red-500'}`}>
                  Python FastAPI Core
                  <span className="block text-[8px] opacity-60">Port 5000</span>
                </div>
              </div>

              {/* Node Layout Row 3: Cache and Database */}
              <div className="flex justify-center gap-6 w-full z-10">
                <div className={`px-3 py-1 rounded text-center border font-mono text-[10px] ${redisOnline ? 'bg-[#131315] border-glass-border text-white' : 'bg-red-950/20 border-red-500/30 text-red-500'}`}>
                  Redis Cache Pool
                  <span className="block text-[8px] opacity-60">Port 6379</span>
                </div>
                <div className="px-3 py-1 rounded text-center border border-glass-border font-mono text-[10px] bg-[#131315] text-white">
                  PostgreSQL Database
                  <span className="block text-[8px] opacity-60">Port 5432</span>
                </div>
              </div>
            </div>

            {/* Toggle Switch Controls */}
            <div className="grid grid-cols-3 gap-2 border-t border-glass-border/30 pt-3">
              <button 
                onClick={() => setGraphqlOnline(!graphqlOnline)} 
                className={`py-1.5 px-2 text-[9px] font-mono border rounded uppercase leading-none cursor-pointer text-center ${graphqlOnline ? 'border-[#2ADE80]/30 text-[#2ADE80] bg-[#2ADE80]/5 hover:bg-[#2ADE80]/15' : 'border-red-500/30 text-red-500 bg-red-950/10 hover:bg-red-950/25'}`}
              >
                GraphQL: {graphqlOnline ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setPythonApiOnline(!pythonApiOnline)} 
                className={`py-1.5 px-2 text-[9px] font-mono border rounded uppercase leading-none cursor-pointer text-center ${pythonApiOnline ? 'border-[#2ADE80]/30 text-[#2ADE80] bg-[#2ADE80]/5 hover:bg-[#2ADE80]/15' : 'border-red-500/30 text-red-500 bg-red-950/10 hover:bg-red-950/25'}`}
              >
                FastAPI: {pythonApiOnline ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setRedisOnline(!redisOnline)} 
                className={`py-1.5 px-2 text-[9px] font-mono border rounded uppercase leading-none cursor-pointer text-center ${redisOnline ? 'border-[#2ADE80]/30 text-[#2ADE80] bg-[#2ADE80]/5 hover:bg-[#2ADE80]/15' : 'border-red-500/30 text-red-500 bg-red-950/10 hover:bg-red-950/25'}`}
              >
                Redis: {redisOnline ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Node diagnostics & logs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4 bg-[#131315] border border-glass-border p-3 rounded-lg flex flex-col justify-center text-center font-mono">
              <span className="text-[8px] text-on-surface-variant uppercase">Average Latency</span>
              <span className={`text-xl font-bold mt-1 ${graphqlOnline && pythonApiOnline ? 'text-cyan-400' : 'text-red-500'}`}>{avgLatency}</span>
            </div>

            <div className="md:col-span-8 bg-[#131315] border border-glass-border p-3 rounded-lg flex flex-col h-36">
              <span className="text-[8px] font-metadata-caps text-on-surface-variant tracking-wider uppercase mb-1.5 flex items-center gap-1">
                <Activity size={10} className="text-[#ffb951] animate-pulse" /> CLUSTER NET LOGS
              </span>
              <div className="bg-[#0e0e10] p-2 text-[8px] font-mono text-cyan-400/80 flex-1 overflow-y-auto space-y-1 rounded">
                {logs.map((l, i) => {
                  let c = 'text-cyan-400/80';
                  if (l.type === 'error') c = 'text-red-400';
                  if (l.type === 'warn') c = 'text-[#ffb951]';
                  if (l.type === 'success') c = 'text-[#2ADE80] font-semibold';
                  return (
                    <div key={i} className="leading-snug">
                      [{l.time}] <span className={c}>{l.msg}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
