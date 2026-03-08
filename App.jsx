/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Gamepad2, LayoutGrid, Search, Play, Star, X,
  Maximize2, Globe, ArrowLeft, Bot, Smartphone,
  Zap, ChevronRight, Trophy, Flame
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { GAMES } from './constants.js';

// ─── Floating particles background ───────────────────────────────────────────
const Particles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? 'rgba(168,85,247,0.4)' : p.id % 3 === 1 ? 'rgba(255,0,110,0.3)' : 'rgba(255,255,255,0.2)',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};



// ─── HeroSlider ────────────────────────────────────────────────────────────────
const HeroSlider = ({ games, currentIndex, onIndexChange, onPlay }) => {
  const game = games[currentIndex];

  return (
    <div className="relative h-[400px] rounded-3xl overflow-hidden group neon-border scanlines bg-surface">
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={game.thumbnail}
            className="w-full h-full object-cover"
            alt={game.title}
            referrerPolicy="no-referrer"
          />
          <div className="hero-gradient absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 p-8 w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${game.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={12} className="text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Featured</span>
            </div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2 text-glow">{game.title}</h1>
            <p className="text-white/60 text-sm mb-6 line-clamp-2 max-w-lg">{game.description}</p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlay(game)}
                className="relative bg-accent text-bg px-7 py-3 rounded-xl font-bold flex items-center gap-2 text-sm overflow-hidden glow-accent-sm"
              >
                <Play size={15} fill="currentColor" />
                Play Now
              </motion.button>
              <div className="flex items-center gap-1 glass px-3 py-2 rounded-xl">
                <Star size={12} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs font-bold">{game.rating}</span>
              </div>
              <div className="flex items-center gap-1 glass px-3 py-2 rounded-xl">
                <Trophy size={12} className="text-accent/70" />
                <span className="text-xs font-bold text-white/60">{game.plays}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute top-5 right-6 flex gap-1.5 z-10">
        {games.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => onIndexChange(idx)}
            animate={{ width: idx === currentIndex ? 24 : 6, opacity: idx === currentIndex ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-white"
          />
        ))}
      </div>

      {/* Corner decorations */}
      <CornerDeco className="top-4 left-4" />
      <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px bg-accent opacity-60" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-accent opacity-60" />
      </div>
    </div>
  );
};

