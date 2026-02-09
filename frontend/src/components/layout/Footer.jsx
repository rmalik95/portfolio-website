import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/mock';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A192F] border-t border-[#233554] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-[#8892B0] hover:text-[#64FFDA] transition-colors"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-[#8892B0] hover:text-[#64FFDA] transition-colors text-sm"
          >
            <ArrowUp size={16} />
            <span>Back to Top</span>
          </button>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="font-mono text-[#8892B0] text-xs">
              Built with React & Tailwind CSS
            </p>
            <p className="text-[#495670] text-sm">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
