import React from 'react';
import { MapPin, GraduationCap, Briefcase, Award } from 'lucide-react';
import { aboutContent, personalInfo } from '../../data/mock';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            <span className="font-mono text-primary text-xl md:text-2xl mr-2">02.</span>
            About Me
          </h2>
          <div className="flex-1 h-px bg-border ml-6" />
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <p className="text-foreground text-base md:text-lg leading-relaxed">
              {aboutContent.intro}
            </p>

            {/* Location Badge */}
            <div className="flex items-center text-foreground text-sm">
              <MapPin size={16} className="text-primary mr-2" />
              <span>{personalInfo.location}</span>
            </div>

            <p className="text-foreground text-base md:text-lg leading-relaxed">
              {aboutContent.drives}
            </p>

            {/* Key Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
                <Briefcase className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-foreground font-medium">Current Role</p>
                  <p className="text-foreground text-sm">Data Scientist at LNER</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
                <Award className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-foreground font-medium">Achievement</p>
                  <p className="text-foreground text-sm">2nd Place Hackathon Winner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="flex items-center text-foreground font-semibold text-lg mb-6">
                <GraduationCap className="text-primary mr-3" size={22} />
                Education
              </h3>
              <div className="space-y-6">
                {aboutContent.education.map((edu, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                    <h4 className="text-foreground font-medium">{edu.degree}</h4>
                    <p className="text-primary text-sm font-mono">{edu.institution}</p>
                    <p className="text-foreground text-xs mt-1">{edu.period}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {edu.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-background text-foreground rounded border border-border"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
