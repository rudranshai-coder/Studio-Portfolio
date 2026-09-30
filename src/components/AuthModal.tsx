import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Briefcase,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    initialAuthData,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [canQuickSwitchToSignUp, setCanQuickSwitchToSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (authModalOpen && initialAuthData) {
      if (initialAuthData.email && !email) setEmail(initialAuthData.email);
      if (initialAuthData.name && !name) setName(initialAuthData.name);
      if (initialAuthData.phone && !phone) setPhone(initialAuthData.phone);
      if (initialAuthData.company && !company) setCompany(initialAuthData.company);
    }
  }, [authModalOpen, initialAuthData]);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setCompany('');
    setError(null);
    setCanQuickSwitchToSignUp(false);
  };

  const handleModeSwitch = (mode: 'signin' | 'signup') => {
    setError(null);
    setCanQuickSwitchToSignUp(false);
    openAuthModal(mode);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      resetForm();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try email sign in.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCanQuickSwitchToSignUp(false);
    setLoading(true);

    try {
      if (authModalMode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name or brand name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await signUpWithEmail(email.trim(), password, name.trim(), phone.trim(), company.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl bg-[#090C15] border border-[#1E2538] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-8"
        >
          {/* Top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#38BDF8]/10 blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#121624] text-[#9295A0] hover:text-white hover:bg-[#1A2136] transition-colors z-20 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 font-['IBM_Plex_Mono'] text-[11px] text-[#38BDF8] tracking-widest uppercase font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>COLLABORATOR ACCESS</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F3EE]">
                {authModalMode === 'signup' ? 'Create Collaborator Profile' : 'Sign In to Collaborate'}
              </h3>
              <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0]">
                {authModalMode === 'signup'
                  ? 'Sign up to save your project collaboration briefs and track submissions securely.'
                  : 'Welcome back! Sign in to submit your collaboration brief and access your stored records.'}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#05070D] border border-[#161B2C] mb-6">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className={`py-2 rounded-lg font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  authModalMode === 'signin'
                    ? 'bg-[#182033] text-[#38BDF8] shadow-sm'
                    : 'text-[#7B8092] hover:text-[#C5C8D4]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`py-2 rounded-lg font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-[#182033] text-[#38BDF8] shadow-sm'
                    : 'text-[#7B8092] hover:text-[#C5C8D4]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Sign In Quick Action */}
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 rounded-xl bg-[#121624] hover:bg-[#1A2136] border border-[#232B42] hover:border-[#38BDF8]/40 text-[#F5F3EE] font-['Space_Grotesk'] text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#38BDF8]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#181D2E] w-full" />
                <span className="bg-[#090C15] px-3 font-['IBM_Plex_Mono'] text-[10px] uppercase text-[#676E83] tracking-widest absolute">
                  OR WITH EMAIL
                </span>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 mb-4 rounded-xl bg-[#EA4335]/15 border border-[#EA4335]/30 text-[#EA4335] space-y-2 text-xs font-['Manrope']"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                {canQuickSwitchToSignUp && authModalMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCanQuickSwitchToSignUp(false);
                      openAuthModal('signup');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] font-['Space_Grotesk'] text-xs font-bold transition-all text-center cursor-pointer border border-[#38BDF8]/40"
                  >
                    Sign up with this email as a new Collaborator →
                  </button>
                )}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'signup' && (
                <>
                  <div>
                    <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#9295A0] mb-1">
                      FULL NAME / BRAND NAME <span className="text-[#38BDF8]">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#676E83] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova / Vogue Studios"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05070D] border border-[#1A2136] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#9295A0] mb-1">
                        PHONE / WHATSAPP (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#676E83] absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#05070D] border border-[#1A2136] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#9295A0] mb-1">
                        COMPANY / AGENCY (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-[#676E83] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="Brand / Studio"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#05070D] border border-[#1A2136] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#9295A0] mb-1">
                  EMAIL ADDRESS <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#676E83] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="contact@yourbrand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05070D] border border-[#1A2136] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#9295A0] mb-1">
                  PASSWORD <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#676E83] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05070D] border border-[#1A2136] focus:border-[#38BDF8] text-[#F5F3EE] font-['Manrope'] text-sm focus:outline-none transition-colors"
                  />
                </div>
                {authModalMode === 'signup' && (
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#676E83] mt-1 block">
                    Must be at least 6 characters.
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-black font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                ) : (
                  <>
                    <span>{authModalMode === 'signup' ? 'COMPLETE SIGN UP' : 'SIGN IN TO COLLABORATE'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom info */}
            <div className="mt-5 pt-4 border-t border-[#151928] flex items-center justify-between text-xs font-['Manrope'] text-[#7B8092]">
              <span>
                {authModalMode === 'signup' ? 'Already have a collaborator profile?' : "Don't have an account yet?"}
              </span>
              <button
                type="button"
                onClick={() => handleModeSwitch(authModalMode === 'signup' ? 'signin' : 'signup')}
                className="text-[#38BDF8] font-['Space_Grotesk'] font-bold hover:underline cursor-pointer"
              >
                {authModalMode === 'signup' ? 'Sign In' : 'Sign Up Now'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
