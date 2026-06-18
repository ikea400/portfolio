import { X, Cpu, Layers, Bookmark } from 'lucide-react';
import { Project } from '../types';
import MicroservicesSimulator from './MicroservicesSimulator';
import CNNSimulator from './CNNSimulator';
import PhysicsSimulator from './PhysicsSimulator';
import ZeroKnowledgeSimulator from './ZeroKnowledgeSimulator';
import RiskQuestSimulator from './RiskQuestSimulator';
import { translations } from '../translations';

interface ProjectModalProps {
  project: Project | null;
  language: "en" | "fr";
  onClose: () => void;
}

export default function ProjectModal({ project, language, onClose }: ProjectModalProps) {
  if (!project) return null;

  const t = translations[language].modal;
  const categoryName = language === 'fr'
    ? (project.category === 'academic' ? 'académique' : 'personnel')
    : project.category;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center bg-[var(--color-background)]/80 backdrop-blur-md p-4 animate-fadeIn">
      {/* Container card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl w-full max-w-5xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col relative">

        {/* Hover bar top decorative */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-cta)] to-emerald-400"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--color-secondary)] uppercase tracking-wider bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded">
              {categoryName} {t.projectType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)] p-1.5 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Main layout: Meta + Content description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-heading text-4xl font-extrabold text-[var(--color-text)] tracking-tight leading-none">
                {project.title}
              </h3>
              <p className="font-sans text-lg text-[var(--color-secondary)] leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            <div className="md:col-span-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-1.5 text-[var(--color-secondary)] text-xs font-mono uppercase">
                <Bookmark size={12} /> {t.techStack}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tg) => (
                  <span
                    key={tg}
                    className="font-mono text-[10px] text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded"
                  >
                    {tg}
                  </span>
                ))}
              </div>

              {project.metrics && (
                <div className="space-y-3 pt-3 border-t border-[var(--color-border)] font-mono text-[11px]">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-[var(--color-secondary)]">{m.label}:</span>
                      <span className="text-[var(--color-text)] font-medium">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Key Features Block */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono text-[var(--color-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={13} /> {t.architecture}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {project.keyFeatures.map((feat, idx) => (
                <div key={idx} className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-3 rounded flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 bg-[var(--color-cta)] rounded-full mt-1.5 shrink-0" />
                  <p className="text-xs text-[var(--color-text)] leading-relaxed font-sans">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Simulator Playground */}
          {['microservices_cicd', 'cnn_platform', 'physics_engine', 'truepass', 'riskquest'].includes(project.id) && (
            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[var(--color-secondary)]" />
                <span className="text-xs font-mono text-[var(--color-secondary)] uppercase tracking-widest">
                  {t.simulator}
                </span>
              </div>

              {project.id === 'microservices_cicd' && <MicroservicesSimulator />}
              {project.id === 'cnn_platform' && <CNNSimulator />}
              {project.id === 'physics_engine' && <PhysicsSimulator />}
              {project.id === 'truepass' && <ZeroKnowledgeSimulator />}
              {project.id === 'riskquest' && <RiskQuestSimulator />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-footer-bg)] flex justify-between items-center text-[10px] font-mono text-[var(--color-secondary)]">
          <span>{t.projectType}: {project.title}</span>
          <span>© 2026 Natael Lavoie</span>
        </div>
      </div>
    </div>
  );
}
