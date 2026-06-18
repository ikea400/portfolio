import React, { useState, useEffect } from "react"; // HMR trigger
import { Project } from "./types";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import BackgroundGrid from "./components/BackgroundGrid";
import { translations } from "./translations";
import {
  Mail,
  Github,
  Linkedin,
  ArrowDown,
  Sparkles,
  Copy,
  Check,
  Moon,
  Sun,
} from "lucide-react";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "academic" | "personal">("all");
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const t = translations[language];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("natael.lavoie.1@ens.etsmtl.ca");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToWork = () => {
    document
      .getElementById("work-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToEducation = () => {
    document
      .getElementById("education-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToConnect = () => {
    document
      .getElementById("connect-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToProjects = () => {
    document
      .getElementById("projects-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeClick = () => {
    window.open(`${import.meta.env.BASE_URL}NataelLavoie_CV.pdf`, "_blank");
  };

  const displayedAcademic =
    filter === "personal" ? [] : (t.projectData.academic as Project[]);
  const displayedPersonal =
    filter === "academic" ? [] : (t.projectData.personal as Project[]);

  return (
    <div className={`bg-[var(--color-background)] text-[var(--color-text)] min-h-screen font-sans relative antialiased selection:bg-[var(--color-cta)] selection:text-white ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic Background shader dot grid */}
      <BackgroundGrid isDarkMode={isDarkMode} />

      {/* Main Top Navigation bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)] transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-12 h-20 max-w-7xl mx-auto w-full">
          <div className="font-heading text-lg md:text-xl font-bold tracking-widest uppercase">
            Natael Lavoie
          </div>
          <div className="hidden md:flex space-x-8">
            <button
              onClick={handleScrollToWork}
              className="font-mono text-xs uppercase tracking-widest text-[var(--color-secondary)] hover:text-black pb-1 border-b border-transparent hover:border-black transition-all cursor-pointer"
            >
              {t.nav.home}
            </button>
            <button
              onClick={handleScrollToEducation}
              className="font-mono text-xs uppercase tracking-widest text-[var(--color-secondary)] hover:text-black pb-1 border-b border-transparent hover:border-black transition-all cursor-pointer"
            >
              {t.nav.education}
            </button>
            <button
              onClick={handleScrollToProjects}
              className="font-mono text-xs uppercase tracking-widest text-[var(--color-secondary)] hover:text-black pb-1 border-b border-transparent hover:border-black transition-all cursor-pointer"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={handleScrollToConnect}
              className="font-mono text-xs uppercase tracking-widest text-[var(--color-secondary)] hover:text-black pb-1 border-b border-transparent hover:border-black transition-all cursor-pointer"
            >
              {t.nav.connect}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-text)]"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleResumeClick}
              className="font-mono text-xs uppercase tracking-widest px-5 py-2 border border-[var(--color-text)]/20 hover:border-[var(--color-text)] hover:bg-[var(--color-text)]/5 transition-all rounded cursor-pointer"
            >
              {t.nav.resume}
            </button>
            <div className="flex bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-1 rounded-lg">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider cursor-pointer ${language === "en" ? "bg-[var(--color-surface)] shadow-sm font-semibold text-[var(--color-text)]" : "text-neutral-500 hover:text-[var(--color-text)]"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider cursor-pointer ${language === "fr" ? "bg-[var(--color-surface)] shadow-sm font-semibold text-[var(--color-text)]" : "text-neutral-500 hover:text-[var(--color-text)]"}`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 overflow-hidden">
        {/* Section 1: Hero Banner */}
        <section
          className="min-h-[92vh] flex flex-col justify-center pt-32 pb-16"
          id="work-section"
        >
          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-tight md:leading-[1.1]">
              {t.hero.title}
            </h1>

            <div
              onClick={handleScrollToEducation}
              className="flex items-center space-x-6 mt-12 group cursor-pointer w-max btn-primary"
            >
              <span className="font-sans text-lg md:text-xl font-bold flex items-center gap-2">
                {t.hero.viewWork}{" "}
                <ArrowDown className="animate-bounce" size={18} />
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Education Block */}
        <section
          className="py-24 border-t border-[var(--color-border)] relative"
          id="education-section"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Sticky Left Column block */}
            <div className="md:col-span-4 relative">
              <div className="sticky top-28">
                <h2 className="font-heading text-4xl md:text-5xl font-bold">
                  {t.education.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Right column block info */}
            <div className="md:col-span-8 space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold">
                  École de technologie supérieure (ÉTS)
                </h3>
                <p className="text-lg text-[var(--color-secondary)] font-sans">
                  {t.education.degree}
                </p>
                <p className="font-mono text-xs text-[var(--color-secondary)] tracking-widest uppercase">
                  {t.education.expected}
                </p>
              </div>

              <div className="space-y-6 pt-10 border-t border-[var(--color-border)]">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-cta)] font-semibold">
                  {t.education.foundations}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-[var(--color-secondary)] leading-relaxed">
                  {t.education.courses.map((course, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 hover:text-black transition-colors cursor-default"
                    >
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Toolbar for navigation experience */}
        <div
          className="py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-[var(--color-border)]"
          id="projects-section"
        >
          <span className="font-mono text-xs text-[var(--color-secondary)] uppercase tracking-widest font-semibold">
            {t.projects.showcase}
          </span>
          <div className="flex bg-black/[0.05] border border-black/[0.1] p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-xs font-mono rounded transition-colors uppercase tracking-wider cursor-pointer ${filter === "all"
                ? "bg-white shadow-sm font-bold text-black"
                : "text-neutral-500 hover:text-black"
                }`}
            >
              {t.projects.all}
            </button>
            <button
              onClick={() => setFilter("academic")}
              className={`px-4 py-2 text-xs font-mono rounded transition-colors uppercase tracking-wider cursor-pointer ${filter === "academic"
                ? "bg-white shadow-sm font-bold text-black"
                : "text-neutral-500 hover:text-black"
                }`}
            >
              {t.projects.academic}
            </button>
            <button
              onClick={() => setFilter("personal")}
              className={`px-4 py-2 text-xs font-mono rounded transition-colors uppercase tracking-wider cursor-pointer ${filter === "personal"
                ? "bg-white shadow-sm font-bold text-black"
                : "text-neutral-500 hover:text-black"
                }`}
            >
              {t.projects.personal}
            </button>
          </div>
        </div>

        {/* Section 3: Academic Projects */}
        {displayedAcademic.length > 0 && (
          <section className="py-16 border-t border-[var(--color-border)] relative">
            <div className="mb-12">
              <h2 className="font-heading text-4xl font-bold mb-4 flex items-center gap-4">
                {t.projects.academicTitle}
                <span className="bg-[var(--color-cta)]/10 text-[var(--color-cta)] text-xs font-mono px-3 py-1 rounded-full font-bold uppercase">
                  {t.projects.academicLabel}
                </span>
              </h2>
              <p className="font-sans text-[var(--color-secondary)] text-lg max-w-2xl">
                {t.projects.academicDesc}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayedAcademic.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Personal Projects */}
        {displayedPersonal.length > 0 && (
          <section className="py-16 border-t border-[var(--color-border)] relative">
            <div className="mb-12">
              <h2 className="font-heading text-4xl font-bold mb-4 flex items-center gap-4">
                {t.projects.personalTitle}
                <span className="bg-[#10B981]/10 text-[#10B981] text-xs font-mono px-3 py-1 rounded-full font-bold uppercase">
                  {t.projects.personalLabel}
                </span>
              </h2>
              <p className="font-sans text-[var(--color-secondary)] text-lg max-w-2xl">
                {t.projects.personalDesc}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayedPersonal.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Main Connection Block / Footer */}
      <footer
        className="w-full py-28 bg-[var(--color-footer-bg)] text-[#FAFAFA] relative z-10 border-t border-[var(--color-border)]"
        id="connect-section"
      >
        <div className="flex flex-col items-start px-6 md:px-12 space-y-8 w-full max-w-5xl mx-auto">
          <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12">
            <div>
              <h2 className="font-heading text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6 text-[#FAFAFA]">
                {t.connect.title}
              </h2>
              <p className="text-[#FAFAFA]/80 text-lg max-w-md font-sans mb-8">
                {t.connect.subtitle}
              </p>

              <div className="flex flex-wrap gap-6 md:gap-10">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-colors duration-300 hover-underline-anim flex items-center gap-2"
                >
                  <Linkedin size={20} /> LinkedIn
                </a>
                <a
                  href="https://github.com/ikea400"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-colors duration-300 hover-underline-anim flex items-center gap-2"
                >
                  <Github size={20} /> GitHub
                </a>
                <a
                  href="mailto:natael.lavoie.1@ens.etsmtl.ca"
                  className="text-xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-colors duration-300 hover-underline-anim flex items-center gap-2"
                >
                  <Mail size={20} /> {t.connect.directEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="text-xl font-bold text-[#FAFAFA]/80 hover:text-[#FAFAFA] transition-colors duration-300 hover-underline-anim flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={20} className="text-[#4ADE80]" /> : <Copy size={20} />} {copied ? t.connect.copiedEmail : t.connect.copyEmail}
                </button>
              </div>
            </div>
          </div>

          {/* Copyright banner */}
          <div className="w-full pt-10 border-t border-[#FAFAFA]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-[#FAFAFA]/60">
            <span>{t.connect.copyright}</span>
            <span className="flex items-center gap-1.5 hover:text-[#FAFAFA] transition-colors cursor-default font-bold text-[var(--color-cta)]">
              <Sparkles size={14} />{" "}
              {t.connect.systemStatus}
            </span>
          </div>
        </div>
      </footer>

      {/* Main details Modal Drawer for interactive testing & simulation */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          language={language}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
