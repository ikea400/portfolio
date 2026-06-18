import { useState } from 'react';
import { Shield, Key, Cpu, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ZeroKnowledgeSimulator() {
  const [password, setPassword] = useState('SuperSecurePa55!');
  const [step, setStep] = useState(0);
  const [isHashing, setIsHashing] = useState(false);
  const [argonHash, setArgonHash] = useState('');
  const [blindedHex, setBlindedHex] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [revealVaultIdx, setRevealVaultIdx] = useState<number | null>(null);
  
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'SYSTEM INIT: Zero-Knowledge daemon is listening.',
    'OPAQUE engine loaded (Windows NCrypt + OpenSSL 3.0).'
  ]);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [msg, ...prev].slice(0, 10));
  };

  const runArgonHash = () => {
    setIsHashing(true);
    addLog('[CLIENT] Initiating local Argon2id key derivation pass...');
    
    setTimeout(() => {
      // Mock hash representation
      const mockHash = 'a2id$v=19$m=65536,t=3,p=4$dGVzdHBhc3M$' + Math.random().toString(16).substring(2, 22);
      setArgonHash(mockHash);
      setIsHashing(false);
      setStep(1);
      addLog('[CLIENT] Argon2id pass finished. Key derived successfully (Zero-Knowledge, local memory only).');
    }, 1200);
  };

  const runOpaqueBlind = () => {
    addLog('[CLIENT] Generating cryptographic blinding random exponent (r)...');
    
    setTimeout(() => {
      const mockBlinded = '04c3a2f9011de' + Math.random().toString(16).substring(2, 18) + 'f892a01d';
      setBlindedHex(mockBlinded);
      setStep(2);
      addLog('[CLIENT] Blinding applied: BlindPassword = Hash(Pass) * g^r. Sending blinded payload to server.');
      addLog('[SERVER] Blinded envelope received. Computing database signature check (Drogon C++ controller).');
    }, 1000);
  };

  const decryptEnvelope = () => {
    addLog('[SERVER] Envelope match successful. Returning OPAQUE signature envelope.');
    
    setTimeout(() => {
      setStep(3);
      addLog('[CLIENT] Response envelope received. Removing blinding factor (1/r).');
      addLog('[CLIENT] Verification successful. Rebuilt local master key.');
    }, 1000);
  };

  const triggerTpmUnlock = () => {
    addLog('[CLIENT] Binding decrypted keys to Windows TPM 2.0 via NCrypt API...');
    
    setTimeout(() => {
      setStep(4);
      addLog('[TPM] Hardware signature confirmed. Decrypting database payload local sector.');
      addLog('[SUCCESS] Vault unlocked! User profile active.');
    }, 1200);
  };

  const resetSimulator = () => {
    setStep(0);
    setArgonHash('');
    setBlindedHex('');
    setRevealVaultIdx(null);
    setConsoleLogs([
      'SYSTEM RESTART: Zero-Knowledge daemon restarted.',
      'OPAQUE engine re-initialized.'
    ]);
  };

  // Mock Vault Items (revealed only in final step)
  const vaultItems = [
    { site: 'github.com', user: 'nl_engineer', pass: 'ghp_A9x1K92ldp123' },
    { site: 'etsmtl.ca', user: 'lavoie_natael', pass: 'EtsCampus2026!' },
    { site: 'argon2_pool.org', user: 'sysop', pass: 'h@sh_m3_a1ways' }
  ];

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg space-y-6">
      <div>
        <h4 className="text-sm font-metadata-caps text-[var(--color-secondary)] uppercase tracking-widest flex items-center gap-2">
          <Shield size={14} /> Zero-Knowledge OPAQUE Protocol &amp; TPM Simulator
        </h4>
        <p className="text-xs text-[var(--color-secondary)] mt-1 font-sans">
          Simulate an asymmetric password authenticated key exchange. Step through client-side blinding, server envelop dispatch, and local TPM decryption bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Step-by-Step Cryptographic Flow */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg space-y-4">
            <span className="text-[10px] font-metadata-caps uppercase text-[var(--color-secondary)] tracking-wider block">
              Cryptographic Execution Steps
            </span>

            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-[var(--color-secondary)]">
                    <span>VAULT PASSPHRASE</span>
                    <button onClick={() => setShowPassword(!showPassword)} className="hover:text-[var(--color-text)] transition-colors cursor-pointer flex items-center gap-1">
                      {showPassword ? <EyeOff size={10} /> : <Eye size={10} />} {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono p-2.5 text-[var(--color-text)] focus:outline-none focus:border-secondary rounded"
                  />
                </div>

                <button
                  onClick={runArgonHash}
                  disabled={isHashing || !password}
                  className="w-full bg-[var(--color-secondary)] text-[var(--color-background)] py-2 text-xs font-metadata-caps uppercase hover:bg-[#ffe2b3] transition-colors rounded tracking-widest flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Key size={12} /> {isHashing ? 'COMPUTING ARGON2ID...' : '1. CLIENT HASH (ARGON2)'}
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[var(--color-surface)] p-2.5 rounded border border-[var(--color-border)]/30 overflow-x-auto text-[10px]">
                  <span className="text-neutral-500 block text-[8px]">ARGON2ID KEY DERIVATION OUTPUT</span>
                  <span className="text-[#4ADE80] break-all">{argonHash}</span>
                </div>

                <button
                  onClick={runOpaqueBlind}
                  className="w-full bg-[var(--color-secondary)] text-[var(--color-background)] py-2 text-xs font-metadata-caps uppercase hover:bg-[#ffe2b3] transition-colors rounded tracking-widest flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Shield size={12} /> 2. BLIND PASSWORD (OPAQUE)
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[var(--color-surface)] p-2.5 rounded border border-[var(--color-border)]/30 overflow-x-auto text-[10px]">
                  <span className="text-neutral-500 block text-[8px]">BLINDED KEY DISPATCHED TO DRAGON BACKEND</span>
                  <span className="text-cyan-400 break-all">{blindedHex}</span>
                </div>

                <button
                  onClick={decryptEnvelope}
                  className="w-full bg-[#3b82f6] text-white py-2 text-xs font-metadata-caps uppercase hover:bg-blue-400 transition-colors rounded tracking-widest flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Key size={12} /> 3. REQUEST VERIFICATION ENVELOPE
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 text-center">
                <div className="inline-flex p-2 bg-[#2ADE80]/10 border border-[#2ADE80]/30 rounded-full text-[#2ADE80] mb-1">
                  <CheckCircle size={24} className="animate-bounce" />
                </div>
                <p className="text-xs text-[var(--color-text)] font-mono leading-relaxed">
                  OPAQUE Authentication verification success! Master key rebuilt client-side.
                </p>

                <button
                  onClick={triggerTpmUnlock}
                  className="w-full bg-[var(--color-secondary)] text-[var(--color-background)] py-2 text-xs font-metadata-caps uppercase hover:bg-[#ffe2b3] transition-colors rounded tracking-widest flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Cpu size={12} /> 4. INITIATE TPM MODULE NCRYPT BIND
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center">
                <div className="inline-flex p-3 bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-full text-[#4ADE80]">
                  <CheckCircle size={28} />
                </div>
                <p className="text-xs font-mono text-[var(--color-text)] font-semibold">
                  TPM Binding active. Password vault sectors fully decrypted.
                </p>
                <button
                  onClick={resetSimulator}
                  className="border border-[var(--color-border)] text-[9px] font-metadata-caps text-[var(--color-secondary)] hover:text-[var(--color-text)] px-3 py-1 rounded transition-colors uppercase cursor-pointer mx-auto block"
                >
                  Lock Vault &amp; Restart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Decrypted Vault Preview & Cryptographic Logging */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg flex flex-col h-40">
            <span className="text-[10px] font-metadata-caps text-[var(--color-secondary)] tracking-wider uppercase mb-2 block">
              Cryptographic protocol console log
            </span>
            <div className="bg-[var(--color-surface)] p-2.5 text-[9px] font-mono text-cyan-400/80 flex-1 overflow-y-auto space-y-1 rounded">
              {consoleLogs.map((log, i) => (
                <div key={i} className="leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-lg space-y-3">
            <span className="text-[10px] font-metadata-caps text-[var(--color-secondary)] uppercase tracking-wider block">
              Secure Password Database Vault Browser
            </span>

            {step < 4 ? (
              <div className="h-28 flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] rounded p-4 text-center">
                <Shield className="text-[var(--color-secondary)]/40 mb-1.5" size={20} />
                <span className="text-[10px] text-[var(--color-secondary)] font-mono uppercase tracking-wider block">Vault Locked</span>
                <span className="text-[8px] text-neutral-500 font-sans mt-0.5 block">Complete steps 1–4 to decrypt database sectors.</span>
              </div>
            ) : (
              <div className="space-y-2 h-28 overflow-y-auto pr-1">
                {vaultItems.map((item, idx) => (
                  <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded flex justify-between items-center text-[10px] font-mono">
                    <div>
                      <span className="text-[#ffb951] font-bold block">{item.site}</span>
                      <span className="text-neutral-500 text-[8px] block">User: {item.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-text)] bg-black/40 px-2 py-0.5 rounded tracking-widest font-semibold">
                        {revealVaultIdx === idx ? item.pass : '••••••••••••'}
                      </span>
                      <button
                        onClick={() => setRevealVaultIdx(revealVaultIdx === idx ? null : idx)}
                        className="text-[var(--color-secondary)] hover:text-white transition-colors cursor-pointer"
                        title={revealVaultIdx === idx ? 'Hide password' : 'Show password'}
                      >
                        {revealVaultIdx === idx ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
