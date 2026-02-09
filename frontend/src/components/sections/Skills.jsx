import React, { useEffect, useRef, useState } from 'react';
import { skills } from '../../data/mock';

const SkillBar = ({ name, level, inView }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWidth(level), 100);
      return () => clearTimeout(timer);
    }
  }, [inView, level]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[#8892B0] text-sm">{name}</span>
        <span className="text-[#64FFDA] text-xs font-mono">{level}%</span>
      </div>
      <div className="h-2 bg-[#0A192F] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#64FFDA] to-[#64FFDA]/70 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const SkillCategory = ({ category, icon, items }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-[#112240] rounded-lg p-6 border border-[#233554] hover:border-[#64FFDA]/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-[#CCD6F6] font-semibold">{category}</h3>
      </div>
      <div className="space-y-4">
        {items.map((skill, index) => (
          <SkillBar
            key={index}
            name={skill.name}
            level={skill.level}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 md:py-32 bg-[#112240]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#CCD6F6]">
            <span className="font-mono text-[#64FFDA] text-xl md:text-2xl mr-2">04.</span>
            Skills & Expertise
          </h2>
          <div className="flex-1 h-px bg-[#233554] ml-6" />
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillGroup, index) => (
            <SkillCategory
              key={index}
              category={skillGroup.category}
              icon={skillGroup.icon}
              items={skillGroup.items}
            />
          ))}
        </div>

        {/* Additional Skills Tags */}
        <div className="mt-12 text-center">
          <p className="text-[#8892B0] text-sm mb-4">Other Technologies & Tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Agile/Scrum', 'JIRA', 'Confluence', 'Salesforce', 'Data Storytelling', 'Technical Documentation'].map(
              (skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-[#0A192F] text-[#8892B0] rounded-full border border-[#233554] hover:border-[#64FFDA]/30 hover:text-[#CCD6F6] transition-colors"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
