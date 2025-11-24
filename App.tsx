import React, { useState, useEffect, useRef } from "react";

// --- Interactive Utilities ---

const CustomCursor = () => {
  useEffect(() => {
    const dot = document.querySelector('.cursor-dot') as HTMLElement;
    const outline = document.querySelector('.cursor-outline') as HTMLElement;
    
    // Only enable custom cursor logic if elements exist
    if (!dot || !outline) return;

    // Check for touch device is handled via CSS media query for cursor visibility, 
    // but we prevent JS logic execution here to save resources
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    
    const moveCursor = (e: MouseEvent) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Immediate movement for dot
      if(dot) {
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;
      }

      // Smooth movement for outline
      if(outline) {
        outline.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };

    const addHoverState = () => {
      outline?.classList.add('hovered');
    };

    const removeHoverState = () => {
      outline?.classList.remove('hovered');
    };

    window.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverState);
      el.addEventListener('mouseleave', removeHoverState);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverState);
        el.removeEventListener('mouseleave', removeHoverState);
      });
    };
  }, []);

  return null; // Elements are in index.html
};

const RevealOnScroll = ({ children, className = "", delay = 0 }: { children?: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? "active" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CaptureLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`flex flex-col items-center ${className}`}>
    {/* Hexagonal Knot Logo Approximation */}
    <svg viewBox="0 0 100 100" className="w-full h-full fill-capture-gold">
      <path d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 Z" fill="none" stroke="#F2C94C" strokeWidth={8} />
      <path d="M50 20 L75 35 V65 L50 80 L25 65 V35 Z" fill="none" stroke="#F2C94C" strokeWidth={6} />
      <circle cx="50" cy="50" r="10" fill="#F2C94C" />
    </svg>
  </div>
);

const FullLogo = () => (
  <div className="flex items-center gap-4 interactive">
    <CaptureLogo className="w-10 h-10 md:w-12 md:h-12" />
    <div className="flex flex-col justify-center">
      <h1 className="text-xl md:text-2xl font-display font-bold text-white leading-none tracking-wider">
        CAPTURE <br /> HOUSE
      </h1>
      <div className="w-full h-1 bg-capture-red mt-1 rounded-full"></div>
    </div>
  </div>
);

// --- Feature Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Soluções', id: 'solucoes' },
    { label: 'Diferenciais', id: 'diferenciais' },
    { label: 'Imóveis', id: 'imoveis' },
    { label: 'Sobre', id: 'sobre' },
    { label: 'Feedback', id: 'feedback' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "glass-nav py-4 md:py-6"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer relative z-50">
            <FullLogo />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => scrollToSection(item.id)}
                className="text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-capture-gold transition-all relative group interactive"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-capture-red transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contato')}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-sm text-xs uppercase tracking-widest font-bold transition-all duration-300 border-l-4 border-capture-red hover:pl-10 interactive"
            >
              Agendar Consultoria
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-8 h-6 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5 bg-capture-red' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5 bg-capture-red' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#050505] z-30 transition-transform duration-500 flex flex-col justify-center items-center gap-10 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navItems.map((item) => (
          <button 
            key={item.label} 
            onClick={() => scrollToSection(item.id)}
            className="text-3xl font-display font-bold text-white hover:text-capture-gold transition-colors"
          >
            {item.label}
          </button>
        ))}
        <button 
          onClick={() => scrollToSection('contato')}
          className="mt-8 bg-capture-gold text-black px-10 py-5 rounded-sm text-sm uppercase tracking-widest font-bold"
        >
          Agendar Consultoria
        </button>
      </div>
    </>
  );
};

