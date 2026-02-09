import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, Calendar, MapPin } from 'lucide-react';
import { experiences } from '../../data/mock';

const ExperienceCard = ({ experience }) => {
  const [expandedRole, setExpandedRole] = useState(0);

  return (
    <div className="relative">
      {/* Company Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-lg border border-[#233554] overflow-hidden flex-shrink-0 p-2">
          <img 
            src={experience.logo} 
            alt={`${experience.company} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold text-[#CCD6F6]">{experience.company}</h3>
      </div>

      {/* Roles */}
      <div className="space-y-4 ml-7 pl-7 border-l-2 border-[#233554]">
        {experience.roles.map((role, roleIndex) => (
          <div
            key={roleIndex}
            className={`relative bg-[#112240] rounded-lg border transition-all duration-300 ${
              role.current ? 'border-[#64FFDA]/50' : 'border-[#233554]'
            }`}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute left-[-35px] top-6 w-3 h-3 rounded-full border-2 ${
                role.current
                  ? 'bg-[#64FFDA] border-[#64FFDA]'
                  : 'bg-[#0A192F] border-[#495670]'
              }`}
            />

            {/* Role Header */}
            <button
              onClick={() => setExpandedRole(expandedRole === roleIndex ? -1 : roleIndex)}
              className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-[#CCD6F6] font-medium text-lg">{role.title}</h4>
                  {role.current && (
                    <span className="px-2 py-0.5 text-xs font-mono bg-[#64FFDA]/10 text-[#64FFDA] rounded">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#B8C5D9]">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-[#64FFDA]" />
                    {role.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#64FFDA]" />
                    {role.location}
                  </span>
                </div>
              </div>
              <span className="text-[#B8C5D9] mt-1">
                {expandedRole === roleIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>

            {/* Role Details (Expandable) */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedRole === roleIndex ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-[#233554]">
                <ul className="mt-4 space-y-3">
                  {role.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start gap-3 text-[#B8C5D9] text-sm">
                      <span className="text-[#64FFDA] mt-1.5">▹</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {role.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 text-xs font-mono bg-[#0A192F] text-[#64FFDA] rounded border border-[#233554]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-20 md:py-32 bg-[#112240]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#CCD6F6]">
            <span className="font-mono text-[#64FFDA] text-xl md:text-2xl mr-2">02.</span>
            Where I've Worked
          </h2>
          <div className="flex-1 h-px bg-[#233554] ml-6" />
        </div>

        {/* Experience Timeline */}
        <div className="space-y-12">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
