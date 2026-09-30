import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  Check,
  Briefcase,
  Layers,
  Plus,
  Edit3,
  ExternalLink,
  Star,
  Play,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  Filter,
  Image as ImageIcon,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ContactMethod, CollaborationStatus, ProjectItem, CategoryId } from '../types';
import { initialPortfolioData } from '../data/portfolioData';
import { subscribeToInquiries, updateInquiry, deleteInquiry } from '../services/inquiriesStorage';
import { sendEmailViaGmailApi, openGmailComposeWindow } from '../services/gmail';

const ADMIN_EMAIL = 'rudranshgoyal44@gmail.com';
const ADMIN_PASS = 'Fantastic Force 11';

export interface AdminCollaborationItem {
  id: string;
  recordId: string;
  brandName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  workType: string;
  description: string;
  preferredContactMethod: ContactMethod;
  budgetTimeline?: string;
  status: CollaborationStatus;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
  reviewedAt?: any;
  confirmedAt?: any;
  adminReply?: string;
  collectionSource: 'collaboration_requests' | 'inquiries';
}

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: ProjectItem[];
  onUpdateProjects?: (updatedProjects: ProjectItem[]) => void;
}

export type ProjectSectionKey = 'all' | 'fashion' | 'product' | 'ugc' | 'campaigns';

export const PROJECT_SECTIONS_CONFIG: {
  key: 'fashion' | 'product' | 'ugc' | 'campaigns';
  title: string;
  tagline: string;
  badge: string;
  accent: string;
  categoryIds: CategoryId[];
}[] = [
  {
    key: 'fashion',
    title: 'Fashion Visuals & Ads',
    tagline: 'Luxury editorial, silk saree series, ethnic couture & high-fashion ad films',
    badge: 'Fashion Section',
    accent: '#F43F5E',
    categoryIds: ['fashion-visuals', 'fashion-ads', 'fashion'],
  },
  {
    key: 'product',
    title: 'Product & Jewellery Visuals',
    tagline: 'Commercial product staging, luxury jewellery ad campaigns & tech visuals',
    badge: 'Product Section',
    accent: '#10B981',
    categoryIds: ['product-visuals', 'product-ads', 'jewellery-ads', 'product'],
  },
  {
    key: 'ugc',
    title: 'UGC & Social Ads',
    tagline: 'High-converting social hooks, creator-style UGC & organic conversion ads',
    badge: 'UGC Section',
    accent: '#A855F7',
    categoryIds: ['ugc', 'social'],
  },
  {
    key: 'campaigns',
    title: 'Ad Campaigns & Storyworlds',
    tagline: 'Comprehensive brand commercial campaigns, narrative films & AI storyworlds',
    badge: 'Ad Campaigns Section',
    accent: '#38BDF8',
    categoryIds: ['campaigns', 'videos'],
  },
];

export const CATEGORY_OPTIONS: { id: CategoryId; label: string; sectionKey: 'fashion' | 'product' | 'ugc' | 'campaigns' }[] = [
  { id: 'fashion-visuals', label: 'Fashion Visuals (Editorial)', sectionKey: 'fashion' },
  { id: 'fashion-ads', label: 'Fashion Ads (Campaign Films)', sectionKey: 'fashion' },
  { id: 'product-visuals', label: 'Product Visuals (Staging)', sectionKey: 'product' },
  { id: 'product-ads', label: 'Product Ads (Commercial)', sectionKey: 'product' },
  { id: 'jewellery-ads', label: 'Jewellery Ad Campaigns', sectionKey: 'product' },
  { id: 'ugc', label: 'UGC & Social Ads', sectionKey: 'ugc' },
  { id: 'campaigns', label: 'Brand Ad Campaigns', sectionKey: 'campaigns' },
  { id: 'videos', label: 'AI Storyworlds & Narrative Films', sectionKey: 'campaigns' },
];

