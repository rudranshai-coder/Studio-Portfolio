import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { SocialLink } from '../types';

interface FooterProps {
  name: string;
  socialLinks: SocialLink[];
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  name,
  socialLinks,
  onNavigate,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-b from-[#000811] via-[#02060D] to-[#010408] backdrop-blur-[12px] section-glass py-12 px-6 md:px-10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand info */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#F5F3EE] tracking-wider">
              Rudransh Portfolio
            </span>
          </div>
          <p className="font-['Manrope'] text-xs text-[#7B8092]">
            AI-powered fashion, product, advertising and social visuals.
          </p>
        </div>

        {/* Social and Direct Connect Quick Links */}
        <div className="flex items-center gap-2.5">
          {socialLinks.map((s, idx) => {
            const isInstagram = s.platform === 'Instagram';
            const isLinkedIn = s.platform === 'LinkedIn';
            const isFacebook = s.platform === 'Facebook';
            const isGitHub = s.platform === 'GitHub';

            return (
              <a
                key={`footer-social-${s.platform}-${idx}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full bg-[#10121A] border border-[#202538] flex items-center justify-center transition-all hover:scale-110 shadow-sm ${
                  isInstagram
                    ? 'text-[#E1306C] hover:border-[#E1306C]/60 hover:bg-[#E1306C]/10'
                    : isLinkedIn
                    ? 'text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10'
                    : isFacebook
                    ? 'text-[#1877F2] hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10'
                    : 'text-[#F0F6FC] hover:border-[#F0F6FC]/60 hover:bg-[#F0F6FC]/10'
                }`}
                title={`Visit Rudransh on ${s.platform}: ${s.handle}`}
              >
                {isInstagram ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ) : isLinkedIn ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ) : isFacebook ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ) : isGitHub ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
              </a>
            );
          })}
          <a
            href="https://wa.me/917874417797?text=Hi%20Rudransh%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20collaboration!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#10121A] hover:bg-[#10B981]/20 border border-[#202538] hover:border-[#10B981]/60 flex items-center justify-center text-[#10B981] transition-all hover:scale-110 shadow-sm"
            title="Chat directly on WhatsApp (+91 7874417797)"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=rudranshgoyal44@gmail.com&su=Creative%20Inquiry%20%E2%80%94%20Rudransh%20Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#10121A] hover:bg-[#EA4335]/20 border border-[#202538] hover:border-[#EA4335]/60 flex items-center justify-center text-[#EA4335] transition-all hover:scale-110 shadow-sm"
            title="Open official Gmail Web compose (rudranshgoyal44@gmail.com)"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="tel:+917874417797"
            className="w-9 h-9 rounded-full bg-[#10121A] hover:bg-[#38BDF8]/20 border border-[#202538] hover:border-[#38BDF8]/60 flex items-center justify-center text-[#38BDF8] transition-all hover:scale-110 shadow-sm"
            title="Call Rudransh (+91 7874417797)"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Quick Links & Back to Top */}
        <div className="flex items-center gap-6 font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider text-[#9295A0]">
          <div className="hidden sm:flex items-center gap-5">
            <button onClick={() => onNavigate('hero')} className="hover:text-[#F5F3EE] transition-colors cursor-pointer">
              HOME
            </button>
            <button onClick={() => onNavigate('work')} className="hover:text-[#F5F3EE] transition-colors cursor-pointer">
              WORK
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-[#F5F3EE] transition-colors cursor-pointer">
              SERVICES
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#F5F3EE] transition-colors cursor-pointer">
              CONTACT
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10121A] hover:bg-[#1A1D2B] border border-[#202538] hover:border-[#FF6A00]/50 text-[#9295A0] hover:text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:-translate-y-0.5 text-[#9295A0] group-hover:text-[#FF6A00]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#0F121C] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-['IBM_Plex_Mono'] text-[#555B6E]">
        <div>
          © {new Date().getFullYear()} Rudransh Portfolio. All rights reserved. •{' '}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=rudranshgoyal44@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#EA4335] transition-colors"
          >
            rudranshgoyal44@gmail.com
          </a>{' '}
          •{' '}
          <a
            href="tel:+917874417797"
            className="hover:text-[#10B981] transition-colors"
          >
            +91 7874417797
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span>AI VISUAL WORKFLOWS</span>
          <span>•</span>
          <span>BCA + AI</span>
        </div>
      </div>
    </motion.footer>
  );
};
