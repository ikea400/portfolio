import React, { useState } from "react";
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
} from "lucide-react";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "academic" | "personal">("all");
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [copied, setCopied] = useState(false);

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
    <div className="bg-[#131315] text-white min-h-screen font-sans relative antialiased selection:bg-secondary selection:text-black">
      {/* Dynamic Background shader dot grid */}
      <BackgroundGrid />

      {/* Main Top Navigation bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-12 h-20 max-w-7xl mx-auto w-full">
          <div className="font-mono text-sm md:text-base font-bold text-white tracking-widest uppercase">
            Natael Lavoie
          </div>
          <div className="hidden md:flex space-x-8">
            <button
              onClick={handleScrollToWork}
              className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-white pb-1 border-b border-transparent hover:border-white transition-all"
            >
              {t.nav.home}
            </button>
            <button
              onClick={handleScrollToEducation}
              className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-white pb-1 border-b border-transparent hover:border-white transition-all"
            >
              {t.nav.education}
            </button>
            <button
              onClick={handleScrollToProjects}
              className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-white pb-1 border-b border-transparent hover:border-white transition-all"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={handleScrollToConnect}
              className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-white pb-1 border-b border-transparent hover:border-white transition-all"
            >
              {t.nav.connect}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleResumeClick}
              className="font-mono text-xs uppercase tracking-widest px-5 py-2 border border-white/20 hover:border-secondary hover:bg-white/5 text-white transition-all rounded"
            >
              {t.nav.resume}
            </button>
            <div className="flex bg-[#1b1b1d] border border-white/[0.1] p-1 rounded-lg">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider ${language === "en" ? "bg-secondary text-black font-semibold" : "text-neutral-400 hover:text-white"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider ${language === "fr" ? "bg-secondary text-black font-semibold" : "text-neutral-400 hover:text-white"}`}
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight leading-tight md:leading-[1.1]">
              {t.hero.title}
            </h1>

            <div
              onClick={handleScrollToEducation}
              className="flex items-center space-x-6 mt-12 group cursor-pointer w-max"
            >
              <div className="w-1 h-12 bg-secondary transform origin-top scale-y-100 group-hover:scale-y-150 transition-transform duration-500"></div>
              <span className="font-sans text-lg md:text-xl text-neutral-400 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                {t.hero.viewWork}{" "}
                <ArrowDown className="animate-bounce" size={18} />
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Education Block */}
        <section
          className="py-24 border-t border-white/[0.06] relative"
          id="education-section"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sticky Left Column block */}
            <div className="md:col-span-4 relative">
              <div className="sticky top-28">
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-primary">
                  {t.education.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Right column block info */}
            <div className="md:col-span-8 space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  École de technologie supérieure (ÉTS)
                </h3>
                <p className="text-lg text-neutral-400 font-sans">
                  {t.education.degree}
                </p>
                <p className="font-mono text-xs text-neutral-500 tracking-widest uppercase">
                  {t.education.expected}
                </p>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/[0.06]">
                <p className="font-mono text-xs uppercase tracking-widest text-[#ffb951] font-semibold">
                  {t.education.foundations}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-neutral-400 leading-relaxed">
                  {t.education.courses.map((course, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-default"
                    >
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Toolbar for luxury navigation experience */}
        <div
          className="py-8 flex justify-between items-center border-t border-white/[0.06]"
          id="projects-section"
        >
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:inline">
            {t.projects.showcase}
          </span>
          <div className="flex bg-[#1b1b1d] border border-white/[0.1] p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider ${filter === "all"
                ? "bg-secondary text-black font-semibold"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              {t.projects.all}
            </button>
            <button
              onClick={() => setFilter("academic")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider ${filter === "academic"
                ? "bg-secondary text-black font-semibold"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              {t.projects.academic}
            </button>
            <button
              onClick={() => setFilter("personal")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase tracking-wider ${filter === "personal"
                ? "bg-secondary text-black font-semibold"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              {t.projects.personal}
            </button>
          </div>
        </div>

        {/* Section 3: Academic Projects */}
        {displayedAcademic.length > 0 && (
          <section className="py-12 border-t border-white/[0.06] relative">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                {t.projects.academicTitle}
                <span className="bg-secondary/10 text-secondary text-[11px] font-mono px-3 py-0.5 rounded-full font-normal uppercase">
                  {t.projects.academicLabel}
                </span>
              </h2>
              <p className="font-sans text-neutral-400 text-lg max-w-2xl">
                {t.projects.academicDesc}
              </p>
            </div>
            <div className="space-y-0">
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
          <section className="py-12 border-t border-white/[0.06] relative">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                {t.projects.personalTitle}
                <span className="bg-[#4ADE80]/10 text-[#4ADE80] text-[11px] font-mono px-3 py-0.5 rounded-full font-normal uppercase">
                  {t.projects.personalLabel}
                </span>
              </h2>
              <p className="font-sans text-neutral-400 text-lg max-w-2xl">
                {t.projects.personalDesc}
              </p>
            </div>
            <div className="space-y-0">
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
        className="w-full py-28 bg-[#131315] relative z-10 border-t border-white/[0.06]"
        id="connect-section"
      >
        <div className="flex flex-col items-start px-6 md:px-12 space-y-8 w-full max-w-5xl mx-auto">
          <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12">
            <div>
              <h2 className="text-4xl md:text-7xl font-extrabold text-primary tracking-tighter uppercase mb-6">
                {t.connect.title}
              </h2>
              <p className="text-neutral-400 text-base max-w-md font-sans mb-8">
                {t.connect.subtitle}
              </p>

              <div className="flex flex-wrap gap-6 md:gap-10">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-bold text-neutral-400 hover:text-secondary transition-colors duration-300 hover-underline-anim flex items-center gap-1"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a
                  href="https://github.com/ikea400"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-bold text-neutral-400 hover:text-secondary transition-colors duration-300 hover-underline-anim flex items-center gap-1"
                >
                  <Github size={18} /> GitHub
                </a>
                <a
                  href="mailto:natael.lavoie.1@ens.etsmtl.ca"
                  className="text-lg font-bold text-neutral-400 hover:text-secondary transition-colors duration-300 hover-underline-anim flex items-center gap-1"
                >
                  <Mail size={18} /> {t.connect.directEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="text-lg font-bold text-neutral-400 hover:text-secondary transition-colors duration-300 hover-underline-anim flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-none"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={18} className="text-[#4ADE80]" /> : <Copy size={18} />} {copied ? t.connect.copiedEmail : t.connect.copyEmail}
                </button>
              </div>
            </div>
          </div>

          {/* Copyright banner */}
          <div className="w-full pt-10 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-500">
            <span>{t.connect.copyright}</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <Sparkles className="text-secondary" size={12} />{" "}
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
