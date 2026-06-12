import { useState } from 'react';
import { Swords, RefreshCw, Database, Terminal, ShieldAlert } from 'lucide-react';

interface Territory {
  id: string;
  name: string;
  owner: 'player' | 'cpu';
  troops: number;
  color: string;
  x: number; // for SVG position
  y: number;
}

interface ApiLog {
  request: string;
  response: string;
  sql: string;
}

export default function RiskQuestSimulator() {
  const [territories, setTerritories] = useState<Territory[]>([
    { id: 'ontario', name: 'Ontario', owner: 'player', troops: 6, color: '#3b82f6', x: 80, y: 70 },
    { id: 'quebec', name: 'Quebec', owner: 'player', troops: 5, color: '#3b82f6', x: 220, y: 50 },
    { id: 'new_york', name: 'New York', owner: 'cpu', troops: 3, color: '#ef4444', x: 180, y: 160 },
    { id: 'boston', name: 'Boston', owner: 'cpu', troops: 4, color: '#ef4444', x: 300, y: 130 },
  ]);

  const [selectedAtk, setSelectedAtk] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [isFighting, setIsFighting] = useState(false);
  const [atkRolls, setAtkRolls] = useState<number[]>([]);
  const [defRolls, setDefRolls] = useState<number[]>([]);
  const [battleMessage, setBattleMessage] = useState('Select an Attacking territory (Blue) and an adjacent Defending territory (Red) to initiate combat.');

  const [apiLog, setApiLog] = useState<ApiLog | null>(null);

  // Check adjacency
  const isAdjacent = (id1: string, id2: string) => {
    const adjMap: Record<string, string[]> = {
      ontario: ['quebec', 'new_york'],
      quebec: ['ontario', 'new_york', 'boston'],
      new_york: ['ontario', 'quebec', 'boston'],
      boston: ['quebec', 'new_york']
    };
    return adjMap[id1]?.includes(id2) || false;
  };

  const handleTerritoryClick = (id: string) => {
    const clicked = territories.find(t => t.id === id);
    if (!clicked) return;

    if (clicked.owner === 'player') {
      setSelectedAtk(id);
      setSelectedDef(null);
      setBattleMessage(`Selected ${clicked.name} as attacker. Select an adjacent CPU territory to target.`);
    } else {
      if (!selectedAtk) {
        setBattleMessage('Please select your own territory (Blue) first to attack from.');
        return;
      }
      if (!isAdjacent(selectedAtk, id)) {
        setBattleMessage(`Cannot attack ${clicked.name} from ${territories.find(t => t.id === selectedAtk)?.name}. They are not adjacent!`);
        return;
      }
      setSelectedDef(id);
      setBattleMessage(`Ready to strike! ${territories.find(t => t.id === selectedAtk)?.name} attacking ${clicked.name}.`);
    }
  };

  const resolveBattle = () => {
    if (!selectedAtk || !selectedDef) return;
    
    const attacker = territories.find(t => t.id === selectedAtk)!;
    const defender = territories.find(t => t.id === selectedDef)!;

    if (attacker.troops <= 1) {
      setBattleMessage('Attacking territory must have at least 2 troops to attack.');
      return;
    }

    setIsFighting(true);
    setBattleMessage('Rolling dice and transmitting REST payloads...');

    setTimeout(() => {
      // Risk Battle Dice Rules:
      // Attacker rolls up to 3 dice (capped by troops - 1)
      const atkDiceCount = Math.min(3, attacker.troops - 1);
      // Defender rolls up to 2 dice (capped by troops)
      const defDiceCount = Math.min(2, defender.troops);

      const attackerRolls = Array.from({ length: atkDiceCount }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
      const defenderRolls = Array.from({ length: defDiceCount }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

      setAtkRolls(attackerRolls);
      setDefRolls(defenderRolls);

      // Compare highest dice
      let atkLosses = 0;
      let defLosses = 0;

      const compareCount = Math.min(atkDiceCount, defDiceCount);
      for (let i = 0; i < compareCount; i++) {
        if (attackerRolls[i] > defenderRolls[i]) {
          defLosses++;
        } else {
          atkLosses++;
        }
      }

      // Update values
      let nextAtkTroops = attacker.troops - atkLosses;
      let nextDefTroops = defender.troops - defLosses;
      let conquestOccurred = false;

      // Handle conquest
      if (nextDefTroops <= 0) {
        conquestOccurred = true;
        nextDefTroops = atkDiceCount - atkLosses; // Move remaining attack force in
        nextAtkTroops -= nextDefTroops;
      }

      setTerritories(prev => prev.map(t => {
        if (t.id === selectedAtk) return { ...t, troops: nextAtkTroops };
        if (t.id === selectedDef) {
          return {
            ...t,
            troops: nextDefTroops,
            owner: conquestOccurred ? 'player' : 'cpu',
            color: conquestOccurred ? '#3b82f6' : '#ef4444'
          };
        }
        return t;
      }));

      // Generate API / DB Mock Payload Logs
      const requestPayload = {
        attacker_id: selectedAtk,
        defender_id: selectedDef,
        attacker_dice_count: atkDiceCount,
        defender_dice_count: defDiceCount
      };

      const responsePayload = {
        status: 'success',
        battle_resolved: true,
        rolls: { attacker: attackerRolls, defender: defenderRolls },
        casualties: { attacker: atkLosses, defender: defLosses },
        conquest: conquestOccurred
      };

      const sqlLogs = `START TRANSACTION;
-- Deduct casualties
UPDATE territories SET troops = ${nextAtkTroops} WHERE id = '${selectedAtk}';
UPDATE territories SET troops = ${nextDefTroops}${conquestOccurred ? ", owner = 'player'" : ""} WHERE id = '${selectedDef}';
-- Write match record
INSERT INTO battle_history (attacker, defender, result) 
VALUES ('${selectedAtk}', '${selectedDef}', 'Attacker rolls: [${attackerRolls.join(',')}], Defender rolls: [${defenderRolls.join(',')}]');
COMMIT;`;

      setApiLog({
        request: `POST /api/v1/game/battle HTTP/1.1
Host: api.riskquest.ets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

${JSON.stringify(requestPayload, null, 2)}`,
        response: `HTTP/1.1 200 OK
Content-Type: application/json

${JSON.stringify(responsePayload, null, 2)}`,
        sql: sqlLogs
      });

      if (conquestOccurred) {
        setBattleMessage(`Conquest! You captured ${defender.name}! Attacker lost ${atkLosses} troops, Defender lost ${defLosses}.`);
        setSelectedAtk(null);
        setSelectedDef(null);
      } else {
        setBattleMessage(`Skirmish over: Attacker lost ${atkLosses} troops, Defender lost ${defLosses}.`);
      }
      setIsFighting(false);
    }, 1200);
  };

  const resetMap = () => {
    setTerritories([
      { id: 'ontario', name: 'Ontario', owner: 'player', troops: 6, color: '#3b82f6', x: 80, y: 70 },
      { id: 'quebec', name: 'Quebec', owner: 'player', troops: 5, color: '#3b82f6', x: 220, y: 50 },
      { id: 'new_york', name: 'New York', owner: 'cpu', troops: 3, color: '#ef4444', x: 180, y: 160 },
      { id: 'boston', name: 'Boston', owner: 'cpu', troops: 4, color: '#ef4444', x: 300, y: 130 },
    ]);
    setSelectedAtk(null);
    setSelectedDef(null);
    setAtkRolls([]);
    setDefRolls([]);
    setApiLog(null);
    setBattleMessage('Select an Attacking territory (Blue) and an adjacent Defending territory (Red) to initiate combat.');
  };

  return (
    <div className="bg-[#1b1b1d] border border-glass-border p-6 rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-metadata-caps text-secondary uppercase tracking-widest flex items-center gap-2">
            <Swords size={14} /> Decoupled REST Game Engine Simulator
          </h4>
          <p className="text-xs text-on-surface-variant mt-1 font-sans">
            Play a mini-game of Risk. Attack enemy provinces to trigger dice rules, update client states, and check live JSON REST endpoints.
          </p>
        </div>

        <button
          onClick={resetMap}
          className="border border-glass-border text-[10px] font-metadata-caps text-on-surface-variant hover:text-primary hover:border-primary px-3 py-1.5 rounded flex items-center gap-1 transition-colors uppercase cursor-pointer"
        >
          <RefreshCw size={10} /> Reset Map
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Territory map graphic */}
        <div className="lg:col-span-6 bg-[#131315] border border-glass-border p-4 rounded-lg flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-metadata-caps uppercase text-secondary tracking-wider block">
            Interactive Province Map
          </span>

          <div className="relative border border-glass-border/40 rounded bg-[#1c1c1e]/40 p-4 h-60 overflow-hidden flex items-center justify-center">
            {/* SVG Vector Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Ontario - Quebec */}
              <line x1="120" y1="85" x2="260" y2="65" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
              {/* Ontario - NY */}
              <line x1="120" y1="85" x2="220" y2="175" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
              {/* Quebec - NY */}
              <line x1="260" y1="65" x2="220" y2="175" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
              {/* Quebec - Boston */}
              <line x1="260" y1="65" x2="340" y2="145" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
              {/* Boston - NY */}
              <line x1="340" y1="145" x2="220" y2="175" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Province Buttons */}
            {territories.map((t) => {
              const isSelectedAtk = selectedAtk === t.id;
              const isSelectedDef = selectedDef === t.id;
              
              let styleBorder = 'border-glass-border';
              if (isSelectedAtk) styleBorder = 'border-secondary shadow-lg shadow-amber-500/20 scale-105 ring-1 ring-secondary';
              if (isSelectedDef) styleBorder = 'border-[#ef4444] shadow-lg shadow-red-500/20 scale-105 ring-1 ring-red-500';

              return (
                <button
                  key={t.id}
                  onClick={() => handleTerritoryClick(t.id)}
                  style={{ left: `${t.x}px`, top: `${t.y}px`, position: 'absolute' }}
                  className={`px-3 py-2 border rounded font-mono text-[10px] text-center select-none cursor-pointer z-10 transition-all duration-200 bg-[#131315] hover:scale-105 ${styleBorder}`}
                >
                  <span className="block font-bold" style={{ color: t.color }}>{t.name}</span>
                  <span className="block text-[11px] text-primary mt-1 font-semibold">{t.troops} Troops</span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#1b1b1d] p-3 rounded border border-glass-border/30">
            <span className="text-[9px] text-[#ffb951] font-mono block uppercase">Tactical updates</span>
            <p className="text-[10px] text-on-surface-variant font-sans leading-relaxed mt-1">{battleMessage}</p>
          </div>
        </div>

        {/* Attack Solver & Dice Rolls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#131315] border border-glass-border p-4 rounded-lg space-y-4 flex flex-col justify-between">
            <span className="text-[10px] font-metadata-caps uppercase text-secondary tracking-wider block">
              Dice Battle solver
            </span>

            {/* Battle controls */}
            <div className="flex gap-4 items-center justify-between">
              <div className="text-center font-mono">
                <span className="text-[8px] text-neutral-500 block uppercase">Attacker dice</span>
                <div className="flex gap-1.5 mt-1">
                  {atkRolls.length > 0 ? (
                    atkRolls.map((r, idx) => (
                      <span key={idx} className="w-6 h-6 flex items-center justify-center bg-secondary text-black font-bold text-xs rounded border border-secondary shadow">
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-neutral-600 block italic leading-6">Waiting...</span>
                  )}
                </div>
              </div>

              <button
                onClick={resolveBattle}
                disabled={isFighting || !selectedAtk || !selectedDef}
                className="bg-secondary text-on-secondary px-5 py-2 text-xs font-metadata-caps uppercase hover:bg-[#ffe2b3] transition-colors rounded tracking-widest flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Swords size={12} /> {isFighting ? 'ROLLING...' : 'BATTLE / ATTACK'}
              </button>

              <div className="text-center font-mono">
                <span className="text-[8px] text-neutral-500 block uppercase">Defender dice</span>
                <div className="flex gap-1.5 mt-1">
                  {defRolls.length > 0 ? (
                    defRolls.map((r, idx) => (
                      <span key={idx} className="w-6 h-6 flex items-center justify-center bg-red-500 text-white font-bold text-xs rounded border border-red-500 shadow">
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-neutral-600 block italic leading-6">Waiting...</span>
                  )}
                </div>
              </div>
            </div>

            {/* REST Client Log Visualizer */}
            {apiLog && (
              <div className="border-t border-glass-border/30 pt-3 space-y-3 font-mono text-[9px]">
                <div className="grid grid-cols-2 gap-2">
                  {/* JSON Payload */}
                  <div className="flex flex-col h-36 border border-glass-border/40 rounded bg-black/40 overflow-hidden">
                    <span className="text-neutral-500 text-[8px] bg-black/80 px-2 py-1 flex items-center gap-1">
                      <Terminal size={10} className="text-secondary" /> CLIENT REST HTTP HEADER
                    </span>
                    <pre className="p-2 text-cyan-400/90 overflow-y-auto leading-relaxed flex-1">
                      {apiLog.request}
                    </pre>
                  </div>

                  {/* PHP Response */}
                  <div className="flex flex-col h-36 border border-glass-border/40 rounded bg-black/40 overflow-hidden">
                    <span className="text-neutral-500 text-[8px] bg-black/80 px-2 py-1 flex items-center gap-1">
                      <Terminal size={10} className="text-[#2ADE80]" /> BACKEND API RESPONSE
                    </span>
                    <pre className="p-2 text-[#2ADE80]/90 overflow-y-auto leading-relaxed flex-1">
                      {apiLog.response}
                    </pre>
                  </div>
                </div>

                {/* SQL Queries */}
                <div className="flex flex-col h-20 border border-glass-border/40 rounded bg-black/40 overflow-hidden">
                  <span className="text-neutral-500 text-[8px] bg-black/80 px-2 py-0.5 flex items-center gap-1">
                    <Database size={10} className="text-cyan-400" /> SQL DB UPDATE TRANSACTION
                  </span>
                  <pre className="p-2 text-yellow-300/80 overflow-y-auto leading-relaxed flex-1">
                    {apiLog.sql}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