const InfiniteMarquee = () => {
  const terms = ["ESTRATÉGIA", "MARKETING IMOBILIÁRIO", "CAPTUREHOUSE", "GROWTH", "ESCALA", "B2B REAL ESTATE"];
  
  return (
    <div className="w-full bg-[#080808] border-y border-white/5 py-6 md:py-8 overflow-hidden relative z-10">
      <div className="flex w-[300%] md:w-[200%] animate-marquee gap-16 md:gap-32 items-center">
        {[...terms, ...terms, ...terms].map((term, i) => (
          <div key={i} className="flex items-center gap-6 opacity-50">
             <div className="w-2 h-2 bg-capture-gold rotate-45"></div>
             <span className="text-xs md:text-sm font-display font-bold text-gray-400 tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap uppercase">
              {term}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => (
  <section className="relative min-h-[80vh] flex flex-col justify-center pt-48 md:pt-64 pb-20 overflow-hidden bg-[#050505]">
    <div className="absolute inset-0 blueprint-bg opacity-20 z-0 pointer-events-none"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505] z-0"></div>
    
    {/* Ambient Glow */}
    <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-capture-gold/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none"></div>

    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <div className="max-w-5xl mx-auto text-left">
        <RevealOnScroll>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 md:mb-10 leading-[1.05] text-white">
            O MARKETING QUE <br />
            <span className="text-gradient-gold italic pr-4">ESCALA SEU VGV.</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 font-light leading-relaxed">
            Chega de métricas de vaidade. Implemente a estratégia de dados, branding e tráfego feita para vender imóveis de alto padrão.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <button 
              onClick={() => document.getElementById('contato')?.scrollIntoView({behavior: 'smooth'})}
              className="w-full sm:w-auto px-10 py-5 bg-capture-gold hover:bg-[#D4AF37] text-black font-bold rounded-sm text-sm uppercase tracking-wider transition-all duration-300 interactive shadow-lg hover:shadow-capture-gold/20"
            >
              Quero Escalar meu Negócio
            </button>
            <button 
                onClick={() => document.getElementById('solucoes')?.scrollIntoView({behavior: 'smooth'})}
              className="w-full sm:w-auto px-10 py-5 bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-capture-gold rounded-sm font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-4 group interactive"
            >
              <span>Conhecer Consultoria</span>
              <span className="group-hover:translate-x-1 transition-transform text-capture-red">→</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </section>
);

const ServiceRow = ({ title, description, number, index }: { title: string; description: string; number: string; index: number }) => {
  return (
    <RevealOnScroll delay={index * 100}>
      <div className="group relative w-full border-b border-white/5 hover:border-capture-gold transition-all duration-500 cursor-pointer interactive">
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12 relative z-10">
          
          {/* Title Section */}
          <div className="flex-1">
            <h3 className="text-3xl md:text-6xl lg:text-7xl font-display font-bold text-white group-hover:text-capture-gold transition-colors duration-500 uppercase tracking-tighter">
              {title}
            </h3>
          </div>

          {/* Details Section */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto text-left md:text-right gap-6 md:gap-3">
            <span className="font-mono text-base text-capture-red font-bold tracking-widest order-1 md:order-1">
              {number}
            </span>
            <p className="text-gray-500 group-hover:text-white transition-colors duration-300 font-mono text-sm md:text-base max-w-md order-2 md:order-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Hover Arrow - Desktop Only */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-12 group-hover:translate-x-4 transition-all duration-500">
             <svg className="w-16 h-16 text-capture-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
             </svg>
          </div>

        </div>
        
        {/* Background Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </RevealOnScroll>
  );
};

const Services = () => (
  <section id="solucoes" className="py-24 md:py-32 bg-[#050505] relative z-10">
    <div className="container mx-auto px-6 md:px-8 mb-16 md:mb-20">
       <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Nossas Soluções</h2>
          <div className="text-xs font-mono text-capture-gold">Full Service Agency</div>
       </div>
    </div>

    <div className="flex flex-col border-t border-white/5">
      <ServiceRow 
        index={0}
        number="01"
        title="Tráfego Pago" 
        description="Google Ads, Meta Ads & TikTok Ads. Leads qualificados que geram visitas."
      />
      <ServiceRow 
        index={1}
        number="02"
        title="Social Media" 
        description="Direção de arte & Estratégia de conteúdo para posicionamento de autoridade."
      />
      <ServiceRow 
        index={2}
        number="03"
        title="Filmmaking" 
        description="Produção cinematográfica, Drone FPV e Tours Virtuais imersivos."
      />
      <ServiceRow 
        index={3}
        number="04"
        title="Consultoria" 
        description="Scripts de vendas, Implementação de CRM e treinamento comercial."
      />
      <ServiceRow 
        index={4}
        number="05"
        title="Lançamentos" 
        description="Estratégias de represamento de demanda para estandes de vendas."
      />
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section id="diferenciais" className="py-24 md:py-40 bg-[#050505] relative overflow-hidden">
    {/* Structural Grid Background */}
    <div className="absolute inset-0 opacity-5 pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(rgba(242, 201, 76, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 201, 76, 0.3) 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
    </div>

    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Storytelling */}
        <RevealOnScroll>
          <div>
            <div className="inline-block bg-capture-red/10 border border-capture-red/20 px-4 py-2 rounded-full mb-8 md:mb-10">
              <span className="text-capture-red text-xs font-bold uppercase tracking-widest">The Capturehouse Way</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-8 md:mb-12 leading-[1.1]">
              O FIM DO MARKETING <br />
              <span className="text-capture-gold">GENERALISTA.</span>
            </h2>
            
            <div className="space-y-8 text-gray-400 font-light text-base md:text-lg leading-loose">
              <p>
                A maioria das agências trata um imóvel de <strong className="text-white">R$ 10 Milhões</strong> como se fosse um par de tênis em um e-commerce. Elas aplicam estratégias genéricas que trazem leads desqualificados e queimam a paciência do seu time comercial.
              </p>
              <p>
                Na Capturehouse, entendemos que o mercado de <strong className="text-white">Alto Padrão</strong> não é sobre volume, é sobre <strong className="text-white">precisão, estética e desejo</strong>.
              </p>
              <p className="border-l-4 border-capture-gold pl-8 py-2 text-white italic text-xl">
                "Não vendemos cliques. Construímos impérios imobiliários através de dados e imagem cinematográfica."
              </p>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  </section>
);

const PropertyCard = ({ image, title, location, tag, price, index }: { image: string, title: string, location: string, tag: string, price: string, index: number }) => (
  <RevealOnScroll delay={index * 150}>
    <div className="group cursor-pointer interactive">
      <div className="relative overflow-hidden aspect-[4/5] mb-8 border border-white/5 group-hover:border-capture-gold/50 transition-colors">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-20 h-20 bg-capture-gold rounded-full flex items-center justify-center shadow-lg text-black transform scale-75 group-hover:scale-100 transition-transform">
             <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>

        <div className="absolute top-6 left-6 bg-black/80 backdrop-blur text-capture-gold text-xs font-bold px-4 py-2 uppercase tracking-wider border-l-2 border-capture-red">
          {tag}
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <p className="text-capture-gold text-xs font-bold uppercase tracking-widest mb-2">{location}</p>
          <p className="text-white font-display font-bold text-2xl">{price}</p>
        </div>
      </div>
      
      <div className="pl-2">
        <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-capture-gold transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm tracking-wide">Produção de Vídeo + Tráfego</p>
      </div>
    </div>
  </RevealOnScroll>
);

const Portfolio = () => (
  <section id="imoveis" className="py-24 md:py-40 relative bg-[#080808]">
    <div className="container mx-auto px-6 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 md:mb-24 gap-8 md:gap-0">
        <RevealOnScroll>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white">
            PORTFÓLIO <span className="text-capture-gold">VISUAL</span>
          </h2>
        </RevealOnScroll>
        <div className="hidden md:block h-px flex-1 bg-white/10 mx-12"></div>
        <RevealOnScroll>
           <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-gray-500 font-mono text-sm uppercase tracking-widest">
              <div>VGV Gerado: <span className="text-white">R$ 350M+</span></div>
              <div>Leads: <span className="text-white">25.000+</span></div>
           </div>
        </RevealOnScroll>
      </div>

      {/* Altered grid to 2 columns to accommodate 4 items and look more cinematic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
        <PropertyCard 
          index={0}
          image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80"
          title="Mansão Horizon"
          location="Alphaville, SP"
          tag="Video Tour"
          price="R$ 18.500.000"
        />
        <PropertyCard 
          index={1}
          image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
          title="Edifício Legacy"
          location="Jardins, SP"
          tag="Drone FPV"
          price="R$ 450M VGV"
        />
        <PropertyCard 
          index={2}
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
          title="Penthouse One"
          location="Balneário Camboriú"
          tag="Lançamento"
          price="R$ 22.000.000"
        />
        {/* Added 4th Item */}
        <PropertyCard 
          index={3}
          image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80"
          title="Fazenda Boa Vista"
          location="Porto Feliz, SP"
          tag="Lifestyle"
          price="R$ 32.000.000"
        />
      </div>

      {/* New Button to View Full Portfolio */}
      <RevealOnScroll delay={300}>
        <div className="mt-20 flex justify-center">
            <a 
              href="https://www.instagram.com/capturehousebr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-transparent border border-white/20 hover:border-capture-gold text-white font-bold uppercase tracking-widest text-sm transition-all duration-500 overflow-hidden interactive"
            >
                <div className="absolute inset-0 bg-capture-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                <span className="relative z-10 group-hover:text-black flex items-center gap-3">
                    Explorar Acervo Completo
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </a>
        </div>
      </RevealOnScroll>

    </div>
  </section>
);

const Statistic = ({ value, label }: { value: string, label: string }) => (
  <div className="relative aspect-video md:aspect-square flex flex-col justify-center items-center bg-[#050505] hover:bg-[#0a0a0a] transition-all duration-500 group p-10 md:p-12 text-center">
    {/* Hover Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    
    <h3 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-4 group-hover:scale-110 transition-transform duration-500 tracking-tighter">{value}</h3>
    <p className="text-capture-gold text-xs md:text-sm font-bold uppercase tracking-[0.2em] relative z-10">{label}</p>
  </div>
);

const Results = () => (
  <section id="resultados" className="py-0 md:py-20 relative bg-[#050505]">
    <div className="container mx-auto px-0 md:px-6">
      <RevealOnScroll>
        <div className="border-y md:border border-white/10 bg-white/10 gap-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Statistic value="+R$ 350M" label="VGV Gerado" />
          <Statistic value="15+" label="Imobiliárias Ativas" />
          <Statistic value="25k+" label="Leads Qualificados" />
          <Statistic value="+R$ 2M" label="Investido em Ads" />
        </div>
      </RevealOnScroll>
    </div>
  </section>
);

const Partners = () => (
  <section className="py-10 bg-[#080808] border-y border-white/5 overflow-hidden">
    <div className="container mx-auto px-6 md:px-8 mb-6 text-center">
       <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Empresas que confiam na Capturehouse</p>
    </div>
    <div className="relative flex overflow-x-hidden group">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
         {["Sotheby's", "RE/MAX Select", "Keller Williams", "Lopes Elite", "Coelho da Fonseca", "Bossa Nova", "Vanguard", "Porto Cervo"].map((partner, i) => (
            <span key={i} className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider">{partner}</span>
         ))}
         {/* Duplicate for infinite loop illusion */}
         {["Sotheby's", "RE/MAX Select", "Keller Williams", "Lopes Elite", "Coelho da Fonseca", "Bossa Nova", "Vanguard", "Porto Cervo"].map((partner, i) => (
            <span key={`dup-${i}`} className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider">{partner}</span>
         ))}
      </div>
    </div>
  </section>
);

const TeamCard = ({ name, role, image, index }: { name: string; role: string; image: string; index: number }) => (
  <RevealOnScroll delay={index * 100}>
    <div className="group relative h-[450px] md:h-[550px] overflow-hidden border border-white/5 bg-[#0a0a0a] interactive">
      {/* Image */}
      <img 
        src={image} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div className="mb-4 overflow-hidden h-6 flex items-end">
           <p className="text-capture-gold text-xs font-bold uppercase tracking-[0.2em] mb-1 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
             {role}
           </p>
        </div>
        <h3 className="text-4xl font-display font-bold text-white mb-3">{name}</h3>
        <div className="w-16 h-1 bg-capture-red transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
      </div>
    </div>
  </RevealOnScroll>
);

const Team = () => (
  <section id="sobre" className="py-24 md:py-40 bg-[#050505] relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-capture-red"></div>

    <div className="container mx-auto px-6 md:px-8">
      <div className="text-center mb-16 md:mb-24">
        <RevealOnScroll>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            LIDERANÇA <span className="text-capture-gold">ESTRATÉGICA</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Mentes criativas e analíticas focadas em escalar sua operação imobiliária.
          </p>
        </RevealOnScroll>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        <TeamCard 
          index={0}
          name="Gustavo"
          role="CEO • Chief Executive Officer"
          image="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
        />
        <TeamCard 
          index={1}
          name="Vinicius"
          role="CMO • Chief Marketing Officer"
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
        />
        <TeamCard 
          index={2}
          name="Mateus"
          role="CSO • Chief Strategy Officer"
          image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80"
        />
        <TeamCard 
          index={3}
          name="William"
          role="Sócio Investidor"
          image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
        />
      </div>
    </div>
  </section>
);

const VideoTestimonialCard = ({ image, author, role, result, index }: { image: string, author: string, role: string, result: string, index: number }) => (
  <RevealOnScroll delay={index * 100}>
    <div className="relative aspect-[9/16] bg-gray-900 rounded-sm overflow-hidden group cursor-pointer border border-white/10 hover:border-capture-gold transition-all duration-300 interactive">
      <img src={image} alt={author} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
      
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-capture-red group-hover:border-capture-red">
          <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 z-20">
        <div className="bg-capture-gold text-black text-[10px] font-bold px-3 py-1 inline-block rounded-sm mb-3 uppercase tracking-wider">
           {result}
        </div>
        <h4 className="text-white font-bold text-xl leading-tight mb-1">{author}</h4>
        <p className="text-gray-400 text-xs uppercase tracking-wider">{role}</p>
      </div>
    </div>
  </RevealOnScroll>
);

const Feedbacks = () => (
  <section id="feedback" className="py-24 md:py-40 bg-[#080808] relative">
    <div className="container mx-auto px-6 md:px-8">
      <RevealOnScroll>
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
            QUEM VENDE <span className="text-capture-gold">CONFIA</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Histórias reais de corretores e imobiliárias que transformaram seus resultados com nossa metodologia.
          </p>
        </div>
      </RevealOnScroll>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <VideoTestimonialCard 
          index={0}
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
          author="Ricardo M."
          role="Diretor, Luxury Homes"
          result="R$ 15M em 30 dias"
        />
        <VideoTestimonialCard 
          index={1}
          image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
          author="Ana Paula S."
          role="Top Producer"
          result="Recorde de Vendas"
        />
        <VideoTestimonialCard 
          index={2}
          image="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
          author="Carlos E."
          role="CEO, Select Imóveis"
          result="Branding de Autoridade"
        />
         <VideoTestimonialCard 
          index={3}
          image="https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?auto=format&fit=crop&q=80"
          author="Juliana K."
          role="Corretora Autônoma"
          result="200% de ROI"
        />
      </div>

      <div className="mt-16 flex justify-center">
         <button className="text-gray-500 hover:text-capture-gold text-sm uppercase tracking-widest font-bold transition-colors flex items-center gap-3 group interactive">
            Ver todos os depoimentos <span className="group-hover:translate-x-2 transition-transform text-capture-red">→</span>
         </button>
      </div>
    </div>
  </section>
);

const Methodology = () => (
  <section className="py-24 md:py-40 bg-[#050505] relative border-t border-white/5">
    {/* Architectural Background Lines */}
    <div className="absolute inset-0 opacity-10 pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
    </div>

    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <RevealOnScroll>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-center mb-20 md:mb-32">
          
          {/* Awareness Copy */}
          <div>
            <div className="inline-block bg-capture-gold/10 px-4 py-2 rounded-sm border border-capture-gold/30 mb-8">
              <span className="text-capture-gold text-xs font-bold uppercase tracking-widest">A Verdade Sobre Vendas</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              VOCÊ TEM UM BOM PRODUTO. <br />
              <span className="text-gray-500">MAS SEU PROCESSO ESTÁ QUEBRADO.</span>
            </h2>
            
            <div className="space-y-6 text-gray-400 font-light text-base md:text-xl leading-relaxed">
              <p>
                Ter o melhor imóvel da região não adianta se ele não chega no cliente certo. O mercado mudou. Postar fotos no Instagram não é mais suficiente.
              </p>
              <p>
                Você precisa de um <strong className="text-white">Ecossistema de Vendas</strong> previsível. Sem isso, você está contando com a sorte.
              </p>
            </div>

            <div className="mt-12 p-8 bg-white/5 border-l-4 border-capture-gold">
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-3">Oferta Exclusiva</h4>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Ao aplicar abaixo, você concorre a um <strong className="text-capture-gold">Diagnóstico de VGV (Valor: R$ 1.500)</strong> totalmente gratuito. Vamos analisar sua operação e te entregar o caminho das pedras.
              </p>
            </div>
            
            <button 
                onClick={() => document.getElementById('contato')?.scrollIntoView({behavior: 'smooth'})}
                className="mt-8 px-8 py-4 bg-transparent border border-capture-gold text-capture-gold hover:bg-capture-gold hover:text-black font-bold uppercase tracking-widest text-sm transition-all duration-300 w-full md:w-auto interactive"
            >
                Quero meu Diagnóstico
            </button>
          </div>

          {/* Process Visual */}
          <div className="relative mt-12 lg:mt-0">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10"></div>
            
            <div className="space-y-16">
              {[
                { step: "01", title: "Diagnóstico Profundo", desc: "Analisamos onde você está perdendo dinheiro hoje." },
                { step: "02", title: "Plano de Ação", desc: "Criamos a estratégia personalizada para o seu estoque." },
                { step: "03", title: "Implementação", desc: "Nossa equipe assume o controle e a mágica acontece." }
              ].map((item, i) => (
                <div key={i} className="relative pl-24 group">
                  <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center bg-[#0a0a0a] border border-white/10 group-hover:border-capture-gold transition-colors z-10">
                    <span className="font-display font-bold text-xl text-white group-hover:text-capture-gold transition-colors">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-capture-gold transition-colors">{item.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </RevealOnScroll>

      {/* NEW: Ecosystem Deliverables */}
      <RevealOnScroll delay={200}>
        <div className="border-t border-white/10 pt-16 md:pt-24">
            <div className="text-center mb-12 md:mb-16">
                 <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-4 uppercase tracking-wide">
                    O Ecossistema <span className="text-capture-gold">Completo</span>
                </h3>
                <p className="text-gray-500">Tudo o que sua imobiliária precisa em um único lugar.</p>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                    { 
                        title: "Tráfego de Alta Intenção", 
                        items: ["Google Ads (Fundo de Funil)", "Meta Ads (Geração de Desejo)", "TikTok Ads (Viralização)", "Remarketing Omnichannel"] 
                    },
                    { 
                        title: "Creative Studio", 
                        items: ["Vídeos Cinemáticos (4K/6K)", "Drone FPV & Tour Virtual", "Fotografia Editorial", "Roteiros de Venda"] 
                    },
                    { 
                        title: "Consultoria Comercial", 
                        items: ["Diagnóstico de CRM", "Scripts de Abordagem", "Playbook de Vendas", "Treinamento SDR/Closer"] 
                    },
                    { 
                        title: "Growth & Dados", 
                        items: ["Dashboard de BI", "Tracking de Conversão", "Otimização de ROAS", "Relatórios Quinzenais"] 
                    }
                ].map((col, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 hover:border-capture-gold/30 transition-all duration-300 group hover:-translate-y-1">
                        <h4 className="text-lg font-bold text-white mb-6 group-hover:text-capture-gold transition-colors border-b border-white/5 pb-4">{col.title}</h4>
                        <ul className="space-y-4">
                            {col.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                                    <span className="text-capture-gold mt-1.5 w-1.5 h-1.5 bg-capture-gold rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
);

const FAQItem = ({ question, answer, index }: { question: string, answer: string, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <RevealOnScroll delay={index * 100}>
      <div className="border-b border-white/10 last:border-0">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-6 flex items-center justify-between text-left group interactive"
        >
          <span className="text-lg md:text-xl font-display font-bold text-white group-hover:text-capture-gold transition-colors pr-8">
            {question}
          </span>
          <span className={`text-2xl text-capture-gold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            +
          </span>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base pr-8">
            {answer}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
};

const FAQ = () => (
  <section className="py-24 md:py-32 bg-[#050505] relative border-t border-white/5">
    <div className="container mx-auto px-6 md:px-8 max-w-4xl">
      <RevealOnScroll>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            PERGUNTAS <span className="text-capture-gold">FREQUENTES</span>
          </h2>
        </div>
      </RevealOnScroll>
      
      <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-sm">
        <FAQItem 
          index={0}
          question="A Capturehouse atende corretores autônomos?"
          answer="Sim. Temos planos específicos tanto para imobiliárias consolidadas quanto para corretores 'Top Producers' ou que desejam se posicionar como tal no mercado de alto padrão."
        />
        <FAQItem 
          index={1}
          question="Qual o investimento mínimo em tráfego pago?"
          answer="Não existe um valor fixo, mas para o mercado de luxo recomendamos um budget inicial que permita testar públicos e criativos com relevância estatística. Na reunião de diagnóstico definiremos o valor ideal para sua região."
        />
        <FAQItem 
          index={2}
          question="Vocês fazem a captação das imagens e vídeos?"
          answer="Sim. Nossa equipe de Filmmaking se desloca até o imóvel (em todo o Brasil) com equipamentos de cinema e drones FPV para captar o material. A edição e pós-produção também são feitas internamente."
        />
        <FAQItem 
          index={3}
          question="Como funciona o Diagnóstico Gratuito?"
          answer="Analisamos sua presença digital atual, suas campanhas ativas e seu processo comercial. Identificamos gargalos e apresentamos um plano de ação prático. Se fizer sentido, apresentamos nossa proposta comercial ao final."
        />
      </div>
    </div>
  </section>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    niche: "",
    objective: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "5519999592852";
    const message = encodeURIComponent(
      `*Nova Aplicação via Site Capturehouse*\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*Instagram:* ${formData.instagram}\n` +
      `*Atuação:* ${formData.niche}\n` +
      `*Objetivo:* ${formData.objective}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="contato" className="py-24 md:py-40 bg-[#050505] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-capture-gold/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto bg-[#0a0a0a] border border-white/10 p-8 md:p-16 rounded-sm shadow-[0_0_80px_rgba(242,201,76,0.05)]">
          
          <RevealOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                APLIQUE PARA A <span className="text-capture-gold">CONSULTORIA</span>
              </h2>
              <p className="text-gray-400 text-base font-light max-w-2xl mx-auto">
                Preencha o formulário abaixo para ganhar sua <strong className="text-white">Pré-Consultoria Gratuita</strong>.
              </p>
            </div>
          </RevealOnScroll>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-capture-gold font-bold">Nome Completo</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome" 
                  required
                  className="w-full bg-black border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-capture-gold transition-colors rounded-sm interactive"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-capture-gold font-bold">Instagram</label>
                <input 
                  type="text" 
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@seu.perfil" 
                  required
                  className="w-full bg-black border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-capture-gold transition-colors rounded-sm interactive"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-capture-gold font-bold">Nome de Atuação / Nicho</label>
              <input 
                type="text" 
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                placeholder="Ex: Lançamentos, Alto Padrão, Minha Casa Minha Vida..." 
                required
                className="w-full bg-black border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-capture-gold transition-colors rounded-sm interactive"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-capture-gold font-bold">Objetivo Principal</label>
              <textarea 
                rows={5}
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="Ex: Quero aumentar meu VGV, melhorar meu posicionamento..." 
                required
                className="w-full bg-black border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-capture-gold transition-colors rounded-sm interactive"
              ></textarea>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-capture-gold hover:bg-[#D4AF37] text-black font-bold py-5 uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.01] shadow-lg interactive text-sm md:text-base tracking-[0.1em]">
                Enviar Aplicação e Ganhar Diagnóstico
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#020202] py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <CaptureLogo className="w-12 h-12" />
            <span className="text-2xl font-display font-bold text-white">CAPTUREHOUSE</span>
          </div>
          <p className="text-gray-600 text-base leading-relaxed">
            Agência de marketing 360º especializada no mercado imobiliário de alto padrão.
            Tráfego, Vídeo, Edição e Consultoria Comercial.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 w-full md:w-auto">
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-b border-capture-red w-10 pb-3">Soluções</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Tráfego Pago</li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Produção de Vídeo</li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Consultoria</li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Edição</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-b border-capture-red w-10 pb-3">Empresa</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Sobre Nós</li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Cases de Sucesso</li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Carreiras</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-b border-capture-red w-10 pb-3">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">
                <a href="https://wa.me/5519999592852" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">
                <a href="https://www.instagram.com/capturehousebr?igsh=MTg5djBuMm91eGpjaA==" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
              <li className="hover:text-capture-gold cursor-pointer transition-colors interactive">Email</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-20 md:mt-28 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-700 gap-6 md:gap-0">
        <p>&copy; 2025 Capturehouse. Todos os direitos reservados.</p>
        <p>Developed for High Performance.</p>
      </div>
    </div>
  </footer>
);

const WhatsAppButton = () => (
  <a
    href="https://wa.me/5519999592852" 
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-50 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 group interactive"
    aria-label="Fale no WhatsApp"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7 md:w-8 md:h-8 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </a>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-capture-gold/30 selection:text-white overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <InfiniteMarquee />
      <Services />
      <WhyChooseUs />
      <Results />
      <Partners />
      <Portfolio />
      <Team />
      <Feedbacks />
      <Methodology />
      <FAQ />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}