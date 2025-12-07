import { useEffect, useRef, useState } from 'react';

interface WaterParticle {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  charIndex: number;
  intensity: number;
}

type ActiveSection = 'none' | 'creative' | 'projects' | 'career';

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredButtonRef = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<WaterParticle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const rippleRef = useRef({ active: false, x: 0, y: 0, intensity: 0, time: 0 });

  const WATER_CHARS = ['~', '≈', '∼', '⌐', '¬', '∩', '∪', '°', '·', '`', ',', '.', ':', ';', '▴', '▾', '◆', '◇'];
  
  const PARTICLE_SIZE = 14;
  const POOL_HEIGHT = 160;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeFluid();
    };

    const initializeFluid = () => {
      particlesRef.current = [];
      const spacing = 8;
      const cols = Math.floor(canvas.width / spacing);
      const rows = Math.floor(POOL_HEIGHT / (spacing * 0.7));
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing/2;
          const baseY = canvas.height - POOL_HEIGHT + row * (spacing * 0.7);
          
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 2,
            y: baseY + (Math.random() - 0.5) * 2,
            baseY: baseY,
            vx: 0,
            vy: 0,
            charIndex: Math.floor(Math.random() * 6),
            intensity: 0.5 + Math.random() * 0.3
          });
        }
      }
    };

    const updateFluid = () => {
      timeRef.current += 0.016;
      const ripple = rippleRef.current;
      
      if (ripple.active) {
        ripple.time += 0.016;
        ripple.intensity *= 0.98;
        if (ripple.intensity < 0.1) {
          ripple.active = false;
        }
      }
      
      particlesRef.current.forEach((particle) => {
        const wave = Math.sin(timeRef.current * 0.6 + particle.x * 0.008) * 1.5;
        const restY = particle.baseY + wave;
        
        if (hoveredButtonRef.current) {
          const buttonX = hoveredButtonRef.current.x;
          const buttonY = hoveredButtonRef.current.y;
          const dx = buttonX - particle.x;
          const dy = buttonY - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 400) {
            const force = Math.pow((400 - dist) / 400, 2) * 1.2;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
            particle.vy -= force * 2;
          }
        }
        
        if (ripple.active) {
          const rippleDx = ripple.x - particle.x;
          const rippleDy = ripple.y - particle.y;
          const rippleDist = Math.sqrt(rippleDx * rippleDx + rippleDy * rippleDy);
          
          if (rippleDist < 300) {
            const rippleWave = Math.sin((rippleDist * 0.02) - (ripple.time * 8)) * ripple.intensity;
            particle.vx += (rippleDx / rippleDist) * rippleWave * 0.4;
            particle.vy += (rippleDy / rippleDist) * rippleWave * 0.4;
          }
        }
        
        particle.vy += (restY - particle.y) * 0.02;
        particle.vx *= 0.93;
        particle.vy *= 0.93;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y > canvas.height - 20) particle.y = canvas.height - 20;
        
        const speed = Math.abs(particle.vx) + Math.abs(particle.vy);
        const heightFromBase = Math.max(0, particle.baseY - particle.y);
        
        if (speed > 3 || heightFromBase > 40) {
          particle.charIndex = 8 + Math.floor(Math.random() * 4);
        } else if (speed > 1.5 || heightFromBase > 15) {
          particle.charIndex = 4 + Math.floor(Math.random() * 4);
        } else {
          particle.charIndex = Math.floor(Math.random() * 4);
        }
      });
    };

    const renderFluid = () => {
      if (!canvas || !ctx) return;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0F172A');
      gradient.addColorStop(0.3, '#1E293B'); 
      gradient.addColorStop(0.7, '#334155');
      gradient.addColorStop(1, '#475569');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${PARTICLE_SIZE}px Monaco, Consolas, "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      particlesRef.current.forEach(particle => {
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        
        let distanceFromButton = Infinity;
        if (hoveredButtonRef.current) {
          distanceFromButton = Math.sqrt(
            (hoveredButtonRef.current.x - particle.x) ** 2 + (hoveredButtonRef.current.y - particle.y) ** 2
          );
        }
        
        if (distanceFromButton < 150) {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.95)';
        } else if (distanceFromButton < 300) {
          ctx.fillStyle = 'rgba(64, 224, 255, 0.8)';
        } else if (speed > 2) {
          ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
        } else {
          ctx.fillStyle = 'rgba(120, 180, 220, 0.6)';
        }
        
        const char = WATER_CHARS[Math.max(0, Math.min(particle.charIndex, WATER_CHARS.length - 1))];
        ctx.fillText(char, particle.x, particle.y);
      });
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      updateFluid();
      renderFluid();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    resizeCanvas();
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleButtonHover = (isHovering: boolean, event?: React.MouseEvent) => {
    if (isHovering && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        hoveredButtonRef.current = {
          x: rect.left + rect.width / 2 - canvasRect.left,
          y: rect.top + rect.height / 2 - canvasRect.top
        };
      }
    } else {
      hoveredButtonRef.current = null;
    }
  };

  const handleSectionClick = (section: ActiveSection, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2 - canvasRect.left;
      const buttonCenterY = rect.top + rect.height / 2 - canvasRect.top;
      
      rippleRef.current = {
        active: true,
        x: buttonCenterX,
        y: buttonCenterY,
        intensity: 8,
        time: 0
      };
    }
    
    setTimeout(() => {
      setActiveSection(section);
    }, 150);
  };

  const TimelineItem = ({ year, title, subtitle, description, link, linkText }: {
    year: string;
    title: string;
    subtitle?: string;
    description: string;
    link?: string;
    linkText?: string;
  }) => (
    <div className="snap-center shrink-0 w-80 sm:w-96 flex flex-col justify-center min-h-[60vh]">
      <div className="space-y-4">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          {year}
        </div>
        <h3 className="text-xl sm:text-2xl font-mono text-slate-200 font-bold">
          {title}
        </h3>
        {subtitle && (
          <h4 className="text-sm font-mono text-slate-300">
            {subtitle}
          </h4>
        )}
        <p className="text-sm font-mono text-slate-300 leading-relaxed">
          {description}
        </p>
        {link && linkText && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
          >
            {linkText} →
          </a>
        )}
      </div>
    </div>
  );

  const ServicesAndContact = ({ onBack }: { onBack: () => void }) => (
    <>
      <div className="snap-center shrink-0 w-80 sm:w-96 flex flex-col justify-center min-h-[60vh]">
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-mono text-slate-200 font-bold">
            What can I do for you?
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-base font-mono text-cyan-400 font-bold">
                Creative Direction
              </h4>
              <p className="text-sm font-mono text-slate-300 leading-relaxed">
                Brand identity, visual strategy, and content creation
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-base font-mono text-cyan-400 font-bold">
                Video Production
              </h4>
              <p className="text-sm font-mono text-slate-300 leading-relaxed">
                High-quality video content and post-production
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-base font-mono text-cyan-400 font-bold">
                Workflow Improvement & AI Implementation
              </h4>
              <p className="text-sm font-mono text-slate-300 leading-relaxed">
                Automation, process optimization, and AI-powered solutions
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <a 
              href="mailto:kabirbedi01@hotmail.com"
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/50 backdrop-blur-sm
                         hover:bg-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300
                         focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400
                         text-center"
              data-testid="button-contact-email"
            >
              <span className="text-sm font-mono text-cyan-300 hover:text-cyan-200">
                Contact via Email →
              </span>
            </a>
            
            <a 
              href="tel:+447877337849"
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/50 backdrop-blur-sm
                         hover:bg-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300
                         focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400
                         text-center"
              data-testid="button-contact-phone"
            >
              <span className="text-sm font-mono text-cyan-300 hover:text-cyan-200">
                Call: +44 7877 337849 →
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="snap-center shrink-0 w-80 sm:w-96 flex flex-col justify-center min-h-[60vh]">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm
                     hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-300
                     focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
          data-testid="button-back-home"
        >
          <span className="text-sm font-mono text-slate-300 hover:text-cyan-200">
            ← Back to Home
          </span>
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 font-mono">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
      />
      
      {/* Main Content - Landing Page */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${activeSection !== 'none' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 sm:mb-6 md:mb-8">
            This site was made by
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono text-slate-200 font-bold tracking-wide">
            Kaci Bedi
          </h1>
          <blockquote className="max-w-2xl mx-auto text-center px-4">
            <p className="text-sm sm:text-base font-mono text-slate-300 leading-relaxed">
              "You are not a drop in the ocean. You are the entire ocean in a drop."
            </p>
            <cite className="block mt-2 sm:mt-3 text-xs sm:text-sm font-mono text-slate-400">— Rumi</cite>
          </blockquote>
        </div>
        
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-16 px-4 sm:px-8 w-full">
          <button
            data-testid="button-creative"
            onMouseEnter={(e) => handleButtonHover(true, e)}
            onMouseLeave={() => handleButtonHover(false)}
            onClick={(e) => handleSectionClick('creative', e)}
            className="group relative px-4 sm:px-6 py-3 bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm
                       hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-300
                       focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400
                       active:scale-95 active:bg-slate-600/70 transform"
          >
            <span className="text-xs sm:text-sm font-mono text-slate-300 group-hover:text-cyan-200 transition-colors duration-300">
              creative portfolio
            </span>
          </button>

          <button
            data-testid="button-career"
            onMouseEnter={(e) => handleButtonHover(true, e)}
            onMouseLeave={() => handleButtonHover(false)}
            onClick={(e) => handleSectionClick('career', e)}
            className="group relative px-4 sm:px-6 py-3 bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm
                       hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-300
                       focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400
                       active:scale-95 active:bg-slate-600/70 transform"
          >
            <span className="text-xs sm:text-sm font-mono text-slate-300 group-hover:text-cyan-200 transition-colors duration-300">
              career
            </span>
          </button>

          <button
            data-testid="button-projects"
            onMouseEnter={(e) => handleButtonHover(true, e)}
            onMouseLeave={() => handleButtonHover(false)}
            onClick={(e) => handleSectionClick('projects', e)}
            className="group relative px-4 sm:px-6 py-3 bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm
                       hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-300
                       focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400
                       active:scale-95 active:bg-slate-600/70 transform"
          >
            <span className="text-xs sm:text-sm font-mono text-slate-300 group-hover:text-cyan-200 transition-colors duration-300">
              personal projects
            </span>
          </button>
        </div>
      </div>

      {/* Creative Portfolio Timeline */}
      {activeSection === 'creative' && (
        <div className="fixed inset-0 z-20 flex items-center justify-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.portfolio-timeline::-webkit-scrollbar { display: none; }`}</style>
          
          <div className="flex space-x-8 sm:space-x-16 md:space-x-32 px-4 sm:px-8 md:px-16 py-8 min-w-full portfolio-timeline animate-fadeIn">
            <TimelineItem
              year="2025"
              title="Clarius Living"
              description="Directed social media creative and brand identity. Led 3D product design and rendering for complete catalog."
              link="https://clariusliving.com"
              linkText="clariusliving.com"
            />

            <TimelineItem
              year="2025"
              title="Naked & Saucy"
              subtitle="Growth & Creative Marketing"
              description="Applied a scientific, data-driven approach to marketing for a national CPG brand sold in Costco, Walmart, Loblaws. Blended statistical insight with creative execution to produce UGC, refine brand identity, and build experiments that boosted engagement."
              link="https://nakedandsaucy.com"
              linkText="nakedandsaucy.com"
            />

            <div className="snap-center shrink-0 w-80 sm:w-96 flex flex-col justify-center min-h-[60vh]">
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  2025
                </div>
                <h3 className="text-xl sm:text-2xl font-mono text-slate-200 font-bold">
                  Digital Content & Science Communication
                </h3>
                <p className="text-sm font-mono text-slate-300 leading-relaxed">
                  Produced educational content on physics, AI, and personal growth across Instagram and TikTok.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-cyan-400 font-bold">2M+</span>
                    <span className="text-sm font-mono text-slate-300">views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-cyan-400 font-bold">4,000+</span>
                    <span className="text-sm font-mono text-slate-300">organic followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-400">amassed in 2 months</span>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/reel/DN1xiAy0E3m/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                >
                  Watch on Instagram →
                </a>
              </div>
            </div>

            <ServicesAndContact onBack={() => setActiveSection('none')} />
          </div>
        </div>
      )}

      {/* Personal Projects Timeline */}
      {activeSection === 'projects' && (
        <div className="fixed inset-0 z-20 flex items-center justify-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.portfolio-timeline::-webkit-scrollbar { display: none; }`}</style>
          
          <div className="flex space-x-8 sm:space-x-16 md:space-x-32 px-4 sm:px-8 md:px-16 py-8 min-w-full portfolio-timeline animate-fadeIn">
            <TimelineItem
              year="2021–2025"
              title="BSc Physics"
              subtitle="King's College London"
              description="Moved to London at 18. Engaged deeply with the AI community at KCL, completing two advanced modules from Computer Science. Developed expertise in scientific programming, data visualization, and machine learning."
            />

            <TimelineItem
              year="2025"
              title="Quantum Machine Learning for Financial Fraud Detection"
              subtitle="Dissertation — Final Grade: 77 (First Class)"
              description="Benchmarked Quantum SVMs against SVM, CatBoost, XGBoost, and LightGBM on the PCA-transformed Kaggle Credit Card Fraud dataset. Ran QSVM circuits on the IBM Kyiv quantum backend and Qiskit Aer to evaluate performance and quantum advantage."
            />

            <TimelineItem
              year="2022–2024"
              title="KCL DJ Society President"
              description="Elected President for leadership and community focus. Organised and DJ'd large-scale events of over 1,000 people. Led the society to its most successful year—raising over £3,000 for charity, hosting renowned DJs, and expanding membership to its largest level in history."
              link="https://instagram.com/kaciibedi"
              linkText="Instagram"
            />

            <TimelineItem
              year="2024"
              title="Physics of DJing Workshop"
              subtitle="Jane Street × KCL Women in Physics"
              description="Hosted an interactive workshop teaching attendees from esteemed professors to STEM students the physics behind DJing. Explained Fourier Analysis, Fourier transforms and frequency equalisation in an accessible and interactive way."
            />

            <TimelineItem
              year="2023–2025"
              title="Audiovisual Business"
              subtitle="Founder"
              description="Ran an audiovisual services business providing DJ, sound, and lighting solutions for events. Worked with clients including Yoto Play, Imperial CGCU, Imperial RCSU, KCLSU, and the School of Politics and Economics. Generated around £10,000 ARR to help fund my BSc Physics degree."
            />

            <TimelineItem
              year="2019–2025"
              title="Data Analyst + Caregiver"
              subtitle="Personal Project"
              description="As a primary caregiver for my aunt with autism and bipolar disorder, I built a Python application using pandas and scikit-learn. Used a random forest classifier to analyse behavioural patterns, identify cyclic mood variations, and forecast short-term temperament trends to support her stability."
            />

            <div className="snap-center shrink-0 w-80 sm:w-96 flex flex-col justify-center min-h-[60vh]">
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  2025
                </div>
                <h3 className="text-xl sm:text-2xl font-mono text-slate-200 font-bold">
                  Digital Content & Science Communication
                </h3>
                <p className="text-sm font-mono text-slate-300 leading-relaxed">
                  Produced educational content on physics, AI, and personal growth across Instagram and TikTok.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-cyan-400 font-bold">2M+</span>
                    <span className="text-sm font-mono text-slate-300">views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono text-cyan-400 font-bold">4,000+</span>
                    <span className="text-sm font-mono text-slate-300">organic followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-400">amassed in 2 months</span>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/reel/DN1xiAy0E3m/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                >
                  Watch on Instagram →
                </a>
              </div>
            </div>

            <ServicesAndContact onBack={() => setActiveSection('none')} />
          </div>
        </div>
      )}

      {/* Career Timeline */}
      {activeSection === 'career' && (
        <div className="fixed inset-0 z-20 flex items-center justify-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.portfolio-timeline::-webkit-scrollbar { display: none; }`}</style>
          
          <div className="flex space-x-8 sm:space-x-16 md:space-x-32 px-4 sm:px-8 md:px-16 py-8 min-w-full portfolio-timeline animate-fadeIn">
            <TimelineItem
              year="Oct–Dec 2025"
              title="Growth & Creative Marketing Intern"
              subtitle="Naked and Saucy Foods — Vancouver, BC"
              description="Applied a scientific, data-driven approach to marketing—diving deep into customer demographics, purchase patterns, and performance KPIs to shape content strategy for a national CPG brand sold in Costco, Walmart, Loblaws, and major retailers across Canada."
              link="https://nakedandsaucy.com"
              linkText="nakedandsaucy.com"
            />

            <TimelineItem
              year="Sep–Nov 2025"
              title="Mobile Mortgage Specialist Assistant"
              subtitle="TD Bank — Vancouver, BC"
              description="Served as the technical backbone of the mortgage practice by streamlining IT infrastructure and rigorously managing CRM data integrity. Leveraged deep real estate finance knowledge to provide high-touch, expert advisory services directly to clients."
            />

            <TimelineItem
              year="Jan–Oct 2025"
              title="Full-Stack Rota System Developer"
              subtitle="King's College London"
              description="Started as a Disability Support Worker providing academic and accessibility support. Identified inefficiencies and designed a full-stack rota system using Microsoft Power Apps and SharePoint. Secured a funding grant and delivered a GDPR-compliant database improving efficiency up to 50%."
            />

            <TimelineItem
              year="May–Aug 2023"
              title="Python Coder"
              subtitle="Centre for Urban Science and Progress (CUSP) — London"
              description="Tested and validated the Vizent Python Library for visualising data entropy and complexity. Created over 100 comprehensive test cases and presented findings for researchers—supporting real-world applications for UK National Grid, TFL, and international data projects."
              link="https://pypi.org/project/vizent"
              linkText="pypi.org/project/vizent"
            />

            <TimelineItem
              year="Apr–Aug 2023"
              title="KCL Computer Science Hackathon Founder"
              subtitle="King's College London"
              description="Co-designed the inaugural, department-run KCLPuzzled hackathon by developing puzzles grounded in core CS fundamentals—Markov chains, graph search, classical ciphers, and encryption–decryption logic—alongside CS students and AI professors."
            />

            <TimelineItem
              year="Apr–Jun 2023"
              title="Venue Sales Coordinator"
              subtitle="King's College London"
              description="Managed client enquiries and matched event requirements to appropriate KCL venues, overseeing bookings from initial contact through final confirmation. Coordinated with security, catering, and facilities teams to ensure smooth event delivery."
            />

            <TimelineItem
              year="Jan 2019–Sep 2021"
              title="Primary Caregiver — Data Analytics"
              subtitle="NHS — Kent, UK"
              description="Employed by the NHS to provide care for my aunt who requires 24/7 care. Undertook a rigorous personal project in data analytics, ML & Python to improve care quality and predict behavioural patterns."
            />

            <ServicesAndContact onBack={() => setActiveSection('none')} />
          </div>
        </div>
      )}
    </div>
  );
}