// ─── IframeView ────────────────────────────────────────────────────────────────
const IframeView = ({ src, title, containerRef, onFullscreen }) => (
  <div className="relative group">
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-black neon-border shadow-2xl"
    >
      <iframe src={src} className="w-full h-full border-none" title={title} allow="autoplay; fullscreen; pointer-lock" />
    </motion.div>
    <motion.button
      initial={{ opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      onClick={onFullscreen}
      className="absolute top-4 right-4 p-3 glass hover:bg-accent/20 hover:border-accent/40 text-white/60 hover:text-accent rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
      title="Fullscreen"
    >
      <Maximize2 size={18} />
    </motion.button>
  </div>
);

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedCategoryView, setSelectedCategoryView] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const iframeContainerRef = useRef(null);
  const proxyContainerRef = useRef(null);
  const aiContainerRef = useRef(null);
  const androidContainerRef = useRef(null);

  const FEATURED_GAMES = useMemo(() => GAMES.slice(0, 6), []);

  const handleFullscreen = (ref) => {
    const elem = ref.current;
    if (!elem) return;
    (elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen)?.call(elem);
  };

  useEffect(() => {
    if (view !== 'home' || searchQuery) return;
    const interval = setInterval(() => setCurrentHeroIndex(p => (p + 1) % FEATURED_GAMES.length), 4000);
    return () => clearInterval(interval);
  }, [view, searchQuery, FEATURED_GAMES.length]);

  const filteredGames = useMemo(() => GAMES.filter(g => {
    const matchCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }), [selectedCategory, searchQuery]);

  const gamesByCategory = useMemo(() => {
    const grouped = {};
    GAMES.forEach(g => { (grouped[g.category] = grouped[g.category] || []).push(g); });
    return grouped;
  }, []);

  const categoryColors = {
    'Horror':     { from: '#7f1d1d', to: '#450a0a', accent: '#ef4444' },
    'Arcade':     { from: '#1e3a5f', to: '#0f172a', accent: '#3b82f6' },
    'Action':     { from: '#7c2d12', to: '#431407', accent: '#f97316' },
    'Sports':     { from: '#14532d', to: '#052e16', accent: '#22c55e' },
    'Simulation': { from: '#3b0764', to: '#1e0533', accent: '#a855f7' },
    'Adventure':  { from: '#713f12', to: '#3f1f09', accent: '#eab308' },
    'Racing':     { from: '#831843', to: '#4a0d26', accent: '#ec4899' },
  };

  const navItems = [
    { id: 'library',    icon: <Gamepad2 size={22} />,    label: 'Library',    color: 'hover:bg-blue-500/10 hover:text-blue-400',    hoverBorder: 'hover:border-blue-500/30' },
    { id: 'proxy',      icon: <Globe size={22} />,       label: 'Proxy',      color: 'hover:bg-purple-500/10 hover:text-purple-400',  hoverBorder: 'hover:border-purple-500/30' },
    { id: 'categories', icon: <LayoutGrid size={22} />,  label: 'Categories', color: 'hover:bg-emerald-500/10 hover:text-emerald-400', hoverBorder: 'hover:border-emerald-500/30' },
    { id: 'ai',         icon: <Bot size={22} />,         label: 'AI Chat',    color: 'hover:bg-orange-500/10 hover:text-orange-400',  hoverBorder: 'hover:border-orange-500/30' },
    { id: 'android',    icon: <Smartphone size={22} />,  label: 'Android',    color: 'hover:bg-red-500/10 hover:text-red-400',        hoverBorder: 'hover:border-red-500/30' },
  ];

  return (
    <div className="flex h-screen bg-bg overflow-hidden relative grid-bg">
      <Particles />
      

      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Header (non-home) */}
        <AnimatePresence>
          {(view !== 'home' || searchQuery) && (
            <motion.header
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3 }}
              className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between glass border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                {view !== 'home' && (
                  <motion.button
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setView('home'); setSelectedCategoryView(null); }}
                    className="p-2 hover:bg-accent/10 hover:border-accent/30 rounded-xl text-white/40 hover:text-accent transition-all border border-white/8"
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                )}
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-accent" />
                  <span className="text-white font-semibold text-sm uppercase tracking-wider">
                    {view === 'library' ? 'Library' : view === 'proxy' ? 'Proxy' : view === 'ai' ? 'AI Chat' : view === 'categories' ? 'Categories' : view === 'android' ? 'Android' : 'Search'}
                  </span>
                </div>
              </div>

              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-accent' : 'text-white/25'}`} size={16} />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="glass rounded-full pl-9 pr-4 py-2 w-56 text-sm focus:outline-none transition-all focus:border-accent/40 focus:bg-accent/5 placeholder:text-white/20"
                />
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <div className="px-8 pb-12 pt-6">
          {/* ── HOME ── */}
          {view === 'home' && !searchQuery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {/* Title bar */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center"
                  >
                    <Zap size={16} className="text-accent" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-black tracking-tight">
                    <span className="gradient-text">NEXUS</span>
                    <span className="text-white/20 mx-2">|</span>
                    <span className="text-white/70 text-2xl font-semibold">ARCADE</span>
                  </h1>
                </div>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-accent' : 'text-white/25'}`} size={16} />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="glass rounded-full pl-9 pr-4 py-2 w-56 text-sm focus:outline-none transition-all focus:border-accent/40 focus:bg-accent/5 placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Hero + Nav */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
                <div className="lg:col-span-10">
                  <HeroSlider
                    games={FEATURED_GAMES}
                    currentIndex={currentHeroIndex}
                    onIndexChange={setCurrentHeroIndex}
                    onPlay={setActiveGame}
                  />
                </div>
                <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 justify-center items-center">
                  {navItems.map(item => (
                    <NavIconButton
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => { setView(item.id); if (item.id !== 'categories') setSelectedCategoryView(null); }}
                      color={`${item.color} ${item.hoverBorder}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quick picks */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-accent" style={{ boxShadow: '0 0 8px #A855F7' }} />
                  <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white/90">Hot Right Now</h2>
                </div>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setView('library')}
                  className="text-xs text-accent/70 hover:text-accent flex items-center gap-1 transition-colors"
                >
                  See all <ChevronRight size={12} />
                </motion.button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-in">
                {GAMES.slice(0, 6).map((game, i) => (
                  <GameCard key={game.id} game={game} index={i} onClick={() => setActiveGame(game)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LIBRARY / SEARCH ── */}
          {(view === 'library' || searchQuery) && (
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-accent" style={{ boxShadow: '0 0 8px #A855F7' }} />
                  <h2 className="text-2xl font-display font-bold uppercase tracking-wider">
                    {searchQuery ? `"${searchQuery}"` : 'All Games'}
                  </h2>
                </div>
                <div className="glass px-4 py-2 rounded-xl text-sm text-white/50 border border-white/8">
                  <span className="text-accent font-bold">{filteredGames.length}</span> Games
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, i) => (
                  <GameCard key={game.id} game={game} index={i} onClick={() => setActiveGame(game)} />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── PROXY ── */}
          {view === 'proxy' && !searchQuery && (
            <IframeView src="https://etherealproxy.netlify.app/" title="Proxy" containerRef={proxyContainerRef} onFullscreen={() => handleFullscreen(proxyContainerRef)} />
          )}

          {/* ── AI ── */}
          {view === 'ai' && !searchQuery && (
            <IframeView src="https://gptlite.vercel.app/chat" title="AI Chat" containerRef={aiContainerRef} onFullscreen={() => handleFullscreen(aiContainerRef)} />
          )}

          {/* ── ANDROID ── */}
          {view === 'android' && !searchQuery && (
            <IframeView src="https://nowgg.fun/apps/uncube/7074/now.html" title="Android Apps" containerRef={androidContainerRef} onFullscreen={() => handleFullscreen(androidContainerRef)} />
          )}

          {/* ── CATEGORIES ── */}
          {view === 'categories' && !searchQuery && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {!selectedCategoryView ? (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 rounded-full bg-accent" style={{ boxShadow: '0 0 8px #A855F7' }} />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Categories</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-in">
                    {Object.entries(gamesByCategory).map(([category, games]) => {
                      const colors = categoryColors[category] || { from: '#1f1f2e', to: '#0d0d18', accent: '#A855F7' };
                      return (
                        <motion.div
                          key={category}
                          whileHover={{ scale: 1.03, y: -6 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedCategoryView(category)}
                          className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer category-shimmer neon-border"
                          style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                        >
                          {/* Grid pattern overlay */}
                          <div className="absolute inset-0 grid-bg opacity-30" />
                          {/* Glow spot */}
                          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                            style={{ background: colors.accent }} />
                          <div className="absolute inset-0 p-7 flex flex-col justify-between">
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                              style={{ background: `${colors.accent}18`, borderColor: `${colors.accent}30` }}>
                              <Gamepad2 style={{ color: colors.accent }} size={22} />
                            </div>
                            <div>
                              <h3 className="text-3xl font-display font-black text-white mb-1 tracking-tight uppercase italic">{category}</h3>
                              <p className="text-sm font-medium" style={{ color: `${colors.accent}99` }}>
                                {games.length} Games
                              </p>
                            </div>
                          </div>
                          <CornerDeco className="top-3 left-3" />
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategoryView(null)}
                        className="p-2 hover:bg-accent/10 hover:border-accent/30 rounded-xl text-white/40 hover:text-accent transition-all border border-white/8"
                      >
                        <ArrowLeft size={18} />
                      </motion.button>
                      <div className="w-1 h-6 rounded-full bg-accent" style={{ boxShadow: '0 0 8px #A855F7' }} />
                      <h2 className="text-2xl font-display font-bold uppercase tracking-wider italic">{selectedCategoryView}</h2>
                    </div>
                    <div className="glass px-4 py-2 rounded-xl text-sm text-white/50">
                      <span className="text-accent font-bold">{gamesByCategory[selectedCategoryView].length}</span> Games
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gamesByCategory[selectedCategoryView].map((game, i) => (
                      <GameCard key={game.id} game={game} index={i} onClick={() => setActiveGame(game)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* ── GAME MODAL ── */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            style={{ background: 'rgba(5,5,10,0.92)', backdropFilter: 'blur(16px)' }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-surface w-full h-full rounded-3xl overflow-hidden flex flex-col neon-border"
            >
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between glass flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={activeGame.thumbnail} className="w-10 h-10 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{activeGame.title}</h3>
                    <p className="text-xs text-white/30">{activeGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFullscreen(iframeContainerRef)}
                    className="p-2.5 hover:bg-accent/10 hover:text-accent hover:border-accent/30 rounded-xl text-white/40 transition-all border border-white/8"
                  >
                    <Maximize2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveGame(null)}
                    className="p-2.5 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 rounded-xl text-white/40 transition-all border border-white/8"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Game iframe */}
              <div ref={iframeContainerRef} className="flex-1 bg-black relative">
                <iframe
                  src={activeGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; pointer-lock"
                  title={activeGame.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
