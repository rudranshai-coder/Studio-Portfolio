import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Sparkles, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { CategoryInfo, ProjectItem } from '../types';
import { ProjectCard } from './ProjectCard';

interface CategoryModalProps {
  category: CategoryInfo | null;
  projects: ProjectItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  projects,
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

  if (!category || !isOpen) return null;

  const categoryProjects = projects.filter(
    (p) =>
      (p.category === category.id ||
        (category.id === 'fashion-visuals' && p.category === 'fashion') ||
        (category.id === 'product-visuals' && p.category === 'product')) &&
      p.visible
  );

  const filteredProjects = categoryProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.toolsUsed && p.toolsUsed.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesFeatured = filterFeaturedOnly ? p.featured : true;
    return matchesSearch && matchesFeatured;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col justify-start">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-0 z-20 bg-[#080A10]/90 backdrop-blur-md border-b border-[#1A1E2C] px-6 md:px-12 py-5 flex items-center justify-between"
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#9295A0] hover:text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO OVERVIEW</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: category.primaryColor }}
            />
            <span className="font-['Space_Grotesk'] text-sm md:text-base font-bold text-[#F5F3EE]">
              {category.number} — {category.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#121520] hover:bg-[#1C2030] text-[#9295A0] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Category Hero Banner inside Modal */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 p-8 md:p-12 rounded-3xl bg-[#0E1019] border border-[#1E2336] relative overflow-hidden"
          >
            <div
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ backgroundColor: category.primaryColor }}
            />

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded font-['IBM_Plex_Mono'] text-xs font-semibold"
                  style={{
                    backgroundColor: `${category.primaryColor}22`,
                    color: category.secondaryColor,
                  }}
                >
                  {category.accentName}
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#9295A0] tracking-wider uppercase">
                  {category.personality.tag}
                </span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F3EE]">
                {category.title}
              </h1>

              <p className="font-['Manrope'] text-base md:text-lg text-[#9295A0] leading-relaxed">
                {category.description}
              </p>
            </div>
          </motion.div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9295A0]" />
              <input
                type="text"
                placeholder="Search collection or tool..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1019] border border-[#1E2336] focus:border-[#FF6A00] text-[#F5F3EE] text-xs sm:text-sm font-['Manrope'] placeholder-[#555A6E] focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-['IBM_Plex_Mono'] uppercase tracking-wider transition-all ${
                  filterFeaturedOnly
                    ? 'bg-[#FF6A00]/20 border-[#FF6A00] text-[#FF6A00]'
                    : 'bg-[#0E1019] border-[#1E2336] text-[#9295A0] hover:text-[#F5F3EE]'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Featured Only</span>
              </button>

              <span className="font-['IBM_Plex_Mono'] text-xs text-[#9295A0] pl-2">
                {filteredProjects.length} of {categoryProjects.length} Works
              </span>
            </div>
          </div>

          {/* Full Grid of Projects in Category */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-20">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={`cat-modal-${project.id}-${idx}`}
                  project={project}
                  categoryInfo={category}
                  onSelect={onSelectProject}
                  index={idx}
                  isCompact={false}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-[#0E1019] border border-dashed border-[#1E2336] p-8">
              <p className="font-['Space_Grotesk'] text-lg text-[#F5F3EE] mb-1">
                No projects matched your criteria
              </p>
              <p className="font-['Manrope'] text-xs text-[#9295A0] mb-4">
                Try clearing your search term or filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterFeaturedOnly(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#181B28] text-xs font-['IBM_Plex_Mono'] text-[#FF6A00]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
