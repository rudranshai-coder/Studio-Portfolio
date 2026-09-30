import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Calendar,
  Sparkles,
  Building2,
  Mail,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CollaborationRecord } from '../types';
import { initialPortfolioData } from '../data/portfolioData';
import { subscribeToInquiries } from '../services/inquiriesStorage';

interface ApplicantInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantInquiriesModal: React.FC<ApplicantInquiriesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<CollaborationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInquiries([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToInquiries((all) => {
      // Show user's inquiries or all locally sent inquiries if user matches or anonymous
      const filtered = all.filter((item) => {
        if (!user) return true;
        if (!item.applicantEmail) return true;
        return (
          item.userId === user.uid ||
          item.applicantEmail.toLowerCase() === (user.email || '').toLowerCase()
        );
      });
      setInquiries(filtered.length > 0 ? filtered : all);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp?: any) => {
    if (!timestamp) return 'Just now';
    try {
      if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      }
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      // fallback
    }
    return 'Recently';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#080B14] border border-[#1E2538] shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-8 max-h-[88vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#121624] text-[#9295A0] hover:text-white hover:bg-[#1A2136] transition-colors z-20 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[#141A2B] bg-[#0A0E1A]">
            <div className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[11px] text-[#38BDF8] tracking-widest uppercase font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STORED FIRESTORE COLLECTION: collaboration_requests</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F3EE]">
              My Stored Collaboration Requests
            </h3>
            <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0]">
              Track your submitted briefs, unique record IDs, and confirmation status from Rudransh Goyal.
            </p>
          </div>

          {/* List Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
            {loading ? (
              <div className="py-12 text-center text-[#9295A0] font-['IBM_Plex_Mono'] text-sm animate-pulse">
                Fetching collaboration records from Firestore database...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#121624] text-[#676E83] flex items-center justify-center mx-auto">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE]">
                  No Collaborations Recorded Yet
                </h4>
                <p className="font-['Manrope'] text-xs text-[#9295A0] max-w-sm mx-auto">
                  Submit a brief in the collaboration section to store your project details in Firebase and receive confirmation from Rudransh.
                </p>
              </div>
            ) : (
              inquiries.map((item, idx) => (
                <div
                  key={`applicant-inq-${item.id || item.recordId}-${idx}`}
                  className={`p-5 rounded-2xl bg-[#0C101D] border transition-all space-y-3.5 ${
                    item.status === 'accepted'
                      ? 'border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                      : item.status === 'declined'
                      ? 'border-[#EF4444]/40'
                      : 'border-[#1C243B] hover:border-[#38BDF8]/40'
                  }`}
                >
                  {/* Top Bar: Brand, Work Type & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Record ID Chip */}
                      <button
                        type="button"
                        onClick={() => handleCopy(item.recordId, item.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] font-['IBM_Plex_Mono'] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Click to copy Record ID"
                      >
                        <span>{item.recordId}</span>
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#38BDF8]/70" />
                        )}
                      </button>

                      {/* Brand Name Tag */}
                      <div className="px-2.5 py-1 rounded-lg bg-[#151C2F] border border-[#222E4E] text-[#F5F3EE] font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>{item.brandName}</span>
                      </div>

                      {/* Work Type */}
                      <span className="px-2.5 py-1 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 font-['Space_Grotesk'] text-xs font-medium">
                        {item.workType}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {item.status === 'accepted' ? (
                        <span className="px-3 py-1 rounded-lg bg-[#10B981]/20 text-[#10B981] font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold flex items-center gap-1.5 border border-[#10B981]/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accepted by Rudransh</span>
                        </span>
                      ) : item.status === 'declined' ? (
                        <span className="px-3 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold flex items-center gap-1.5 border border-[#EF4444]/40">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] font-['IBM_Plex_Mono'] text-[10px] uppercase font-semibold flex items-center gap-1.5 border border-[#F59E0B]/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted but Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-[10px] uppercase text-[#7B8092] tracking-wider mb-1">
                      Project Description &amp; Scope:
                    </div>
                    <p className="font-['Manrope'] text-sm text-[#E2E8F0] whitespace-pre-line bg-[#060810] p-3.5 rounded-xl border border-[#141B2D] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Official Response from Admin (if accepted, declined, or replied) */}
                  {(item.adminReply || item.confirmationMessage) && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#081020] to-[#040814] border border-[#38BDF8]/40 shadow-[0_4px_20px_rgba(56,189,248,0.12)] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#1E2C4A]">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={initialPortfolioData.profileImageUrl}
                              alt="Rudransh Goyal - Admin"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#10B981] shadow-sm"
                            />
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black/85 text-[8px] font-['IBM_Plex_Mono'] uppercase font-bold text-[#10B981] border border-[#10B981]/40">
                              Admin
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#F5F3EE]">
                                Rudransh Goyal
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-['IBM_Plex_Mono'] text-[9px] uppercase font-bold">
                                Official Response
                              </span>
                            </div>
                            <p className="font-['IBM_Plex_Mono'] text-[10px] text-[#7B8092]">
                              {item.confirmationChannel ? `Dispatched via ${item.confirmationChannel.toUpperCase()}` : 'Direct Portfolio Dispatch'}
                              {item.confirmedAt || item.reviewedAt || item.replyTimestamp ? ` • ${formatDate(item.replyTimestamp || item.confirmedAt || item.reviewedAt)}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'accepted' && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Accepted
                            </span>
                          )}
                          {item.status === 'declined' && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Declined
                            </span>
                          )}
                          {item.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              In Discussion
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#03060F] p-3.5 rounded-xl border border-[#16213A]">
                        <p className="font-['Manrope'] text-sm text-[#E2E8F0] whitespace-pre-line leading-relaxed">
                          {item.adminReply || item.confirmationMessage}
                        </p>
                      </div>

                      {/* Direct Follow-up Action Buttons for the requester */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <span className="text-[#7B8092] font-['IBM_Plex_Mono'] text-[10.5px]">
                          Connect directly with Rudransh:
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:rudranshgoyal44@gmail.com?subject=${encodeURIComponent(`Follow-up on [${item.recordId}]: ${item.workType}`)}`}
                            className="px-2.5 py-1.5 rounded-lg bg-[#EA4335]/15 hover:bg-[#EA4335]/25 border border-[#EA4335]/30 text-[#EA4335] font-['IBM_Plex_Mono'] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email</span>
                          </a>
                          <a
                            href="https://wa.me/917874417797"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[#10B981] font-['IBM_Plex_Mono'] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-['IBM_Plex_Mono'] text-[#7B8092] pt-1 border-t border-[#131A2B]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Applicant: <strong className="text-[#F5F3EE]">{item.applicantName}</strong></span>
                      <span>Email: <strong className="text-[#38BDF8]">{item.applicantEmail}</strong></span>
                      <span>Requested Reply: <strong className="uppercase text-[#F5F3EE]">{item.preferredContactMethod}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#676E83]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-[#141A2B] bg-[#060912] flex items-center justify-between text-xs font-['IBM_Plex_Mono'] text-[#7B8092]">
            <span>Total Stored Records: {inquiries.length}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141A2B] hover:bg-[#1E263D] text-[#F5F3EE] font-['Space_Grotesk'] font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

