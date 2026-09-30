import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Check,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ContactInfo, SocialLink } from '../types';
import { gsap } from '../utils/gsapSetup';
import { sendEmailViaGmailApi, openGmailComposeWindow, getDirectGmailComposeUrl } from '../services/gmail';
import { saveInquiry } from '../services/inquiriesStorage';

const ADMIN_EMAIL = 'rudranshgoyal44@gmail.com';
const ADMIN_PASS = 'Fantastic Force 11';

export const WORK_OPTIONS = [
  'Fashion Ads / Visuals',
  'Product Ads / Visuals',
  'UGC Ads',
  'Storytelling',
  'Commercial Campaigns',
  'Brand Identity & Visuals',
  'AI Creative Direction',
  'Video Production / Edits',
];

interface ContactSectionProps {
  headline: string;
  contact: ContactInfo;
  socialLinks: SocialLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  headline,
  contact,
  socialLinks,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formBoxRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    workType: 'Fashion Ads / Visuals',
    message: '',
  });

  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [adminAuthSuccess, setAdminAuthSuccess] = useState(false);
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);

  const isAdminEmailEntered = formState.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (formBoxRef.current) {
        gsap.fromTo(
          formBoxRef.current,
          { opacity: 0, x: 30, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formBoxRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAdminLogin = async () => {
    setAdminAuthError(null);
    if (!adminPassword) {
      setAdminAuthError('Please enter your admin password.');
      return;
    }

    if (adminPassword.trim() !== ADMIN_PASS) {
      setAdminAuthError('Incorrect admin password. Access denied.');
      return;
    }

    setIsAdminLoggingIn(true);
    try {
      localStorage.setItem('rudransh_admin_authenticated', 'true');

      setAdminAuthSuccess(true);
      setTimeout(() => {
        window.location.hash = '#admin';
        window.dispatchEvent(new CustomEvent('open-admin-portal'));
        setIsAdminLoggingIn(false);
      }, 400);
    } catch (err: any) {
      setAdminAuthError(err?.message || 'Failed to authenticate admin.');
      setIsAdminLoggingIn(false);
    }
  };

  const [sendMethodUsed, setSendMethodUsed] = useState<'api' | 'web'>('api');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdminEmailEntered) {
      handleAdminLogin();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    
    const subject = `New Project Collaboration Brief [${formState.workType || 'Creative Inquiry'}] from ${formState.name}`;
    const emailBody = `New Creative Project Collaboration Brief:
--------------------------------------------------
Applicant Name: ${formState.name}
Official Email: ${formState.email}
Contact Number: ${formState.phone || 'Not provided'}
Selected Work Category: ${formState.workType || 'General Inquiry'}

Project Scope & Description:
${formState.message}
--------------------------------------------------
Sent directly via Gmail to Rudransh Goyal (rudranshgoyal44@gmail.com)`;

    // 1. Store inquiry locally (no Firebase database storage)
    const generatedId = Math.random().toString(36).substring(2, 7).toUpperCase();
    saveInquiry({
      recordId: `REQ-2026-${generatedId}`,
      brandName: formState.name || 'Direct Client',
      applicantName: formState.name,
      applicantEmail: formState.email,
      applicantPhone: formState.phone,
      workType: formState.workType,
      description: formState.message,
      preferredContactMethod: 'gmail',
      budgetTimeline: 'Standard',
      status: 'pending',
    });

    // 2. Directly send via backend API (Nodemailer/Resend)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          workType: formState.workType,
          message: formState.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message via backend API');
      }
      setSendMethodUsed('api');
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', workType: 'Fashion Ads / Visuals', message: '' });
    } catch (err: any) {
      console.warn('Backend API failed, providing 1-click Gmail composer fallback:', err);
      // Fallback: directly launch official Gmail web composer with all fields prefilled
      openGmailComposeWindow(ADMIN_EMAIL, subject, emailBody);
      setSendMethodUsed('web');
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', workType: 'Fashion Ads / Visuals', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualOpenGmail = () => {
    const subject = `New Project Collaboration Brief [${formState.workType || 'Creative Inquiry'}] from ${formState.name || 'Client'}`;
    const emailBody = `New Creative Project Collaboration Brief:
--------------------------------------------------
Applicant Name: ${formState.name || 'Not provided'}
Official Email: ${formState.email || 'Not provided'}
Contact Number: ${formState.phone || 'Not provided'}
Selected Work Category: ${formState.workType || 'General Inquiry'}

Project Scope & Description:
${formState.message || 'I would like to discuss a project collaboration.'}
--------------------------------------------------
Recipient: rudranshgoyal44@gmail.com`;

    openGmailComposeWindow(ADMIN_EMAIL, subject, emailBody);
  };

  const renderSocialIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'Instagram':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'Facebook':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      id="contact"
      className="relative py-24 sm:py-32 bg-[#030508] overflow-hidden border-t border-[#141B2D]"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030508] via-[#060913] to-[#030508]" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F3EE] font-['Space_Grotesk'] tracking-tight leading-[1.1]">
                {headline.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? "text-[#38BDF8]" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
              <p className="text-base sm:text-lg text-[#9295A0] font-['Manrope'] max-w-md leading-relaxed">
                Ready to bring your vision to life? Fill out the brief and we'll get back to you with a tailored strategy.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-[#080A10] border border-[#1E2336] hover:border-[#38BDF8] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#141824] flex items-center justify-center group-hover:bg-[#38BDF8]/10 transition-colors">
                  <Mail className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <div className="text-[11px] font-['IBM_Plex_Mono'] text-[#7B8092] uppercase tracking-wider mb-1">
                    Direct Email
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#F5F3EE] font-['Space_Grotesk']">
                    {contact.email}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-[#080A10] border border-[#1E2336] hover:border-[#10B981] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#141824] flex items-center justify-center group-hover:bg-[#10B981]/10 transition-colors">
                  <Phone className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[11px] font-['IBM_Plex_Mono'] text-[#7B8092] uppercase tracking-wider mb-1">
                    WhatsApp / Phone
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#F5F3EE] font-['Space_Grotesk']">
                    {contact.phone}
                  </div>
                </div>
              </a>
            </div>

            <div className="pt-8 border-t border-[#141B2D]">
              <div className="text-[11px] font-['IBM_Plex_Mono'] text-[#7B8092] uppercase tracking-wider mb-4">
                Official Channels
              </div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#080A10] border border-[#1E2336] hover:border-[#F5F3EE] text-[#9295A0] hover:text-[#F5F3EE] transition-all group"
                  >
                    {renderSocialIcon(social.platform)}
                    <span className="text-xs font-['IBM_Plex_Mono'] font-medium">{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div ref={formBoxRef} className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent rounded-3xl blur-xl" />
            <div className="relative p-6 sm:p-10 rounded-3xl bg-[#06080F]/80 backdrop-blur-md border border-[#1A2235] shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#1A2235]">
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F3EE] font-['Space_Grotesk'] flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38BDF8] rounded-full" />
                  Project Collaboration Brief
                </h3>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-['Space_Grotesk'] text-3xl font-bold text-[#F5F3EE]">
                      Brief Dispatched via Gmail!
                    </h4>
                    <p className="font-['Manrope'] text-base text-[#9295A0] max-w-md mx-auto">
                      {sendMethodUsed === 'api'
                        ? "Your project brief has been sent directly to Rudransh's Gmail (rudranshgoyal44@gmail.com). You'll receive a response shortly."
                        : "Your project details were prepared and opened in your Gmail composer to send directly to rudranshgoyal44@gmail.com."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 rounded-xl bg-[#141C30] hover:bg-[#1D2947] border border-[#283758] text-[#38BDF8] font-['Space_Grotesk'] text-sm font-semibold transition-all inline-block"
                    >
                      Submit Another Brief
                    </button>
                    <button
                      onClick={handleManualOpenGmail}
                      className="px-6 py-3 rounded-xl bg-[#EA4335]/15 hover:bg-[#EA4335]/25 border border-[#EA4335]/30 text-[#EA4335] font-['Space_Grotesk'] text-sm font-semibold transition-all inline-flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Gmail</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#7B8092] mb-2">
                        FULL NAME <span className="text-[#38BDF8]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#7B8092] mb-2">
                        CONTACT NUMBER <span className="text-[#38BDF8]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (234) 567-8900"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#7B8092] mb-2">
                      EMAIL ADDRESS <span className="text-[#38BDF8]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors shadow-inner"
                    />

                    {/* Admin Password Gate appears automatically when rudranshgoyal44@gmail.com is entered */}
                    <AnimatePresence>
                      {isAdminEmailEntered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#091122] to-[#040812] border-2 border-[#38BDF8]/60 shadow-[0_0_25px_rgba(56,189,248,0.2)] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] font-['Space_Grotesk']">
                              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                              <span>ADMIN DETECTED • RUDRANSH GOYAL</span>
                            </div>
                            <span className="text-[9px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">
                              PORTAL ACCESS
                            </span>
                          </div>

                          <p className="text-xs text-[#9295A0] font-['Manrope']">
                            Enter the administrator security password below to directly launch the Admin Management Portal.
                          </p>

                          <div className="relative">
                            <input
                              type={showAdminPassword ? 'text' : 'password'}
                              placeholder="Enter Admin Password..."
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAdminLogin();
                                }
                              }}
                              className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#020408] border border-[#38BDF8]/50 focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors shadow-inner"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676E83] hover:text-[#38BDF8] transition-colors p-1"
                              title={showAdminPassword ? 'Hide password' : 'Show password'}
                            >
                              {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {adminAuthError && (
                            <div className="text-xs text-[#EF4444] font-['Manrope'] flex items-center gap-1.5 pt-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{adminAuthError}</span>
                            </div>
                          )}

                          {adminAuthSuccess && (
                            <div className="text-xs text-[#10B981] font-['Manrope'] flex items-center gap-1.5 pt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Password verified! Directing to Admin Portal...</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleAdminLogin}
                            disabled={isAdminLoggingIn}
                            className="w-full py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white font-['Space_Grotesk'] text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)] disabled:opacity-60"
                          >
                            {isAdminLoggingIn ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Verifying & Launching...</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Verify & Enter Admin Portal</span>
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selecting Work Feature (Fashion Ads, Product Ads, UGC, Storytelling, etc.) */}
                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#7B8092] mb-2.5 flex items-center justify-between">
                      <span>SELECT WORK TYPE / SERVICE <span className="text-[#38BDF8]">*</span></span>
                      <span className="text-[10px] text-[#38BDF8] lowercase font-mono font-normal">tap to choose</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {WORK_OPTIONS.map((option) => {
                        const isSelected = formState.workType === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormState({ ...formState, workType: option })}
                            className={`px-3 py-2.5 rounded-xl text-xs font-['Space_Grotesk'] font-medium text-left transition-all duration-200 border flex items-center justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#F5F3EE] shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-[#38BDF8]/40'
                                : 'bg-[#080A10] border-[#1E2336] text-[#9295A0] hover:border-[#38BDF8]/40 hover:text-[#F5F3EE]'
                            }`}
                          >
                            <span className="truncate">{option}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#7B8092] mb-2">
                      PROJECT DESCRIPTION <span className="text-[#38BDF8]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your project requirements, scope, and timeline..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#080A10] border border-[#1E2336] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors resize-none shadow-inner"
                    ></textarea>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#EF4444] font-['Manrope']">{submitError}</p>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-white font-['Space_Grotesk'] text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Connecting to Gmail...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 text-white" />
                          <span>Send Directly via Gmail</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-['IBM_Plex_Mono'] text-[#676E83]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        Direct Gmail Connection
                      </span>
                      <button
                        type="button"
                        onClick={handleManualOpenGmail}
                        className="text-[#9295A0] hover:text-[#38BDF8] underline underline-offset-2 transition-colors flex items-center gap-1"
                      >
                        <span>Open in Gmail Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
