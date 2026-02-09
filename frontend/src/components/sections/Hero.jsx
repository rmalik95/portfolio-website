import React, { useEffect, useState } from 'react';
import { ChevronDown, Download, FolderOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { personalInfo, stats } from '../../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const RESUME_URL = `${BACKEND_URL}/api/resume/download`;

const Hero = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles for background animation
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 2
    }));
    setParticles(newParticles);
  }, []);

  const scrollToProjects = () => {
    const section = document.getElementById('projects');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    const section = document.getElementById('about');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated Particle Background */}
      <div className="particle-container pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 255, 218, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 255, 218, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="font-mono text-[#64FFDA] text-sm md:text-base mb-4 animate-fade-in">
              Hi, my name is
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#CCD6F6] mb-4">
              {personalInfo.name}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#A8B2D1] mb-6">
              {personalInfo.title}
            </h2>
            <p className="text-[#B8C5D9] text-base md:text-lg max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {personalInfo.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                onClick={scrollToProjects}
                className="bg-transparent border-2 border-[#64FFDA] text-[#64FFDA] hover:bg-[#64FFDA]/10 px-6 py-3 text-base font-medium rounded-md transition-all duration-300"
              >
                <FolderOpen className="mr-2" size={18} />
                View Projects
              </Button>
              <Button
                asChild
                className="bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 px-6 py-3 text-base font-medium rounded-md transition-all duration-300"
              >
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2" size={18} />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
              {/* Decorative border */}
              <div className="absolute -inset-2 rounded-full border-2 border-[#64FFDA]/30 animate-pulse" />
              <div className="absolute -inset-4 rounded-full border border-[#64FFDA]/10" />
              
              {/* Image */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#64FFDA]/50 glow">
                <img
                  src={personalInfo.headshot}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Ticker */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 border border-[#233554] rounded-lg bg-[#112240]/50 hover:border-[#64FFDA]/30 transition-colors"
            >
              <p className="text-2xl md:text-3xl font-bold text-[#64FFDA] mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-[#B8C5D9]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#64FFDA] animate-bounce cursor-pointer"
        aria-label="Scroll to next section"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
