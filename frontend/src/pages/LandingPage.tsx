import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video, Monitor, Shield, Wifi, Play, Mic,
  ScreenShare, Bell, Globe, Zap, Sparkles, ArrowRight, Clock, Radio, Signal,
  MessageSquare, CircleDot, Users, KeyRound, FileText, Settings,
  Headphones, CheckCircle2,
  Lock, Eye, Fingerprint, Mail, MapPin, Phone,
  Smartphone, Tablet
} from 'lucide-react';
import { DemoTour } from '../components/demo/DemoTour';

export function LandingPage() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <Navbar onLogin={() => navigate('/login')} />
      <HeroSection onGetStarted={() => navigate('/login')} onWatchDemo={() => setDemoOpen(true)} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CampusesSection />
      <SecuritySection />
      <BrowserCompatSection />
      <TestimonialsSection />
      <FAQSection />
      <MapSection />
      <ContactSection />
      <CTASection onGetStarted={() => navigate('/login')} />
      <Footer />
      <DemoTour isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

/* ─── NAVBAR ─── */
function Navbar({ onLogin }: { onLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12 L10 7 L10 17 Z" fill="currentColor" />
              <path d="M19 12 L14 7 L14 17 Z" fill="currentColor" opacity="0.4" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
          </div>
          <span className="text-lg font-bold">Here to There</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </button>
          <button onClick={onLogin} className="text-sm font-medium bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 px-5 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-primary-500/20">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function HeroSection({ onGetStarted, onWatchDemo }: { onGetStarted: () => void; onWatchDemo: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-cyan-500/6 rounded-full blur-[130px]" />
        {/* Neon bubbles */}
        <div className="neon-bubble" style={{ width: 80, height: 80, left: '10%', top: '20%', background: 'rgba(236, 72, 153, 0.12)', boxShadow: '0 0 40px rgba(236,72,153,0.25), 0 0 80px rgba(236,72,153,0.1)', animationDuration: '7s', animationDelay: '0s' }} />
        <div className="neon-bubble" style={{ width: 20, height: 20, left: '25%', top: '70%', background: 'rgba(34, 211, 238, 0.15)', boxShadow: '0 0 20px rgba(34,211,238,0.35), 0 0 50px rgba(34,211,238,0.15)', animationDuration: '9s', animationDelay: '1s' }} />
        <div className="neon-bubble" style={{ width: 50, height: 50, left: '75%', top: '15%', background: 'rgba(168, 85, 247, 0.1)', boxShadow: '0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.1)', animationDuration: '8s', animationDelay: '2s' }} />
        <div className="neon-bubble" style={{ width: 12, height: 12, left: '60%', top: '80%', background: 'rgba(52, 211, 153, 0.2)', boxShadow: '0 0 15px rgba(52,211,153,0.4), 0 0 40px rgba(52,211,153,0.15)', animationDuration: '6s', animationDelay: '0.5s' }} />
        <div className="neon-bubble" style={{ width: 35, height: 35, left: '85%', top: '55%', background: 'rgba(251, 191, 36, 0.1)', boxShadow: '0 0 25px rgba(251,191,36,0.3), 0 0 50px rgba(251,191,36,0.1)', animationDuration: '10s', animationDelay: '3s' }} />
        <div className="neon-bubble" style={{ width: 60, height: 60, left: '40%', top: '85%', background: 'rgba(96, 165, 250, 0.1)', boxShadow: '0 0 35px rgba(96,165,250,0.3), 0 0 70px rgba(96,165,250,0.1)', animationDuration: '11s', animationDelay: '1.5s' }} />
        <div className="neon-bubble" style={{ width: 15, height: 15, left: '50%', top: '10%', background: 'rgba(244, 114, 182, 0.2)', boxShadow: '0 0 18px rgba(244,114,182,0.4), 0 0 45px rgba(244,114,182,0.15)', animationDuration: '7.5s', animationDelay: '4s' }} />
        <div className="neon-bubble" style={{ width: 25, height: 25, left: '5%', top: '50%', background: 'rgba(45, 212, 191, 0.12)', boxShadow: '0 0 22px rgba(45,212,191,0.35), 0 0 55px rgba(45,212,191,0.12)', animationDuration: '8.5s', animationDelay: '2.5s' }} />
        <div className="neon-bubble" style={{ width: 45, height: 45, left: '92%', top: '30%', background: 'rgba(192, 132, 252, 0.1)', boxShadow: '0 0 28px rgba(192,132,252,0.3), 0 0 60px rgba(192,132,252,0.1)', animationDuration: '9.5s', animationDelay: '0.8s' }} />
        <div className="neon-bubble" style={{ width: 10, height: 10, left: '35%', top: '40%', background: 'rgba(253, 224, 71, 0.2)', boxShadow: '0 0 14px rgba(253,224,71,0.45), 0 0 35px rgba(253,224,71,0.15)', animationDuration: '6.5s', animationDelay: '3.5s' }} />
        {/* Sharp light trails */}
        <div className="light-trail" style={{ top: '15%', animationDuration: '3s', animationDelay: '0s', background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(56,189,248,0.8), rgba(56,189,248,0.6), transparent)' }} />
        <div className="light-trail" style={{ top: '35%', animationDuration: '4s', animationDelay: '1.2s', background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(168,85,247,0.7), rgba(168,85,247,0.5), transparent)' }} />
        <div className="light-trail" style={{ top: '55%', animationDuration: '2.5s', animationDelay: '2.5s', background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.5), rgba(236,72,153,0.7), rgba(236,72,153,0.5), transparent)' }} />
        <div className="light-trail" style={{ top: '75%', animationDuration: '3.5s', animationDelay: '0.8s', background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), rgba(52,211,153,0.7), rgba(52,211,153,0.5), transparent)' }} />
        <div className="light-trail" style={{ top: '45%', animationDuration: '5s', animationDelay: '3.5s', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), rgba(251,191,36,0.6), rgba(251,191,36,0.4), transparent)' }} />
        <div className="light-trail-v" style={{ left: '20%', animationDuration: '3.2s', animationDelay: '0.5s', background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.5), rgba(56,189,248,0.7), rgba(56,189,248,0.5), transparent)' }} />
        <div className="light-trail-v" style={{ left: '65%', animationDuration: '4.2s', animationDelay: '2s', background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.4), rgba(168,85,247,0.6), rgba(168,85,247,0.4), transparent)' }} />
        <div className="light-trail-v" style={{ left: '85%', animationDuration: '2.8s', animationDelay: '1s', background: 'linear-gradient(180deg, transparent, rgba(236,72,153,0.4), rgba(236,72,153,0.6), rgba(236,72,153,0.4), transparent)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles size={14} className="text-primary-400" />
          <span className="text-xs font-medium text-primary-300">Intercampus Live Video Portal</span>
        </div>

        {/* Heading */}
        <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 animate-fade-in-up">
          Connecting{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient">
            Two Campuses
          </span>
        </h1>
        <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 animate-fade-in-up">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-pink-500 animate-gradient">
            In Real Time
          </span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10 space-y-1">
          <p className="typing-line text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed" style={{ animationDelay: '1s' }}>
            <span className="text-cyan-400">Here to There</span> enables seamless live video communication
          </p>
          <p className="typing-line text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed" style={{ animationDelay: '2.2s' }}>
            between PSBC Paete and PSBC Pagsanjan.
          </p>
          <p className="typing-line text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed" style={{ animationDelay: '3.4s' }}>
            Conduct meetings, announcements, and school programs
          </p>
          <p className="typing-line text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed" style={{ animationDelay: '4.6s' }}>
            across campuses — instantly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button onClick={onGetStarted} className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-xl shadow-primary-500/20 w-full sm:w-auto">
            <span className="relative flex items-center gap-2">
              Launch Portal
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button onClick={onWatchDemo} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center">
            <Play size={16} className="text-primary-400" />
            Watch Demo
          </button>
        </div>

        {/* Preview mockup */}
        <div className="relative mx-auto max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute -inset-1 bg-gradient-to-b from-primary-500/20 via-cyan-500/10 to-transparent rounded-2xl blur-lg" />
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800/60 p-1 shadow-2xl">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                  <div className="flex-1 flex justify-center">
                  <div className="bg-gray-700/50 rounded-md px-4 py-1 text-xs text-gray-400">PSBC Control Room</div>
                </div>
              </div>
              {/* Mockup content */}
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="bg-gray-800 rounded-lg aspect-video relative overflow-hidden border border-gray-700/50 group">
                  <img src="/images/paete.png" alt="PSBC Paete" className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Monitor size={18} className="text-white/80" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] text-red-400 font-bold bg-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[11px] text-white font-medium">PSBC Paete</span>
                    <span className="text-[9px] text-green-400 font-medium bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg aspect-video relative overflow-hidden border border-gray-700/50 group">
                  <img src="/images/pagsanjan.png" alt="PSBC Pagsanjan" className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Monitor size={18} className="text-white/80" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] text-red-400 font-bold bg-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[11px] text-white font-medium">PSBC Pagsanjan</span>
                    <span className="text-[9px] text-green-400 font-medium bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function AnimatedNumber({ value, suffix = '', prefix = '', duration = 2000 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, value, duration]);

  return <div ref={ref} className="font-orbitron text-3xl sm:text-4xl font-black text-white mb-1">{prefix}{count}{suffix}</div>;
}

function StatsSection() {
  const stats = [
    { value: 2, label: 'Campuses Connected', icon: <Globe size={26} />, colorClass: 'text-cyan-400', glow: 'rgba(34,211,238,0.5)', ring: 'rgba(34,211,238,0.2)' },
    { value: 100, suffix: 'ms', prefix: '<', label: 'Latency', icon: <Zap size={26} />, colorClass: 'text-purple-400', glow: 'rgba(168,85,247,0.5)', ring: 'rgba(168,85,247,0.2)' },
    { value: 24, suffix: '/7', label: 'Availability', icon: <Clock size={26} />, colorClass: 'text-emerald-400', glow: 'rgba(52,211,153,0.5)', ring: 'rgba(52,211,153,0.2)' },
    { value: 100, suffix: '%', label: 'Encrypted', icon: <Shield size={26} />, colorClass: 'text-amber-400', glow: 'rgba(251,191,36,0.5)', ring: 'rgba(251,191,36,0.2)' },
  ];
  return (
    <section className="relative py-20 border-y border-gray-800/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 relative z-10">
        {stats.map((s, i) => (
          <div key={i} className="group relative animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            {/* Animated border glow */}
            <div className="absolute -inset-px rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${s.glow}, transparent, ${s.glow})` }} />
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: `0 0 40px ${s.ring}, inset 0 0 40px ${s.ring}` }} />
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800/60 p-4 sm:p-6 text-center overflow-hidden transition-all duration-500 group-hover:border-transparent h-full">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-2xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: s.glow }} />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-2xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: s.glow }} />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-2xl opacity-20 group-hover:opacity-60 transition-opacity" style={{ borderColor: s.glow }} />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-2xl opacity-20 group-hover:opacity-60 transition-opacity" style={{ borderColor: s.glow }} />
              {/* Background pulse */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-ping" style={{ background: s.ring, animationDuration: '2s' }} />
              </div>
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300" style={{ background: `linear-gradient(135deg, ${s.ring}, rgba(17,24,39,0.6))`, boxShadow: `0 0 25px ${s.ring}, 0 0 50px ${s.ring.replace('0.2', '0.08')}` }}>
                <span className={`${s.colorClass} drop-shadow-lg`}>{s.icon}</span>
              </div>
              {/* Number */}
              <div className="relative">
                <AnimatedNumber value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              {/* Label */}
              <div className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-medium mt-1">{s.label}</div>
              {/* Bottom line accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-3/4 transition-all duration-500" style={{ background: `linear-gradient(90deg, transparent, ${s.glow}, transparent)` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection() {
  const features = [
    {
      icon: <Video size={20} />,
      title: 'Live Video',
      desc: 'Crystal-clear two-way video using WebRTC peer-to-peer with sub-100ms latency.',
      gradient: 'from-blue-500 to-primary-500',
      neon: '#3b82f6',
    },
    {
      icon: <ScreenShare size={20} />,
      title: 'Screen Sharing',
      desc: 'Present docs and announcements. Google Meet-style spotlight layout.',
      gradient: 'from-purple-500 to-pink-500',
      neon: '#a855f7',
    },
    {
      icon: <Mic size={20} />,
      title: 'Selective Audio',
      desc: 'Talk to Paete, Pagsanjan, or both. Independent audio controls for all.',
      gradient: 'from-cyan-500 to-blue-500',
      neon: '#06b6d4',
    },
    {
      icon: <MessageSquare size={20} />,
      title: 'Text Chat',
      desc: 'Real-time messaging with All or Campus-specific channels.',
      gradient: 'from-indigo-500 to-blue-500',
      neon: '#6366f1',
    },
    {
      icon: <Bell size={20} />,
      title: 'Emergency',
      desc: 'Override all screens instantly. Campus-scoped or broadcast.',
      gradient: 'from-red-500 to-orange-500',
      neon: '#ef4444',
    },
    {
      icon: <CircleDot size={20} />,
      title: 'Portal Modes',
      desc: 'LIVE, PORTAL, or IN MEETING — toggle connectivity modes.',
      gradient: 'from-green-500 to-emerald-500',
      neon: '#22c55e',
    },
    {
      icon: <KeyRound size={20} />,
      title: '2FA Security',
      desc: 'TOTP-based two-factor auth with QR code setup.',
      gradient: 'from-amber-500 to-yellow-500',
      neon: '#f59e0b',
    },
    {
      icon: <Users size={20} />,
      title: 'Role Access',
      desc: 'Admin, Principal, Teacher, Staff — campus-locked permissions.',
      gradient: 'from-rose-500 to-pink-500',
      neon: '#f43f5e',
    },
    {
      icon: <Settings size={20} />,
      title: 'Device Settings',
      desc: 'Camera/mic selection, HD video, echo cancellation, volume control.',
      gradient: 'from-teal-500 to-cyan-500',
      neon: '#14b8a6',
    },
  ];

  const count = features.length;
  const angleStep = 360 / count;
  const radius = 380;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/5 rounded-full blur-[120px]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">Features</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Everything You Need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
              Campus Communication
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm mb-20">
            Built specifically for PSBC Paete and PSBC Pagsanjan.
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="carousel-wrapper relative flex justify-center items-center" style={{ height: '340px', perspective: '900px', perspectiveOrigin: '50% 50%' }}>
          <div className="carousel-track relative w-[220px] h-[260px]" style={{ transformStyle: 'preserve-3d', animation: 'carousel-spin 28s linear infinite' }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="carousel-card absolute top-0 left-0 w-[220px] h-[260px]"
                style={{
                  transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  className="relative rounded-2xl h-full flex flex-col text-center transition-all duration-300 group overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, rgba(20,27,45,0.97) 0%, rgba(10,15,25,0.99) 100%)',
                    border: `1.5px solid ${f.neon}35`,
                    boxShadow: `
                      0 0 25px ${f.neon}15,
                      0 12px 40px rgba(0,0,0,0.7),
                      inset 0 1px 0 rgba(255,255,255,0.04)
                    `,
                  }}
                >
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(${f.neon}30 1px, transparent 1px), linear-gradient(90deg, ${f.neon}30 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Corner accents — top-left & bottom-right */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-[1.5px] border-l-[1.5px] rounded-tl-2xl pointer-events-none" style={{ borderColor: `${f.neon}60` }} />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[1.5px] border-r-[1.5px] rounded-br-2xl pointer-events-none" style={{ borderColor: `${f.neon}40` }} />

                  {/* Top edge neon line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent, ${f.neon}80, transparent)` }} />

                  {/* Bottom edge neon line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${f.neon}40, transparent)` }} />

                  {/* Animated shine sweep on hover */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div
                      className="absolute -top-full -left-full w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, ${f.neon}08 45%, ${f.neon}15 50%, ${f.neon}08 55%, transparent 70%)`,
                        animation: 'none',
                      }}
                    />
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        background: `${f.neon}15`,
                        color: `${f.neon}`,
                        border: `1px solid ${f.neon}25`,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon container with solid neon bg */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4 pt-3 pb-1">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 relative"
                      style={{
                        background: f.neon,
                        boxShadow: `0 0 20px ${f.neon}40, 0 4px 12px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <span className="relative z-10">{f.icon}</span>
                    </div>

                    {/* Title with neon underline */}
                    <h3 className="font-orbitron text-[11px] font-bold text-white mb-1.5 tracking-wide">
                      {f.title}
                    </h3>
                    <div className="w-8 h-[1px] rounded-full mb-2.5" style={{ background: `linear-gradient(90deg, transparent, ${f.neon}60, transparent)` }} />

                    {/* Description */}
                    <p className="text-[10px] text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>

                  {/* Bottom glow dot */}
                  <div className="flex justify-center pb-2 mt-auto">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: f.neon, boxShadow: `0 0 8px ${f.neon}` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Login to the Portal',
      desc: 'Access the system through your browser. Principals and admins use the Control Room view.',
      icon: <Shield size={24} />,
    },
    {
      num: '02',
      title: 'Connect Campuses',
      desc: 'Paete and Pagsanjan campuses join the session. WebRTC establishes direct peer-to-peer connections.',
      icon: <Signal size={24} />,
    },
    {
      num: '03',
      title: 'Communicate in Real Time',
      desc: 'Video, audio, screen sharing, and announcements flow seamlessly between locations.',
      icon: <Video size={24} />,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">How It Works</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3">Three Steps to Connect</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary-500/30 via-cyan-500/30 to-primary-500/30" />

          {steps.map((s, i) => (
            <div key={i} className="text-center relative">
              {/* Step circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700/60 flex items-center justify-center text-primary-400 relative z-10 group-hover:border-primary-500/50 transition-colors">
                  {s.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary-500/30">
                  {s.num}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CAMPUSES ─── */
function CampusesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-950 to-gray-900/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">Our Campuses</span>
          <h2 className="font-orbitron font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Two Locations, One Connection</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Paete Science and Business College operates across two campuses in Laguna, now unified through live video.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Paete */}
          <div className="group relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative bg-gray-900/80 rounded-2xl border border-gray-800/60 overflow-hidden hover:border-primary-500/30 transition-all duration-500">
              <div className="h-52 relative overflow-hidden">
                <img
                  src="/images/paete.png"
                  alt="PSBC Paete Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-green-400 font-medium">Online</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">PSBC Paete</h3>
                <p className="text-sm text-gray-400 mb-4">Paete, Laguna</p>
                <div className="flex flex-wrap gap-2">
                  {['Video Feed', 'Audio Output', 'Screen Display', 'Bulletin Board'].map((t) => (
                    <span key={t} className="text-[11px] bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700/50">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pagsanjan */}
          <div className="group relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative bg-gray-900/80 rounded-2xl border border-gray-800/60 overflow-hidden hover:border-cyan-500/30 transition-all duration-500">
              <div className="h-52 relative overflow-hidden">
                <img
                  src="/images/pagsanjan.png"
                  alt="PSBC Pagsanjan Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-green-400 font-medium">Online</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">PSBC Pagsanjan</h3>
                <p className="text-sm text-gray-400 mb-4">Pagsanjan, Laguna</p>
                <div className="flex flex-wrap gap-2">
                  {['Video Feed', 'Audio Output', 'Screen Display', 'Bulletin Board'].map((t) => (
                    <span key={t} className="text-[11px] bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700/50">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECURITY & PRIVACY ─── */
function SecuritySection() {
  const items = [
    {
      icon: <Lock size={22} />,
      title: 'End-to-End Encryption',
      desc: 'All video streams encrypted with DTLS-SRTP, built into the WebRTC standard. No data passes through our servers.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      glow: 'rgba(34,211,238,0.15)',
    },
    {
      icon: <KeyRound size={22} />,
      title: 'Two-Factor Authentication',
      desc: 'Optional TOTP-based 2FA with QR code setup. Adds an extra layer of security beyond password login.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      glow: 'rgba(168,85,247,0.15)',
    },
    {
      icon: <Shield size={22} />,
      title: 'JWT + bcrypt',
      desc: 'Passwords hashed with bcrypt. Sessions secured with 256-bit JWT secrets. HTTP-only cookies prevent XSS.',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      glow: 'rgba(34,197,94,0.15)',
    },
    {
      icon: <Eye size={22} />,
      title: 'Account Lockout Protection',
      desc: 'Automatic account lockout after failed login attempts. Rate limiting prevents brute-force attacks.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'rgba(251,191,36,0.15)',
    },
    {
      icon: <FileText size={22} />,
      title: 'Audit Logging',
      desc: 'Every action tracked: logins, session starts, emergency triggers, user changes. Full accountability trail.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      glow: 'rgba(59,130,246,0.15)',
    },
    {
      icon: <Fingerprint size={22} />,
      title: 'Role-Based Permissions',
      desc: 'Strict access control. Teachers and staff see only their campus. Admins and principals have elevated privileges.',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      glow: 'rgba(236,72,153,0.15)',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Security</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Enterprise-Grade{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Security & Privacy
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your communication is protected by the same encryption standards used by banks and governments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 hover:border-gray-700/60 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <h3 className="font-orbitron text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BROWSER COMPATIBILITY + SYSTEM REQUIREMENTS ─── */
function BrowserCompatSection() {
  const browsers = [
    { name: 'Chrome', version: '90+', logo: '/images/chrome-logo.png', color: 'from-red-500 via-yellow-500 to-green-500' },
    { name: 'Firefox', version: '88+', logo: '/images/firefox-logo.png', color: 'from-orange-500 via-red-500 to-purple-500' },
    { name: 'Edge', version: '90+', logo: '/images/edge-logo.png', color: 'from-blue-500 via-cyan-500 to-blue-600' },
    { name: 'Safari', version: '14+', logo: '/images/safari-logo.png', color: 'from-blue-400 via-blue-500 to-blue-600' },
    { name: 'Brave', version: '90+', logo: '/images/brave-logo.png', color: 'from-orange-500 via-red-500 to-pink-500' },
  ];

  const devices = [
    { icon: <Smartphone size={20} />, label: 'Mobile', desc: 'iOS & Android phones', gradient: 'from-green-400 to-emerald-500' },
    { icon: <Tablet size={20} />, label: 'Tablet', desc: 'iPad & Android tablets', gradient: 'from-blue-400 to-cyan-500' },
    { icon: <Monitor size={20} />, label: 'Desktop', desc: 'Windows, Mac & Linux', gradient: 'from-purple-400 to-pink-500' },
  ];

  const requirements = [
    { icon: <Monitor size={18} />, label: 'Display', desc: 'TV or monitor per campus' },
    { icon: <Video size={18} />, label: 'Webcam', desc: 'USB webcam (720p+)' },
    { icon: <Headphones size={18} />, label: 'Audio', desc: 'Speakers or headset' },
    { icon: <Wifi size={18} />, label: 'Internet', desc: 'Stable broadband (5+ Mbps)' },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Browser Compatibility */}
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Compatibility</span>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold mt-3 mb-6">
              Works in Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Browser</span>
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              No downloads. No plugins. Just open your browser and connect. Here to There runs entirely in the web.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {browsers.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-900/60 rounded-xl border border-gray-800/50 p-4 group hover:border-gray-700/60 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br p-1 flex items-center justify-center" style={{background: 'transparent'}}>
                    <img src={b.logo} alt={`${b.name} logo`} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{b.name}</p>
                    <p className="text-[10px] text-gray-500">{b.version}</p>
                  </div>
                  <CheckCircle2 size={16} className="text-green-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            {/* Responsive / Multi-device badge */}
            <div className="mt-6 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Smartphone size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400">Fully Responsive</p>
                  <p className="text-[10px] text-gray-500">Adapts to any screen size</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {devices.map((d, i) => (
                  <div key={i} className="text-center">
                    <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${d.gradient} flex items-center justify-center mb-1.5`}>
                      {d.icon}
                    </div>
                    <p className="text-[10px] font-semibold text-white">{d.label}</p>
                    <p className="text-[9px] text-gray-500">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Requirements</span>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold mt-3 mb-6">
              What You{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Need</span>
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Each campus needs basic video conferencing equipment. The system handles everything else.
            </p>
            <div className="space-y-3">
              {requirements.map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-900/60 rounded-xl border border-gray-800/50 p-4 group hover:border-gray-700/60 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{r.label}</p>
                    <p className="text-[11px] text-gray-500">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
function TestimonialsSection() {
  const row1 = [
    { quote: "Here to There has transformed how our campuses communicate. What used to require physical travel now happens instantly.", name: 'Campus Admin', role: 'PSBC Paete', neon: '#06b6d4' },
    { quote: "The emergency broadcast feature gives us peace of mind. We can reach both campuses in seconds.", name: 'School Principal', role: 'PSBC Pagsanjan', neon: '#a855f7' },
    { quote: "Teachers love the simplicity. No downloads — just open the browser and start communicating.", name: 'IT Coordinator', role: 'PSBC Laguna', neon: '#22c55e' },
    { quote: "Screen sharing during meetings is seamless. Presentations look crystal clear on both ends.", name: 'Faculty Head', role: 'PSBC Paete', neon: '#f59e0b' },
    { quote: "The portal mode keeps our campuses connected 24/7. It feels like we're in the same building.", name: 'Admin Staff', role: 'PSBC Pagsanjan', neon: '#ef4444' },
    { quote: "We conduct school programs across campuses without any delays. The latency is impressively low.", name: 'Program Director', role: 'PSBC Paete', neon: '#6366f1' },
    { quote: "Setup was incredibly easy. Within minutes both campuses were live and connected.", name: 'Tech Support', role: 'PSBC Laguna', neon: '#f43f5e' },
    { quote: "The chat feature lets students ask questions during cross-campus lectures without interrupting.", name: 'Lecturer', role: 'PSBC Paete', neon: '#14b8a6' },
    { quote: "Audio quality is outstanding. Selective talk lets me address each campus individually.", name: 'Department Head', role: 'PSBC Pagsanjan', neon: '#3b82f6' },
    { quote: "Recording sessions means students who missed class can catch up easily.", name: 'Dean of Students', role: 'PSBC Paete', neon: '#8b5cf6' },
    { quote: "Role-based access ensures only authorized staff can control the portal. Very secure.", name: 'Security Officer', role: 'PSBC Laguna', neon: '#ec4899' },
    { quote: "Our parents appreciate live-streamed school events. It bridges the distance for families.", name: 'Parent Rep', role: 'PSBC Pagsanjan', neon: '#10b981' },
  ];

  const row2 = [
    { quote: "The bulletin board keeps both campuses informed about schedules and announcements.", name: 'Registrar', role: 'PSBC Paete', neon: '#f97316' },
    { quote: "During emergencies, the instant override feature ensures no one misses critical alerts.", name: 'Safety Officer', role: 'PSBC Pagsanjan', neon: '#ef4444' },
    { quote: "The two-factor authentication gives us confidence that our system is well protected.", name: 'Network Admin', role: 'PSBC Laguna', neon: '#06b6d4' },
    { quote: "Split-screen view lets the principal monitor both campuses at the same time.", name: 'Office Staff', role: 'PSBC Paete', neon: '#a855f7' },
    { quote: "I can adjust my camera and mic settings per session. The device controls are very intuitive.", name: 'Faculty Member', role: 'PSBC Pagsanjan', neon: '#22c55e' },
    { quote: "Cross-campus meetings used to take an hour of travel. Now they take zero.", name: 'Campus Director', role: 'PSBC Paete', neon: '#f59e0b' },
    { quote: "The notification system ensures no important bulletin goes unread across campuses.", name: 'Admin Asst.', role: 'PSBC Pagsanjan', neon: '#6366f1' },
    { quote: "Even on slower connections, the video adapts and stays usable. Very reliable.", name: 'Student Rep', role: 'PSBC Laguna', neon: '#f43f5e' },
    { quote: "We've reduced travel costs significantly since adopting Here to There.", name: 'Finance Head', role: 'PSBC Paete', neon: '#14b8a6' },
    { quote: "The welcome demo tour helped new users get comfortable with the system right away.", name: 'Training Lead', role: 'PSBC Pagsanjan', neon: '#3b82f6' },
    { quote: "Volume controls per user let me adjust audio without affecting others on the call.", name: 'AV Technician', role: 'PSBC Paete', neon: '#8b5cf6' },
    { quote: "This platform is exactly what intercampus education needed. Simple yet powerful.", name: 'Project Lead', role: 'PSBC Laguna', neon: '#ec4899' },
  ];

  const TestimonialCard = ({ t }: { t: typeof row1[0] }) => (
    <div
      className="flex-shrink-0 w-[260px] rounded-xl p-4 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(160deg, rgba(20,27,45,0.95) 0%, rgba(10,15,25,0.98) 100%)',
        border: `1px solid ${t.neon}30`,
        boxShadow: `0 0 15px ${t.neon}10, 0 4px 20px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent, ${t.neon}60, transparent)` }} />

      {/* Quote mark */}
      <div className="text-lg font-serif mb-2 leading-none" style={{ color: t.neon, opacity: 0.6 }}>"</div>

      {/* Quote text */}
      <p className="text-[11px] text-gray-300 leading-relaxed mb-3">{t.quote}</p>

      {/* Author */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: `${t.neon}30`, border: `1px solid ${t.neon}40` }}
        >
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white">{t.name}</p>
          <p className="text-[9px] text-gray-500">{t.role}</p>
        </div>
      </div>

      {/* Bottom dot */}
      <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full animate-pulse" style={{ background: t.neon, boxShadow: `0 0 6px ${t.neon}` }} />
    </div>
  );

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Testimonials</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Trusted by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Educators</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">What our campus community says about Here to There.</p>
        </div>
      </div>

      {/* Row 1 — scrolling left */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 marquee-left" style={{ width: 'max-content' }}>
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolling right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 marquee-right" style={{ width: 'max-content' }}>
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT / SUPPORT ─── */
function ContactSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">Support</span>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Need{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Help?</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Our team is ready to assist with setup, training, and technical support.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800/50 p-6 text-center group hover:border-primary-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail size={20} className="text-primary-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Email Us</h3>
            <p className="text-[11px] text-gray-500">support@heretothere.edu.ph</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800/50 p-6 text-center group hover:border-cyan-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Call Us</h3>
            <p className="text-[11px] text-gray-500">(049) 555-0123</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800/50 p-6 text-center group hover:border-green-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={20} className="text-green-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Visit Us</h3>
            <p className="text-[11px] text-gray-500">Paete & Pagsanjan, Laguna</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is Here to There?',
      a: 'Here to There is a dedicated live video portal designed specifically for PSBC Paete and PSBC Pagsanjan to enable real-time intercampus communication without the need for physical travel.',
    },
    {
      q: 'How does the video connection work?',
      a: 'The system uses WebRTC (Web Real-Time Communication) technology to establish direct peer-to-peer video and audio streams between the two campuses with minimal latency.',
    },
    {
      q: 'Who can access the Control Room?',
      a: 'Only authorized personnel with principal or admin roles can access the Control Room, which provides full control over video feeds, audio routing, screen sharing, and emergency broadcasts.',
    },
    {
      q: 'Can the principal talk to both campuses at once?',
      a: 'Yes. The Control Room supports "Talk to Both" mode, as well as selective audio to speak to Paete or Pagsanjan individually. Teachers and staff also have their own talk buttons.',
    },
    {
      q: 'What happens during an emergency?',
      a: 'The principal can trigger an Emergency Broadcast from the Control Room, which immediately overrides all campus screens with an alert. It can be scoped to a single campus or broadcast to both.',
    },
    {
      q: 'Is the connection secure?',
      a: 'Yes. All video streams are encrypted end-to-end using DTLS-SRTP (built into WebRTC), and user authentication uses JWT tokens with bcrypt password hashing. Two-factor authentication is also available.',
    },
    {
      q: 'What equipment do the campuses need?',
      a: 'Each campus needs a display screen (TV or monitor), a webcam, speakers, and a stable internet connection (5+ Mbps). The system runs in Chrome, Firefox, Edge, or Safari — no installation required.',
    },
    {
      q: 'Can I use it on a tablet or phone?',
      a: 'Here to There is designed for desktop/laptop browsers with webcam support. While the interface is responsive, we recommend using a computer with a webcam for the best video conferencing experience.',
    },
    {
      q: 'Is there text chat during video calls?',
      a: 'Yes. The built-in chat panel lets you send messages to everyone or filter by campus. Messages are delivered in real time via WebSocket connections.',
    },
    {
      q: 'Can sessions be recorded?',
      a: 'Yes. The Control Room supports session recording. Recordings are saved as WebM files and can be downloaded or deleted from the recordings manager.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">FAQ</span>
          <h2 className="font-orbitron font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Questions</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Everything you need to know about the Here to There Live Video Portal.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-300 ${
                openIndex === i
                  ? 'bg-gray-800/60 border-primary-500/30 shadow-lg shadow-primary-500/5'
                  : 'bg-gray-900/50 border-gray-800/50 hover:border-gray-700/60'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180 text-primary-400' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-40 pb-4' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MAP ─── */
function MapSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Location</span>
          <h2 className="font-orbitron font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Laguna, Philippines</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            PSBC Paete and PSBC Pagsanjan are located in the province of Laguna, connected through this portal.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-gray-800/60 bg-gray-900/80">
          {/* Map SVG — Laguna Province with Paete & Pagsanjan markers */}
          <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* Water / Laguna de Bay */}
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#164e63" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glowLarge">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Laguna de Bay (lake) */}
            <path
              d="M300,580 C250,540 200,480 220,420 C240,360 300,320 360,300 C420,280 480,300 520,340 C560,380 580,440 560,500 C540,540 480,570 420,585 Z"
              fill="url(#waterGrad)"
              stroke="#0e7490"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <text x="380" y="450" fill="#0e7490" opacity="0.4" fontSize="14" fontFamily="Inter" textAnchor="middle" fontStyle="italic">
              Laguna de Bay
            </text>

            {/* Land mass — Laguna province */}
            <path
              d="M100,80 C160,60 250,50 350,70 C450,90 550,80 650,100 C720,115 760,140 770,180 C780,230 760,300 720,360 C680,420 620,470 550,500 C480,530 400,540 340,520 C280,500 220,460 180,400 C140,340 100,260 90,200 C82,140 85,100 100,80 Z"
              fill="url(#landGrad)"
              stroke="#374151"
              strokeWidth="1.5"
            />

            {/* Road connections */}
            <path d="M260,280 C280,310 290,340 300,370" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.5" />
            <path d="M260,280 C300,260 350,250 400,260" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.5" />
            <path d="M400,260 C420,290 430,320 430,350" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.5" />

            {/* Connection line between campuses */}
            <path
              d="M260,280 Q340,230 430,260"
              stroke="url(#connGrad)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 4"
              opacity="0.6"
            >
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite" />
            </path>
            <defs>
              <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* PSBC Paete marker */}
            <g filter="url(#glowLarge)">
              <circle cx="260" cy="280" r="20" fill="#3b82f6" opacity="0.15" />
              <circle cx="260" cy="280" r="12" fill="#3b82f6" opacity="0.25" />
            </g>
            <circle cx="260" cy="280" r="6" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" filter="url(#glow)" />
            <circle cx="260" cy="280" r="2.5" fill="white" />

            <rect x="195" y="238" width="130" height="28" rx="6" fill="#111827" stroke="#1e40af" strokeWidth="1" opacity="0.9" />
            <text x="260" y="256" fill="white" fontSize="10" fontFamily="Inter" fontWeight="700" textAnchor="middle">
              PSBC PAETE
            </text>

            <rect x="210" y="220" width="100" height="14" rx="4" fill="#1e40af" opacity="0.3" />
            <text x="260" y="230" fill="#93c5fd" fontSize="7" fontFamily="Inter" textAnchor="middle">
              Paete, Laguna
            </text>

            {/* PSBC Pagsanjan marker */}
            <g filter="url(#glowLarge)">
              <circle cx="430" cy="260" r="20" fill="#06b6d4" opacity="0.15" />
              <circle cx="430" cy="260" r="12" fill="#06b6d4" opacity="0.25" />
            </g>
            <circle cx="430" cy="260" r="6" fill="#06b6d4" stroke="#0e7490" strokeWidth="2" filter="url(#glow)" />
            <circle cx="430" cy="260" r="2.5" fill="white" />

            <rect x="355" y="218" width="150" height="28" rx="6" fill="#111827" stroke="#0e7490" strokeWidth="1" opacity="0.9" />
            <text x="430" y="236" fill="white" fontSize="10" fontFamily="Inter" fontWeight="700" textAnchor="middle">
              PSBC PAGSANJAN
            </text>

            <rect x="370" y="200" width="120" height="14" rx="4" fill="#0e7490" opacity="0.3" />
            <text x="430" y="210" fill="#67e8f9" fontSize="7" fontFamily="Inter" textAnchor="middle">
              Pagsanjan, Laguna
            </text>

            {/* Nearby city labels */}
            <text x="160" y="160" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Sta. Cruz</text>
            <text x="520" y="180" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Lumban</text>
            <text x="600" y="240" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Pila</text>
            <text x="200" y="370" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Santa Maria</text>
            <text x="550" y="360" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Victoria</text>
            <text x="350" y="140" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Calauan</text>
            <text x="470" y="150" fill="#6b7280" fontSize="9" fontFamily="Inter" textAnchor="middle">Pangil</text>

            {/* Province label */}
            <text x="380" y="110" fill="#9ca3af" fontSize="18" fontFamily="Inter" fontWeight="800" textAnchor="middle" letterSpacing="6" opacity="0.5">
              LAGUNA
            </text>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-[11px] text-gray-300">PSBC Paete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-[11px] text-gray-300">PSBC Pagsanjan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-px bg-gradient-to-r from-primary-500 to-cyan-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 4px, transparent 4px, transparent 8px)' }} />
              <span className="text-[11px] text-gray-300">Live Connection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-primary-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
          {/* Animated border */}
          <div className="absolute -inset-px rounded-3xl overflow-hidden">
            <div className="cta-border-spin absolute inset-0" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(34,211,238,0.6), transparent, rgba(168,85,247,0.6), transparent, rgba(236,72,153,0.6), transparent)' }} />
          </div>
          <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-400/60 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-pink-400/60 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400/60 rounded-br-3xl" />
            {/* Background glow spots */}
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px]" />
            {/* Content */}
            <div className="relative z-10 text-center py-10 sm:py-16 px-4 sm:px-8">
              {/* Icon row */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 animate-fade-in" style={{ animationDelay: '0s' }}>
                  <Video size={20} />
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center text-primary-400 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Monitor size={22} />
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <ScreenShare size={20} />
                </div>
              </div>
              {/* Title */}
              <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
                Ready to Connect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary-400 to-purple-400 animate-gradient">
                  Your Campuses?
                </span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
                Join PSBC Paete and PSBC Pagsanjan in the future of intercampus communication.
              </p>
              {/* Button */}
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  <Radio size={18} />
                  Launch Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              {/* Bottom chip */}
              <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-400" /> Encrypted</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400" /> Low Latency</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1.5"><Wifi size={12} className="text-cyan-400" /> Always On</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12 L10 7 L10 17 Z" fill="currentColor" />
                <path d="M19 12 L14 7 L14 17 Z" fill="currentColor" opacity="0.4" />
                <circle cx="12" cy="12" r="1.5" />
              </svg>
            </div>
            <span className="text-sm font-bold">Here to There</span>
          </div>
          <p className="text-xs text-gray-500">
            Capstone Project &copy; 2026 &mdash; PSBC Paete &amp; PSBC Pagsanjan
          </p>
          <div className="flex gap-4">
            <a href="mailto:support@heretothere.edu.ph" className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Support</a>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
