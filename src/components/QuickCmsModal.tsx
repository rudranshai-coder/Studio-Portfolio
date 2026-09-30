import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Star,
  Download,
  Upload,
  User,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { PortfolioConfig, ProjectItem, CategoryId } from '../types';

interface QuickCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onSaveConfig: (newConfig: PortfolioConfig) => void;
  onResetConfig: () => void;
}

export const QuickCmsModal: React.FC<QuickCmsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'contact' | 'json'>('profile');
  const [localConfig, setLocalConfig] = useState<PortfolioConfig>(config);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    config.projects[0]?.id || ''
  );
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(localConfig);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleProfileImageChange = (url: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      profileImageUrl: url,
    }));
  };

  const handleProjectFieldChange = (id: string, field: keyof ProjectItem, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleAddNewProject = () => {
    const newId = `project-custom-${Date.now()}`;
    const newProject: ProjectItem = {
      id: newId,
      title: 'New AI Project Concept',
      category: 'fashion',
      categoryLabel: 'FASHION VISUALS / ADS',
      shortDescription: 'AI-generated visual campaign concept.',
      fullDescription: 'Custom campaign created with advanced generative workflows.',
      creativeDirection: 'Editorial high-contrast styling.',
      imageUrl: '',
      videoUrl: '',
      reelUrl: '',
      thumbnailUrl: '',
      externalUrl: '',
      toolsUsed: [],
      clientOrBrand: 'New Client',
      aspectRatio: 'portrait',
      featured: true,
      visible: true,
      displayOrder: localConfig.projects.length + 1,
    };

    setLocalConfig((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setSelectedProjectId(newId);
  };

  const handleDeleteProject = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    if (selectedProjectId === id) {
      setSelectedProjectId(localConfig.projects.find((p) => p.id !== id)?.id || '');
    }
  };

  const selectedProject = localConfig.projects.find((p) => p.id === selectedProjectId);

  const exportConfigJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'portfolioData.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col justify-start">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0A0C14] border-b border-[#1E2336] px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
              Portfolio Content & Media URL Manager
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="flex items-center gap-1 text-xs font-['IBM_Plex_Mono'] text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" /> Saved Live!
              </span>
            )}

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6A00] hover:bg-[#FF8533] text-white font-['Space_Grotesk'] text-xs font-bold tracking-wider uppercase transition-all shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#121520] hover:bg-[#1C2030] text-[#9295A0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#080A10] border-b border-[#1A1D2B] px-6 md:px-10 flex items-center gap-6 font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#FF6A00] text-[#F5F3EE] font-bold'
                : 'border-transparent text-[#9295A0] hover:text-[#F5F3EE]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Photo & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-[#FF6A00] text-[#F5F3EE] font-bold'
                : 'border-transparent text-[#9295A0] hover:text-[#F5F3EE]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Projects & Media URLs ({localConfig.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'border-[#FF6A00] text-[#F5F3EE] font-bold'
                : 'border-transparent text-[#9295A0] hover:text-[#F5F3EE]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact & Social Links</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'json'
                ? 'border-[#FF6A00] text-[#F5F3EE] font-bold'
                : 'border-transparent text-[#9295A0] hover:text-[#F5F3EE]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Raw JSON Config</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex-1">
          {/* TAB 1: Profile Image & Hero */}
          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-2xl">
              <div className="p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF6A00]" />
                  <span>Profile Photo URL</span>
                </h3>

                <p className="font-['Manrope'] text-xs text-[#9295A0]">
                  Paste any direct public image URL (Unsplash, Imgur, Cloudinary, AWS S3, etc.) to immediately replace the hero portrait.
                </p>

                <div className="flex gap-3">
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={
                      localConfig.profileImageUrl === 'PASTE_PROFILE_IMAGE_URL_HERE'
                        ? ''
                        : localConfig.profileImageUrl
                    }
                    onChange={(e) => handleProfileImageChange(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#FF6A00] text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => handleProfileImageChange('')}
                    className="px-3 py-2 rounded-xl bg-[#151926] text-xs font-['IBM_Plex_Mono'] text-[#9295A0] hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                {/* Live Full Preview */}
                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="max-w-44 max-h-32 rounded-xl bg-[#151824] border border-[#23283B] p-1.5 overflow-hidden flex items-center justify-center relative shadow-md">
                    {localConfig.profileImageUrl &&
                    localConfig.profileImageUrl.startsWith('http') ? (
                      <img
                        src={localConfig.profileImageUrl}
                        alt="Profile preview"
                        referrerPolicy="no-referrer"
                        className="max-h-28 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#9295A0] text-center p-2 uppercase">
                        ADD PHOTO
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-sm font-bold text-[#F5F3EE]">
                      {localConfig.name}
                    </div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#9295A0]">
                      {localConfig.heroIdentity} (Full Uncropped)
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Hero Text fields */}
              <div className="p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                  Bio & Headline Configuration
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={localConfig.name}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      SUPPORTING HERO DESCRIPTION
                    </label>
                    <textarea
                      rows={2}
                      value={localConfig.heroDescription}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, heroDescription: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      EXPERIENCE SUMMARY
                    </label>
                    <input
                      type="text"
                      value={localConfig.experienceSummary}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, experienceSummary: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      EDUCATION
                    </label>
                    <input
                      type="text"
                      value={localConfig.education}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, education: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Projects & Media URLs */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Project selector list */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider text-[#9295A0]">
                    SELECT WORK ITEM
                  </span>
                  <button
                    onClick={handleAddNewProject}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF6A00]/20 hover:bg-[#FF6A00]/30 text-[#FF6A00] font-['IBM_Plex_Mono'] text-xs font-semibold tracking-wider transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD PROJECT</span>
                  </button>
                </div>

                <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1">
                  {localConfig.projects.map((proj, idx) => (
                    <div
                      key={`cms-proj-${proj.id}-${idx}`}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedProjectId === proj.id
                          ? 'bg-[#181B28] border-[#FF6A00]'
                          : 'bg-[#0E1019] border-[#1A1E2C] hover:border-[#2C3247]'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-[#080A10] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {proj.imageUrl ? (
                            <img
                              src={proj.imageUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-[#9295A0]" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-['Space_Grotesk'] text-sm font-bold text-[#F5F3EE] truncate">
                            {proj.title}
                          </div>
                          <div className="font-['IBM_Plex_Mono'] text-[10px] text-[#9295A0] uppercase">
                            {proj.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {proj.featured && (
                          <Star className="w-3.5 h-3.5 text-[#FF6A00] fill-[#FF6A00]" />
                        )}
                        {!proj.visible && (
                          <EyeOff className="w-3.5 h-3.5 text-[#636878]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Project Editor Form */}
              {selectedProject && (
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E2336]">
                    <div>
                      <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#FF6A00] uppercase tracking-widest">
                        EDITING ITEM
                      </span>
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                        {selectedProject.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleProjectFieldChange(
                            selectedProject.id,
                            'featured',
                            !selectedProject.featured
                          )
                        }
                        className={`p-2 rounded-lg text-xs font-['IBM_Plex_Mono'] flex items-center gap-1 ${
                          selectedProject.featured
                            ? 'bg-[#FF6A00]/20 text-[#FF6A00]'
                            : 'bg-[#151926] text-[#9295A0]'
                        }`}
                        title="Toggle Featured status"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>{selectedProject.featured ? 'Featured' : 'Standard'}</span>
                      </button>

                      <button
                        onClick={() =>
                          handleProjectFieldChange(
                            selectedProject.id,
                            'visible',
                            !selectedProject.visible
                          )
                        }
                        className="p-2 rounded-lg bg-[#151926] text-[#9295A0] hover:text-white"
                        title="Toggle Visibility"
                      >
                        {selectedProject.visible ? (
                          <Eye className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-[#EF4444]" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteProject(selectedProject.id)}
                        className="p-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                        PROJECT TITLE
                      </label>
                      <input
                        type="text"
                        value={selectedProject.title}
                        onChange={(e) =>
                          handleProjectFieldChange(selectedProject.id, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs font-['Manrope']"
                      />
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                        CATEGORY
                      </label>
                      <select
                        value={selectedProject.category}
                        onChange={(e) =>
                          handleProjectFieldChange(
                            selectedProject.id,
                            'category',
                            e.target.value as CategoryId
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs font-['Manrope']"
                      >
                        <option value="fashion-visuals">01 — FASHION VISUALS</option>
                        <option value="fashion-ads">02 — FASHION ADS</option>
                        <option value="jewellery-ads">03 — JEWELLERY AD CAMPAIGNS</option>
                        <option value="product-visuals">04 — PRODUCT VISUALS</option>
                        <option value="product-ads">05 — PRODUCT ADS</option>
                        <option value="ugc">06 — UGC & SOCIAL ADS</option>
                        <option value="videos">07 — AI STORYWORLDS</option>
                        <option value="campaigns">08 — BRAND AD CAMPAIGNS</option>
                        <option value="fashion">Legacy Fashion</option>
                        <option value="product">Legacy Product</option>
                      </select>
                    </div>
                  </div>

                  {/* Media URLs (Image, Video, Reel, Thumbnail) */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#F3E8CB] mb-1 flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-[#FF6A00]" />
                        <span>IMAGE URL (Main Visual)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or any URL"
                        value={selectedProject.imageUrl}
                        onChange={(e) =>
                          handleProjectFieldChange(selectedProject.id, 'imageUrl', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#FF6A00] text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#38BDF8] mb-1 flex items-center gap-1.5">
                        <Video className="w-3 h-3 text-[#38BDF8]" />
                        <span>VIDEO URL / REEL URL (Optional Motion)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://assets.mixkit.co/... or mp4 direct link"
                        value={selectedProject.videoUrl || selectedProject.reelUrl || ''}
                        onChange={(e) =>
                          handleProjectFieldChange(selectedProject.id, 'videoUrl', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#38BDF8] text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#00FF87] mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3 text-[#00FF87]" />
                          <span>ADDITIONAL IMAGE URLS (1 per line or comma-separated)</span>
                        </span>
                        <span className="text-[10px] text-[#9295A0]">
                          {(selectedProject.additionalImages || []).length} gallery visuals
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="https://i.postimg.cc/... (one per line)"
                        value={(selectedProject.additionalImages || []).join('\n')}
                        onChange={(e) => {
                          const urls = e.target.value
                            .split(/[\n,]+/)
                            .map((u) => u.trim())
                            .filter(Boolean);
                          handleProjectFieldChange(selectedProject.id, 'additionalImages', urls);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#00FF87] text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1 flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3 text-[#9295A0]" />
                        <span>EXTERNAL PROJECT URL (Optional Link)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://behance.net/... or instagram post link"
                        value={selectedProject.externalUrl || ''}
                        onChange={(e) =>
                          handleProjectFieldChange(selectedProject.id, 'externalUrl', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                        SHORT DESCRIPTION
                      </label>
                      <input
                        type="text"
                        value={selectedProject.shortDescription}
                        onChange={(e) =>
                          handleProjectFieldChange(
                            selectedProject.id,
                            'shortDescription',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                        CREATIVE DIRECTION NOTE
                      </label>
                      <input
                        type="text"
                        value={selectedProject.creativeDirection}
                        onChange={(e) =>
                          handleProjectFieldChange(
                            selectedProject.id,
                            'creativeDirection',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs italic"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Contact & Social */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                  Direct Contact Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={localConfig.contact.email}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          contact: { ...localConfig.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs font-['IBM_Plex_Mono']"
                    />
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] mb-1">
                      PHONE NUMBER / WHATSAPP
                    </label>
                    <input
                      type="text"
                      value={localConfig.contact.phone}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          contact: { ...localConfig.contact, phone: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs font-['IBM_Plex_Mono']"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                  Social Media Channels
                </h3>

                <div className="space-y-3">
                  {localConfig.socialLinks.map((s, idx) => (
                    <div key={`cms-social-${s.platform}-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-['IBM_Plex_Mono'] text-[10px] text-[#9295A0] mb-1 uppercase">
                          {s.platform} HANDLE
                        </label>
                        <input
                          type="text"
                          value={s.handle}
                          onChange={(e) => {
                            const updated = [...localConfig.socialLinks];
                            updated[idx].handle = e.target.value;
                            setLocalConfig({ ...localConfig, socialLinks: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-['IBM_Plex_Mono'] text-[10px] text-[#9295A0] mb-1 uppercase">
                          {s.platform} PROFILE URL
                        </label>
                        <input
                          type="url"
                          value={s.url}
                          onChange={(e) => {
                            const updated = [...localConfig.socialLinks];
                            updated[idx].url = e.target.value;
                            setLocalConfig({ ...localConfig, socialLinks: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080A10] border border-[#1E2336] text-[#F5F3EE] text-xs font-['IBM_Plex_Mono']"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Raw JSON Export & Reset */}
          {activeTab === 'json' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0E1019] border border-[#1E2336] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                    JSON Configuration Export
                  </h3>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={exportConfigJson}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF6A00] text-white text-xs font-['IBM_Plex_Mono']"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Reset all changes back to default portfolio state?')) {
                          onResetConfig();
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/30 text-red-300 text-xs font-['IBM_Plex_Mono']"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Initial</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#05070B] border border-[#1A1E2C] text-[#38BDF8] font-['IBM_Plex_Mono'] text-[11px] overflow-auto max-h-96">
                  {JSON.stringify(localConfig, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