function getSectionForCategory(cat: CategoryId): 'fashion' | 'product' | 'ugc' | 'campaigns' {
  if (cat === 'fashion-visuals' || cat === 'fashion-ads' || cat === 'fashion') return 'fashion';
  if (cat === 'product-visuals' || cat === 'product-ads' || cat === 'jewellery-ads' || cat === 'product') return 'product';
  if (cat === 'ugc' || cat === 'social') return 'ugc';
  return 'campaigns';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  projects: initialProjectsProp,
  onUpdateProjects,
}) => {
  const { user } = useAuth();

  // Top-level Navigation: 1. Manage Collaborations, 2. Manage Projects
  const [activeNavTab, setActiveNavTab] = useState<'collaborations' | 'projects'>('collaborations');

  const [localAdminAuth, setLocalAdminAuth] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('rudransh_admin_authenticated') === 'true';
  });

  // Keep local admin state synchronized
  useEffect(() => {
    const handleAuthChange = () => {
      setLocalAdminAuth(localStorage.getItem('rudransh_admin_authenticated') === 'true');
    };
    window.addEventListener('open-admin-portal', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('open-admin-portal', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const isCurrentAdmin = Boolean(
    (user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    localAdminAuth
  );

  // In-modal Login State if not yet authenticated
  const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!isOpen || !isCurrentAdmin) return;
    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          localStorage.removeItem('rudransh_admin_authenticated');
          setLocalAdminAuth(false);
          onClose();
        } catch (err) {
          console.error('Auto-logout error:', err);
        }
      }, 1800000);
    };

    resetTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isOpen, isCurrentAdmin, onClose]);

  // ==========================================
  // SECTION 1: MANAGE COLLABORATIONS STATE
  // ==========================================
  const [collaborations, setCollaborations] = useState<AdminCollaborationItem[]>([]);
  const [loadingCollabs, setLoadingCollabs] = useState(true);
  const [collabSearchQuery, setCollabSearchQuery] = useState('');
  const [collabStatusFilter, setCollabStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [expandedCollabId, setExpandedCollabId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AdminCollaborationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<{ [id: string]: string }>({});

  // Real-time listener for local inquiries storage (no Firestore data storage)
  useEffect(() => {
    if (!isOpen || !isCurrentAdmin) return;

    setLoadingCollabs(true);
    const unsubscribe = subscribeToInquiries((items) => {
      const formatted: AdminCollaborationItem[] = items.map((item) => ({
        id: item.id,
        recordId: item.recordId || `INQ-${item.id.slice(0, 6)}`,
        brandName: item.brandName || item.applicantName || 'Website Client',
        applicantName: item.applicantName || 'Client',
        applicantEmail: item.applicantEmail || '',
        applicantPhone: item.applicantPhone || '',
        workType: item.workType || 'Direct Inquiry',
        description: item.description || '',
        preferredContactMethod: item.preferredContactMethod || 'gmail',
        budgetTimeline: item.budgetTimeline || 'Standard',
        status: (item.status as CollaborationStatus) || 'pending',
        userId: item.userId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        reviewedAt: item.reviewedAt,
        confirmedAt: item.confirmedAt,
        adminReply: item.adminReply || '',
        collectionSource: 'inquiries',
      }));

      // Sort newest first
      formatted.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setCollaborations(formatted);
      setLoadingCollabs(false);
    });

    return () => unsubscribe();
  }, [isOpen, isCurrentAdmin]);

  // ==========================================
  // SECTION 2: MANAGE PROJECTS STATE
  // ==========================================
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => {
    if (initialProjectsProp && initialProjectsProp.length > 0) {
      return initialProjectsProp;
    }
    try {
      const saved = localStorage.getItem('rudransh_portfolio_config_v42');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projects && parsed.projects.length > 0) {
          return parsed.projects;
        }
      }
    } catch {
      // Ignore
    }
    return initialPortfolioData.projects;
  });

  // Keep projectsList synchronized with initialProjectsProp if updated from outside
  useEffect(() => {
    if (initialProjectsProp && initialProjectsProp.length > 0) {
      setProjectsList(initialProjectsProp);
    }
  }, [initialProjectsProp]);

  const [projectSectionFilter, setProjectSectionFilter] = useState<ProjectSectionKey>('all');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [projectToastMessage, setProjectToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setProjectToastMessage(msg);
    setTimeout(() => {
      setProjectToastMessage(null);
    }, 3500);
  };

  // Helper to commit changes to projects
  const commitProjectsUpdate = (newList: ProjectItem[], toastMsg?: string) => {
    setProjectsList(newList);
    if (onUpdateProjects) {
      onUpdateProjects(newList);
    } else {
      try {
        const saved = localStorage.getItem('rudransh_portfolio_config_v42');
        const parsed = saved ? JSON.parse(saved) : { ...initialPortfolioData };
        parsed.projects = newList;
        localStorage.setItem('rudransh_portfolio_config_v42', JSON.stringify(parsed));
      } catch {
        // Ignore
      }
    }
    if (toastMsg) {
      showToast(toastMsg);
    }
  };

  // Project Quick Toggles
  const handleToggleProjectVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projectsList.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p));
    const target = updated.find((p) => p.id === id);
    commitProjectsUpdate(updated, `Project "${target?.title}" is now ${target?.visible ? 'Visible' : 'Hidden'}.`);
  };

  const handleToggleProjectFeatured = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projectsList.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    const target = updated.find((p) => p.id === id);
    commitProjectsUpdate(updated, `Project "${target?.title}" is now ${target?.featured ? 'Featured' : 'Standard'}.`);
  };

  const handleDeleteProject = (proj: ProjectItem) => {
    const updated = projectsList.filter((p) => p.id !== proj.id);
    commitProjectsUpdate(updated, `Deleted project "${proj.title}".`);
    setProjectToDelete(null);
  };

  // Save edited or newly created project
  const handleSaveProjectForm = (savedProject: ProjectItem) => {
    let updated: ProjectItem[];
    if (isAddingProject) {
      updated = [savedProject, ...projectsList];
      showToast(`Created new project "${savedProject.title}"!`);
    } else {
      updated = projectsList.map((p) => (p.id === savedProject.id ? savedProject : p));
      showToast(`Updated project "${savedProject.title}".`);
    }
    commitProjectsUpdate(updated);
    setEditingProject(null);
    setIsAddingProject(false);
  };

  // Group projects into the 4 requested sections
  const categorizedProjects = useMemo(() => {
    const fashion = projectsList.filter((p) => getSectionForCategory(p.category) === 'fashion');
    const product = projectsList.filter((p) => getSectionForCategory(p.category) === 'product');
    const ugc = projectsList.filter((p) => getSectionForCategory(p.category) === 'ugc');
    const campaigns = projectsList.filter((p) => getSectionForCategory(p.category) === 'campaigns');

    return { fashion, product, ugc, campaigns };
  }, [projectsList]);

  if (!isOpen) return null;

  // In-modal Login for Admin
  const handleModalAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginEmail.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError('Only administrator email can access this portal.');
      return;
    }

    if (loginPass.trim() !== ADMIN_PASS) {
      setLoginError('Incorrect admin password. Access denied.');
      return;
    }

    setIsLoggingIn(true);
    try {
      localStorage.setItem('rudransh_admin_authenticated', 'true');
      setLocalAdminAuth(true);

      // Local admin auth check only
      setIsLoggingIn(false);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to authenticate.');
      setIsLoggingIn(false);
    }
  };

  if (!isCurrentAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0A0D14] border border-[#1C2030] p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#9295A0] hover:text-[#F5F3EE] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile photo in smaller size in round shape, and write just below of that admin underlined */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="https://i.postimg.cc/3Jt4bwth/hero-section.jpg"
              alt="Rudransh Goyal"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full border-2 border-[#38BDF8]/60 object-cover shadow-[0_0_15px_rgba(56,189,248,0.3)] mb-1.5"
            />
            <span className="text-xs text-[#38BDF8] font-['IBM_Plex_Mono'] font-bold uppercase tracking-widest underline underline-offset-2">
              admin
            </span>
          </div>

          <h3 className="text-lg font-bold text-center text-[#F5F3EE] font-['Space_Grotesk'] mb-1">
            Admin Portal Access
          </h3>
          <p className="text-xs text-center text-[#9295A0] font-['Manrope'] mb-6">
            Please enter the administrator password to unlock collaboration and project management.
          </p>

          <form onSubmit={handleModalAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  placeholder="Enter Password..."
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676E83] hover:text-[#38BDF8]"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-[#EF4444] font-['Manrope'] text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)] disabled:opacity-60"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleAdminSignOut = async () => {
    try {
      localStorage.removeItem('rudransh_admin_authenticated');
      setLocalAdminAuth(false);
      onClose();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Collab actions
  const handleDecision = async (item: AdminCollaborationItem, newStatus: CollaborationStatus) => {
    try {
      const reply = replyText[item.id] || item.adminReply || '';
      updateInquiry(item.id, {
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminReply: reply,
      });
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveReplyOnly = async (item: AdminCollaborationItem) => {
    try {
      const reply = replyText[item.id] ?? item.adminReply ?? '';
      updateInquiry(item.id, {
        adminReply: reply,
        updatedAt: new Date().toISOString(),
      });
      setEmailStatusMessage(prev => ({ ...prev, [item.id]: 'Reply saved to database.' }));
      setTimeout(() => {
        setEmailStatusMessage(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }, 3000);
    } catch (err: any) {
      alert('Failed to save reply: ' + err.message);
    }
  };

  const handleSendEmailReply = async (item: AdminCollaborationItem) => {
    const message = (replyText[item.id] ?? item.adminReply ?? '').trim();
    if (!message) {
      alert('Please write a reply message first before sending.');
      return;
    }

    if (!item.applicantEmail) {
      alert('No email address found for this applicant.');
      return;
    }

    setSendingEmailId(item.id);
    const subject = `Re: Collaboration Inquiry [${item.recordId}] - Rudransh Goyal`;
    const fullBody = `Dear ${item.applicantName || 'Collaborator'},

${message}

--------------------------------------------------
Reference Record: ${item.recordId}
Work Category: ${item.workType}

Best regards,
Rudransh Goyal
Email: rudranshgoyal44@gmail.com`;

    try {
      try {
        const response = await fetch('/api/admin/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: item.applicantEmail,
            applicantName: item.applicantName,
            replyMessage: message,
            recordId: item.recordId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send reply via backend API');
        }
        
        setEmailStatusMessage(prev => ({ ...prev, [item.id]: `Email sent directly via backend to ${item.applicantEmail}!` }));
      } catch (gmailErr: any) {
        console.warn('Backend API failed, opening Gmail composer:', gmailErr);
        openGmailComposeWindow(item.applicantEmail, subject, fullBody);
        setEmailStatusMessage(prev => ({ ...prev, [item.id]: `Opened in Gmail for ${item.applicantEmail}` }));
      }

      updateInquiry(item.id, {
        adminReply: message,
        status: item.status === 'pending' ? 'accepted' : item.status,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setTimeout(() => {
        setEmailStatusMessage(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }, 5000);
    } catch (err: any) {
      console.error('Error sending email reply:', err);
      alert(err.message || 'Failed to send email reply.');
    } finally {
      setSendingEmailId(null);
    }
  };

  const confirmDeleteCollab = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      deleteInquiry(itemToDelete.id);
      if (expandedCollabId === itemToDelete.id) {
        setExpandedCollabId(null);
      }
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert('Failed to delete: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter collaborations
  const filteredCollabs = collaborations.filter((item) => {
    if (collabStatusFilter !== 'all' && item.status !== collabStatusFilter) {
      return false;
    }
    if (!collabSearchQuery.trim()) return true;
    const q = collabSearchQuery.toLowerCase();
    return (
      item.brandName.toLowerCase().includes(q) ||
      item.applicantName.toLowerCase().includes(q) ||
      item.applicantEmail.toLowerCase().includes(q) ||
      (item.applicantPhone && item.applicantPhone.toLowerCase().includes(q)) ||
      item.workType.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.recordId.toLowerCase().includes(q)
    );
  });

  const pendingCollabsCount = collaborations.filter((c) => c.status === 'pending').length;

  const formatDate = (val: any) => {
    if (!val) return 'Just now';
    try {
      if (typeof val === 'string' || typeof val === 'number') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
      if (val.toDate) {
        return val.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (val.seconds) {
        return new Date(val.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return 'Recent';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-5xl h-[92vh] bg-[#0A0D14] border border-[#1C2030] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
        >
          {/* Top Bar with Profile Photo, Admin Tag, Title & Global Actions */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D0F17] border-b border-[#1C2030]">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Profile Photo with underlined 'admin' label underneath */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <img
                  src="https://i.postimg.cc/3Jt4bwth/hero-section.jpg"
                  alt="Rudransh Goyal"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border-2 border-[#38BDF8]/60 object-cover shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                />
                <span className="text-[10px] text-[#38BDF8] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider underline underline-offset-2 mt-1">
                  admin
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#F5F3EE] font-['Space_Grotesk'] tracking-tight flex items-center gap-2">
                  <span>Admin Control Center</span>
                  <span className="hidden sm:inline text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
                    RUDRANSH GOYAL
                  </span>
                </h2>
                <p className="text-[11px] text-[#9295A0] font-['Manrope'] hidden sm:block">
                  Centralized portal for client inquiries and portfolio project curation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAdminSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9295A0] hover:text-[#EA4335] hover:bg-[#EA4335]/10 rounded-lg transition-colors border border-transparent hover:border-[#EA4335]/30 font-['Manrope']"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-[#9295A0] hover:bg-[#141824] hover:text-[#F5F3EE] rounded-lg transition-colors border border-transparent hover:border-[#1C2030]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TWO MAIN SECTIONS TABS: 1. Manage Collaboration, 2. Manage Projects */}
          <div className="flex items-center justify-between px-4 sm:px-6 bg-[#080A10] border-b border-[#1C2030] overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 sm:gap-2 py-2">
              {/* SECTION 1: MANAGE COLLABORATION TAB */}
              <button
                type="button"
                onClick={() => setActiveNavTab('collaborations')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs sm:text-sm font-bold transition-all ${
                  activeNavTab === 'collaborations'
                    ? 'bg-[#38BDF8] text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                    : 'text-[#9295A0] hover:text-[#F5F3EE] hover:bg-[#141824]'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>1. Manage Collaborations</span>
                <span
                  className={`text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full ${
                    activeNavTab === 'collaborations'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#1C2030] text-[#9295A0]'
                  }`}
                >
                  {collaborations.length}
                </span>
                {pendingCollabsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" title={`${pendingCollabsCount} pending`} />
                )}
              </button>

              {/* SECTION 2: MANAGE PROJECTS TAB */}
              <button
                type="button"
                onClick={() => setActiveNavTab('projects')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs sm:text-sm font-bold transition-all ${
                  activeNavTab === 'projects'
                    ? 'bg-[#38BDF8] text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                    : 'text-[#9295A0] hover:text-[#F5F3EE] hover:bg-[#141824]'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>2. Manage Projects</span>
                <span
                  className={`text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full ${
                    activeNavTab === 'projects'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#1C2030] text-[#9295A0]'
                  }`}
                >
                  {projectsList.length}
                </span>
              </button>
            </div>

            {/* Notification Toast */}
            {projectToastMessage && (
              <div className="text-[11px] font-['Manrope'] text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-lg flex items-center gap-1.5 shrink-0">
                <Check className="w-3.5 h-3.5" />
                <span>{projectToastMessage}</span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: MANAGE COLLABORATION (All details: Email, Description, Number, Name) */}
          {/* ========================================================================= */}
          {activeNavTab === 'collaborations' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#000811]">
              {/* Controls bar */}
              <div className="px-4 sm:px-6 py-3 bg-[#0D0F17] border-b border-[#1C2030] flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#676E83]" />
                  <input
                    type="text"
                    placeholder="Search by client name, email, phone, or work brief..."
                    value={collabSearchQuery}
                    onChange={(e) => setCollabSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#04060C] border border-[#1C2030] rounded-xl text-xs text-[#F5F3EE] font-['Manrope'] focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] font-['Space_Grotesk'] font-bold">
                  <button
                    onClick={() => setCollabStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      collabStatusFilter === 'all'
                        ? 'bg-[#141824] text-white border-[#38BDF8]/60'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-white'
                    }`}
                  >
                    All ({collaborations.length})
                  </button>
                  <button
                    onClick={() => setCollabStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      collabStatusFilter === 'pending'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]'
                        : 'bg-transparent text-[#F59E0B]/70 border-[#F59E0B]/30 hover:text-[#F59E0B]'
                    }`}
                  >
                    Pending ({collaborations.filter((c) => c.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setCollabStatusFilter('accepted')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      collabStatusFilter === 'accepted'
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                        : 'bg-transparent text-[#10B981]/70 border-[#10B981]/30 hover:text-[#10B981]'
                    }`}
                  >
                    Accepted ({collaborations.filter((c) => c.status === 'accepted').length})
                  </button>
                  <button
                    onClick={() => setCollabStatusFilter('declined')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      collabStatusFilter === 'declined'
                        ? 'bg-[#EA4335]/20 text-[#EA4335] border-[#EA4335]'
                        : 'bg-transparent text-[#EA4335]/70 border-[#EA4335]/30 hover:text-[#EA4335]'
                    }`}
                  >
                    Declined ({collaborations.filter((c) => c.status === 'declined').length})
                  </button>
                </div>
              </div>

              {/* Requests List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {loadingCollabs ? (
                  <div className="flex items-center justify-center h-48 text-[#9295A0] font-['Manrope'] text-sm">
                    <div className="w-5 h-5 border-2 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin mr-3" />
                    Loading collaboration requests...
                  </div>
                ) : filteredCollabs.length === 0 ? (
                  <div className="text-center py-20 text-[#676E83] bg-[#0A0D14] rounded-2xl border border-[#1C2030] border-dashed font-['Manrope'] text-sm">
                    <Briefcase className="w-8 h-8 text-[#676E83] mx-auto mb-2 opacity-50" />
                    <p className="text-base font-bold text-[#9295A0] mb-1">No requests found</p>
                    <p className="text-xs">
                      {collabSearchQuery
                        ? 'Try modifying your search keywords or filter.'
                        : 'Submissions from clients will appear here automatically in real time.'}
                    </p>
                  </div>
                ) : (
                  filteredCollabs.map((item) => {
                    const isExpanded = expandedCollabId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-[#0D0F17] border border-[#1C2030] hover:border-[#2A334A] rounded-2xl overflow-hidden transition-all shadow-lg"
                      >
                        {/* Request Card Header */}
                        <div
                          onClick={() => setExpandedCollabId(isExpanded ? null : item.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer group bg-gradient-to-r from-transparent via-[#141824]/20 to-transparent"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {/* Client / Applicant Name */}
                              <h3 className="text-base font-bold text-[#F5F3EE] font-['Space_Grotesk'] tracking-tight">
                                {item.applicantName || item.brandName}
                              </h3>

                              {/* Work Type */}
                              <span className="text-xs text-[#38BDF8] px-2.5 py-0.5 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/30 font-['Space_Grotesk'] font-medium">
                                {item.workType}
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[9px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider shrink-0 ${
                                  item.status === 'pending'
                                    ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                                    : item.status === 'accepted'
                                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                    : 'bg-[#EA4335]/15 text-[#EA4335] border border-[#EA4335]/30'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            {/* Client Contact Meta Bar */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9295A0] font-['Manrope']">
                              <span className="flex items-center gap-1.5 text-[#F5F3EE]">
                                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                                {item.applicantEmail || 'No email provided'}
                              </span>

                              {item.applicantPhone && (
                                <span className="flex items-center gap-1.5 text-[#10B981]">
                                  <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                                  {item.applicantPhone}
                                </span>
                              )}

                              <span className="flex items-center gap-1 text-[#676E83]">
                                <Clock className="w-3 h-3" />
                                {formatDate(item.createdAt)}
                              </span>

                              <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#676E83]">
                                {item.recordId}
                              </span>

                              {item.adminReply && (
                                <span className="text-[11px] text-[#38BDF8] font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Replied
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="p-2 rounded-xl bg-[#141824] group-hover:bg-[#1E2436] text-[#9295A0] group-hover:text-white transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Collapsed / Expanded Body with FULL DETAILS */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-[#1C2030]"
                            >
                              <div className="p-5 bg-[#080A10] space-y-5">
                                {/* Detailed Information Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#04060C] p-4 rounded-xl border border-[#1C2030]">
                                  <div>
                                    <span className="text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#676E83] block mb-1">
                                      Applicant / Brand Name
                                    </span>
                                    <p className="text-xs font-bold text-[#F5F3EE] font-['Space_Grotesk']">
                                      {item.applicantName || item.brandName}
                                    </p>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#676E83] block mb-1">
                                      Email Address
                                    </span>
                                    <a
                                      href={`mailto:${item.applicantEmail}`}
                                      className="text-xs text-[#38BDF8] hover:underline font-['Manrope'] font-medium truncate block"
                                    >
                                      {item.applicantEmail || 'Not provided'}
                                    </a>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#676E83] block mb-1">
                                      Phone / WhatsApp Number
                                    </span>
                                    <p className="text-xs text-[#10B981] font-['Manrope'] font-semibold">
                                      {item.applicantPhone || 'Not provided'}
                                    </p>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#676E83] block mb-1">
                                      Service & Timeline
                                    </span>
                                    <p className="text-xs text-[#F5F3EE] font-['Manrope']">
                                      {item.workType} • {item.budgetTimeline || 'Standard'}
                                    </p>
                                  </div>
                                </div>

                                {/* Full Project Description / Brief */}
                                <div>
                                  <label className="text-[10px] font-bold text-[#7B8092] uppercase tracking-wider font-['IBM_Plex_Mono'] block mb-1.5 flex items-center justify-between">
                                    <span>FULL PROJECT BRIEF / CLIENT DESCRIPTION</span>
                                    <span className="text-[#38BDF8] font-mono font-normal">Original submission</span>
                                  </label>
                                  <div className="p-4 bg-[#0A0D14] rounded-xl border border-[#1C2030] text-xs text-[#F5F3EE] font-['Manrope'] leading-relaxed shadow-inner">
                                    <p className="whitespace-pre-wrap">{item.description || 'No description provided.'}</p>
                                  </div>
                                </div>

                                {/* Action & Reply Composer Section */}
                                <div className="bg-[#0D0F17] p-4 rounded-xl border border-[#1C2030] space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-[#7B8092] uppercase tracking-wider font-['IBM_Plex_Mono']">
                                      ADMIN REPLY / CLIENT COMMUNICATION
                                    </label>
                                    <span className="text-[10px] text-[#38BDF8] font-mono">
                                      Direct email response to applicant
                                    </span>
                                  </div>

                                  <textarea
                                    className="w-full min-h-[90px] p-3 bg-[#04060C] border border-[#1C2030] rounded-xl text-xs text-[#F5F3EE] font-['Manrope'] resize-none focus:outline-none focus:border-[#38BDF8] transition-colors"
                                    placeholder="Write your feedback, quote, or project acceptance note to the client..."
                                    value={replyText[item.id] ?? item.adminReply ?? ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setReplyText((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                  />

                                  {emailStatusMessage[item.id] && (
                                    <div className="text-xs text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 p-2.5 rounded-lg flex items-center gap-1.5 font-['Manrope']">
                                      <Check className="w-4 h-4 shrink-0" />
                                      <span>{emailStatusMessage[item.id]}</span>
                                    </div>
                                  )}

                                  {/* Action Buttons Row */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                    {/* Left: Email dispatch and save */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSendEmailReply(item);
                                        }}
                                        disabled={sendingEmailId === item.id}
                                        className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white rounded-xl text-xs font-bold font-['Space_Grotesk'] tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)] disabled:opacity-60"
                                      >
                                        {sendingEmailId === item.id ? (
                                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                          <Send className="w-3.5 h-3.5" />
                                        )}
                                        <span>Send Email Reply</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSaveReplyOnly(item);
                                        }}
                                        className="px-3 py-2 bg-[#141824] hover:bg-[#1E2436] text-[#9295A0] hover:text-[#F5F3EE] border border-[#1C2030] rounded-xl text-xs font-semibold transition-colors"
                                      >
                                        Save Note
                                      </button>

                                      <a
                                        href={`mailto:${item.applicantEmail}?subject=Re: Project Inquiry (${item.recordId})&body=${encodeURIComponent(
                                          replyText[item.id] || item.adminReply || ''
                                        )}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 bg-[#141824] hover:bg-[#1E2436] text-[#9295A0] hover:text-[#38BDF8] border border-[#1C2030] rounded-xl transition-colors"
                                        title="Open in native email client"
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                      </a>
                                    </div>

                                    {/* Right: Decision controls */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDecision(item, 'accepted');
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 ${
                                          item.status === 'accepted'
                                            ? 'bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                            : 'bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30'
                                        }`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Accept</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDecision(item, 'declined');
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all flex items-center gap-1.5 ${
                                          item.status === 'declined'
                                            ? 'bg-[#EA4335] text-white shadow-[0_0_12px_rgba(234,67,53,0.4)]'
                                            : 'bg-[#EA4335]/15 hover:bg-[#EA4335]/25 text-[#EA4335] border border-[#EA4335]/30'
                                        }`}
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>Decline</span>
                                      </button>

                                      {item.status !== 'pending' && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDecision(item, 'pending');
                                          }}
                                          className="p-2 bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/30 rounded-xl transition-colors"
                                          title="Reset status to Pending"
                                        >
                                          <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setItemToDelete(item);
                                        }}
                                        className="p-2 bg-[#EA4335]/15 hover:bg-[#EA4335]/25 text-[#EA4335] border border-[#EA4335]/30 rounded-xl transition-colors"
                                        title="Permanently delete request"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MANAGE PROJECTS (Separated into proper sections: Fashion, Product, UGC, Ad Campaigns) */}
          {/* ========================================================================= */}
          {activeNavTab === 'projects' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#000811]">
              {/* Category Filter Pills & Search */}
              <div className="px-4 sm:px-6 py-3 bg-[#0D0F17] border-b border-[#1C2030] flex flex-wrap items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#676E83]" />
                  <input
                    type="text"
                    placeholder="Search projects by title, brand, or tools..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#04060C] border border-[#1C2030] rounded-xl text-xs text-[#F5F3EE] font-['Manrope'] focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                {/* Section Filter Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs font-['Space_Grotesk'] font-bold">
                  <button
                    onClick={() => setProjectSectionFilter('all')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      projectSectionFilter === 'all'
                        ? 'bg-[#141824] text-white border-[#38BDF8]/60 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-white'
                    }`}
                  >
                    All Sections ({projectsList.length})
                  </button>

                  <button
                    onClick={() => setProjectSectionFilter('fashion')}
                    className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      projectSectionFilter === 'fashion'
                        ? 'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-[#F43F5E]'
                    }`}
                  >
                    <span>Fashion</span>
                    <span className="text-[10px] font-mono opacity-80">({categorizedProjects.fashion.length})</span>
                  </button>

                  <button
                    onClick={() => setProjectSectionFilter('product')}
                    className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      projectSectionFilter === 'product'
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-[#10B981]'
                    }`}
                  >
                    <span>Product</span>
                    <span className="text-[10px] font-mono opacity-80">({categorizedProjects.product.length})</span>
                  </button>

                  <button
                    onClick={() => setProjectSectionFilter('ugc')}
                    className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      projectSectionFilter === 'ugc'
                        ? 'bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-[#A855F7]'
                    }`}
                  >
                    <span>UGC</span>
                    <span className="text-[10px] font-mono opacity-80">({categorizedProjects.ugc.length})</span>
                  </button>

                  <button
                    onClick={() => setProjectSectionFilter('campaigns')}
                    className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      projectSectionFilter === 'campaigns'
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                        : 'bg-transparent text-[#9295A0] border-[#1C2030] hover:text-[#38BDF8]'
                    }`}
                  >
                    <span>Ad Campaigns</span>
                    <span className="text-[10px] font-mono opacity-80">({categorizedProjects.campaigns.length})</span>
                  </button>

                  {/* Add New Project Button */}
                  <button
                    onClick={() => {
                      setIsAddingProject(true);
                      setEditingProject({
                        id: `project-${Date.now()}`,
                        title: 'New Creative Project',
                        category: projectSectionFilter === 'all' ? 'fashion-visuals' : (
                          projectSectionFilter === 'fashion' ? 'fashion-visuals' :
                          projectSectionFilter === 'product' ? 'product-visuals' :
                          projectSectionFilter === 'ugc' ? 'ugc' : 'campaigns'
                        ),
                        categoryLabel: 'Creative Portfolio Work',
                        shortDescription: 'Project overview and creative scope',
                        fullDescription: 'Detailed breakdown of the project, deliverables, and direction.',
                        creativeDirection: 'Editorial Art Direction & AI Production',
                        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
                        videoUrl: '',
                        reelUrl: '',
                        thumbnailUrl: '',
                        toolsUsed: ['Midjourney', 'Premiere Pro'],
                        clientOrBrand: 'Client / Brand Name',
                        featured: true,
                        visible: true,
                        displayOrder: projectsList.length + 1,
                      });
                    }}
                    className="ml-auto px-3.5 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Container - Rendered by Sections */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
                {PROJECT_SECTIONS_CONFIG.map((sec) => {
                  // If filter is active and doesn't match, skip
                  if (projectSectionFilter !== 'all' && projectSectionFilter !== sec.key) {
                    return null;
                  }

                  // Projects belonging to this section
                  let sectionProjects = categorizedProjects[sec.key];

                  // Apply search filter if typed
                  if (projectSearchQuery.trim()) {
                    const q = projectSearchQuery.toLowerCase();
                    sectionProjects = sectionProjects.filter(
                      (p) =>
                        p.title.toLowerCase().includes(q) ||
                        p.shortDescription.toLowerCase().includes(q) ||
                        (p.clientOrBrand && p.clientOrBrand.toLowerCase().includes(q)) ||
                        (p.toolsUsed && p.toolsUsed.some((t) => t.toLowerCase().includes(q)))
                    );
                  }

                  return (
                    <div key={sec.key} className="space-y-4">
                      {/* Section Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1C2030]">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: sec.accent, boxShadow: `0 0 10px ${sec.accent}66` }}
                          />
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#F5F3EE] font-['Space_Grotesk'] flex items-center gap-2">
                              <span>{sec.title}</span>
                              <span
                                className="text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full border uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${sec.accent}15`,
                                  color: sec.accent,
                                  borderColor: `${sec.accent}40`,
                                }}
                              >
                                {sectionProjects.length} Works
                              </span>
                            </h3>
                            <p className="text-xs text-[#9295A0] font-['Manrope']">{sec.tagline}</p>
                          </div>
                        </div>

                        {/* Add to this section button */}
                        <button
                          onClick={() => {
                            setIsAddingProject(true);
                            setEditingProject({
                              id: `project-${Date.now()}`,
                              title: `New ${sec.title.split(' ')[0]} Work`,
                              category: sec.categoryIds[0],
                              categoryLabel: sec.title,
                              shortDescription: 'Project brief and narrative summary',
                              fullDescription: 'Comprehensive creative direction, execution details, and deliverable specs.',
                              creativeDirection: 'Editorial Art Direction & Visual Craft',
                              imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
                              videoUrl: '',
                              reelUrl: '',
                              thumbnailUrl: '',
                              toolsUsed: ['Midjourney', 'Premiere Pro'],
                              clientOrBrand: 'Brand / Partner',
                              featured: true,
                              visible: true,
                              displayOrder: projectsList.length + 1,
                            });
                          }}
                          className="text-[11px] font-['Space_Grotesk'] font-bold text-[#9295A0] hover:text-white px-2.5 py-1 rounded-lg bg-[#141824] hover:bg-[#1E2436] border border-[#1C2030] transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to {sec.title.split(' ')[0]}</span>
                        </button>
                      </div>

                      {/* Projects Grid for this Section */}
                      {sectionProjects.length === 0 ? (
                        <div className="p-8 text-center bg-[#070910] rounded-xl border border-[#1C2030] border-dashed text-xs text-[#676E83] font-['Manrope']">
                          No projects found in this section matching your search.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sectionProjects.map((proj) => (
                            <div
                              key={proj.id}
                              className="bg-[#0D0F17] border border-[#1C2030] hover:border-[#2A334A] rounded-2xl overflow-hidden transition-all flex flex-col group shadow-lg"
                            >
                              {/* Media Preview Box */}
                              <div className="relative aspect-[16/10] bg-[#020408] overflow-hidden">
                                {proj.imageUrl ? (
                                  <img
                                    src={proj.imageUrl}
                                    alt={proj.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#676E83]">
                                    <ImageIcon className="w-8 h-8 opacity-40" />
                                  </div>
                                )}

                                {/* Video indicator pill */}
                                {(proj.videoUrl || proj.reelUrl) && (
                                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/40 text-[10px] font-['IBM_Plex_Mono'] font-bold flex items-center gap-1 shadow-md">
                                    <Play className="w-2.5 h-2.5 fill-current" />
                                    <span>VIDEO REEL</span>
                                  </div>
                                )}

                                {/* Visibility & Featured Status Badges */}
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                  {proj.featured && (
                                    <span className="p-1 rounded-md bg-[#F59E0B]/85 text-black" title="Featured Project">
                                      <Star className="w-3 h-3 fill-current" />
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[9px] font-['IBM_Plex_Mono'] font-bold uppercase backdrop-blur-md ${
                                      proj.visible
                                        ? 'bg-[#10B981]/80 text-white'
                                        : 'bg-[#EA4335]/80 text-white'
                                    }`}
                                  >
                                    {proj.visible ? 'VISIBLE' : 'HIDDEN'}
                                  </span>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-['IBM_Plex_Mono'] text-[#38BDF8] uppercase tracking-wider">
                                      {proj.category}
                                    </span>
                                    {proj.clientOrBrand && (
                                      <span className="text-[10px] text-[#9295A0] font-['Space_Grotesk'] truncate max-w-[130px]">
                                        {proj.clientOrBrand}
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-sm font-bold text-[#F5F3EE] font-['Space_Grotesk'] line-clamp-1 mb-1.5 group-hover:text-[#38BDF8] transition-colors">
                                    {proj.title}
                                  </h4>

                                  <p className="text-xs text-[#9295A0] font-['Manrope'] line-clamp-2 leading-relaxed mb-3">
                                    {proj.shortDescription}
                                  </p>

                                  {/* Tools Used Badges */}
                                  {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {proj.toolsUsed.slice(0, 3).map((tool, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[9px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded bg-[#141824] text-[#9295A0] border border-[#1C2030]"
                                        >
                                          {tool}
                                        </span>
                                      ))}
                                      {proj.toolsUsed.length > 3 && (
                                        <span className="text-[9px] font-['IBM_Plex_Mono'] px-1.5 py-0.5 rounded text-[#676E83]">
                                          +{proj.toolsUsed.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Project Action Row */}
                                <div className="pt-3 border-t border-[#1C2030] flex items-center justify-between gap-1.5">
                                  {/* Edit button */}
                                  <button
                                    onClick={() => {
                                      setIsAddingProject(false);
                                      setEditingProject({ ...proj });
                                    }}
                                    className="flex-1 py-1.5 px-2 bg-[#141824] hover:bg-[#1E2436] text-[#F5F3EE] rounded-lg text-xs font-['Space_Grotesk'] font-bold transition-colors flex items-center justify-center gap-1.5"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Toggle Visibility */}
                                  <button
                                    onClick={(e) => handleToggleProjectVisibility(proj.id, e)}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      proj.visible
                                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/25'
                                        : 'bg-[#EA4335]/15 text-[#EA4335] border-[#EA4335]/30 hover:bg-[#EA4335]/25'
                                    }`}
                                    title={proj.visible ? 'Hide from portfolio' : 'Show on portfolio'}
                                  >
                                    {proj.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>

                                  {/* Toggle Featured */}
                                  <button
                                    onClick={(e) => handleToggleProjectFeatured(proj.id, e)}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      proj.featured
                                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                                        : 'bg-[#141824] text-[#676E83] border-[#1C2030] hover:text-[#F59E0B]'
                                    }`}
                                    title={proj.featured ? 'Remove from featured' : 'Mark as featured'}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-current' : ''}`} />
                                  </button>

                                  {/* Delete Project */}
                                  <button
                                    onClick={() => setProjectToDelete(proj)}
                                    className="p-1.5 bg-[#EA4335]/15 hover:bg-[#EA4335]/25 text-[#EA4335] border border-[#EA4335]/30 rounded-lg transition-colors"
                                    title="Delete project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* EDIT / ADD PROJECT MODAL DIALOG */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {editingProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-[#0A0D14] border border-[#1C2030] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 bg-[#0D0F17] border-b border-[#1C2030]">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#38BDF8]" />
                      <h3 className="text-base font-bold text-[#F5F3EE] font-['Space_Grotesk']">
                        {isAddingProject ? 'Add New Project' : 'Edit Project Details'}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setIsAddingProject(false);
                      }}
                      className="p-1 text-[#9295A0] hover:text-white rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProjectForm(editingProject);
                    }}
                    className="flex-1 overflow-y-auto p-5 space-y-4"
                  >
                    {/* Title */}
                    <div>
                      <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                        Project Title <span className="text-[#38BDF8]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    {/* Category & Section selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                          Portfolio Section & Category <span className="text-[#38BDF8]">*</span>
                        </label>
                        <select
                          value={editingProject.category}
                          onChange={(e) => {
                            const newCat = e.target.value as CategoryId;
                            const opt = CATEGORY_OPTIONS.find((o) => o.id === newCat);
                            setEditingProject({
                              ...editingProject,
                              category: newCat,
                              categoryLabel: opt ? opt.label : newCat,
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                        >
                          <optgroup label="Fashion Section">
                            <option value="fashion-visuals">Fashion Visuals (Editorial)</option>
                            <option value="fashion-ads">Fashion Ads (Films)</option>
                          </optgroup>
                          <optgroup label="Product Section">
                            <option value="product-visuals">Product Visuals</option>
                            <option value="product-ads">Product Ads (Commercial)</option>
                            <option value="jewellery-ads">Jewellery Ad Campaigns</option>
                          </optgroup>
                          <optgroup label="UGC Section">
                            <option value="ugc">UGC & Social Ads</option>
                          </optgroup>
                          <optgroup label="Ad Campaigns Section">
                            <option value="campaigns">Brand Ad Campaigns</option>
                            <option value="videos">AI Storyworlds & Narrative Films</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                          Client / Brand Name
                        </label>
                        <input
                          type="text"
                          value={editingProject.clientOrBrand || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, clientOrBrand: e.target.value })}
                          placeholder="e.g. Sabyasachi, L'Oréal, Zara"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>
                    </div>

                    {/* Image URL & Video / Reel URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                          Hero Image / Thumbnail URL <span className="text-[#38BDF8]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={editingProject.imageUrl}
                          onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                          Video / Reel URL (MP4 / Direct Link)
                        </label>
                        <input
                          type="url"
                          value={editingProject.videoUrl || editingProject.reelUrl || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              videoUrl: e.target.value,
                              reelUrl: e.target.value,
                            })
                          }
                          placeholder="https://...mp4 or stream link"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={editingProject.shortDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    {/* Full Description */}
                    <div>
                      <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                        Full Description / Creative Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.fullDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    {/* Tools Used */}
                    <div>
                      <label className="block text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider text-[#7B8092] mb-1.5">
                        Tools Used (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={(editingProject.toolsUsed || []).join(', ')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            toolsUsed: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Midjourney, Premiere Pro, After Effects, ComfyUI"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#04060C] border border-[#1C2030] text-[#F5F3EE] text-xs font-['Manrope'] focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    {/* Toggles: Visible & Featured */}
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.visible}
                          onChange={(e) => setEditingProject({ ...editingProject, visible: e.target.checked })}
                          className="w-4 h-4 rounded text-[#38BDF8] focus:ring-0 focus:outline-none accent-[#38BDF8]"
                        />
                        <span className="text-xs text-[#F5F3EE] font-['Manrope']">Visible on Live Portfolio</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#F59E0B] focus:ring-0 focus:outline-none accent-[#F59E0B]"
                        />
                        <span className="text-xs text-[#F5F3EE] font-['Manrope']">Mark as Featured Work</span>
                      </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C2030]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsAddingProject(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1E2436] text-[#9295A0] text-xs font-bold font-['Space_Grotesk']"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* CONFIRM DELETE MODAL (COLLABORATION) */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {itemToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0A0D14] border border-[#1C2030] p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl relative"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EA4335]/15 text-[#EA4335] flex items-center justify-center mx-auto mb-4 border border-[#EA4335]/30">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#F5F3EE] font-['Space_Grotesk'] mb-2">Delete Collaboration Request?</h3>
                  <p className="text-xs text-[#9295A0] font-['Manrope'] mb-6 leading-relaxed">
                    Are you sure you want to permanently delete the inquiry from{' '}
                    <strong className="text-white">{itemToDelete.applicantName}</strong> ({itemToDelete.recordId})?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setItemToDelete(null)}
                      disabled={isDeleting}
                      className="flex-1 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2030] text-[#9295A0] hover:text-white text-xs font-bold font-['Space_Grotesk'] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteCollab}
                      disabled={isDeleting}
                      className="flex-1 py-2.5 rounded-xl bg-[#EA4335] hover:bg-[#DC2626] text-white text-xs font-bold font-['Space_Grotesk'] transition-colors shadow-[0_0_15px_rgba(234,67,53,0.3)] disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Yes, Delete'
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* CONFIRM DELETE MODAL (PROJECT) */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {projectToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0A0D14] border border-[#1C2030] p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl relative"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EA4335]/15 text-[#EA4335] flex items-center justify-center mx-auto mb-4 border border-[#EA4335]/30">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#F5F3EE] font-['Space_Grotesk'] mb-2">Delete Portfolio Project?</h3>
                  <p className="text-xs text-[#9295A0] font-['Manrope'] mb-6 leading-relaxed">
                    Are you sure you want to remove <strong className="text-white">"{projectToDelete.title}"</strong> from your portfolio?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setProjectToDelete(null)}
                      className="flex-1 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2030] text-[#9295A0] hover:text-white text-xs font-bold font-['Space_Grotesk'] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteProject(projectToDelete)}
                      className="flex-1 py-2.5 rounded-xl bg-[#EA4335] hover:bg-[#DC2626] text-white text-xs font-bold font-['Space_Grotesk'] transition-colors shadow-[0_0_15px_rgba(234,67,53,0.3)]"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
