import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  key?: string;
  project: Project;
  onSelect: (p: Project) => void;
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div
      onClick={() => onSelect(project)}
      className="card flex flex-col justify-between h-full group"
    >
      <div className="space-y-4 mb-6">
        <h3 className="font-heading text-2xl font-bold text-primary group-hover:text-[var(--color-cta)] transition-colors duration-300 flex items-center justify-between">
          {project.title}
          <ArrowUpRight size={24} className="text-[var(--color-cta)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </h3>
        <p className="font-sans text-base text-[var(--color-secondary)]">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        {project.tags.map((tg) => (
          <span
            key={tg}
            className="font-mono text-xs font-semibold px-3 py-1.5 bg-black/[0.04] text-[var(--color-secondary)] rounded group-hover:bg-[var(--color-cta)]/10 group-hover:text-[var(--color-cta)] transition-colors duration-300 uppercase"
          >
            {tg}
          </span>
        ))}
      </div>
    </div>
  );
}
