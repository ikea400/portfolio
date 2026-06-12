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
      className="group border-b border-glass-border py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:bg-white/[0.02] transition-all duration-500 -mx-8 px-8 cursor-pointer"
    >
      <div className="max-w-2xl space-y-4">
        <h3 className="font-headline-card text-2xl text-primary group-hover:text-secondary transition-colors duration-300 flex items-center gap-2">
          {project.title}
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-secondary" />
        </h3>
        <p className="font-body-base text-base text-on-surface-variant group-hover:text-primary transition-colors duration-300">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 shrink-0">
        {project.tags.map((tg) => (
          <span
            key={tg}
            className="font-metadata-caps text-[11px] text-on-surface-variant border border-glass-border px-4 py-2 rounded-full group-hover:border-secondary/40 group-hover:text-secondary transition-colors duration-300 uppercase"
          >
            [{tg}]
          </span>
        ))}
      </div>
    </div>
  );
}
