import React from 'react';
import { skills } from '../../data/mock';

const SkillCategory = ({ category, icon, items }) => {
  return (
    <div className="bg-[#132F4C] rounded-lg p-6 border border-[#1E3A5F] hover:border-[#00D4FF]/30 transition-colors">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-[#B4D4F7] font-semibold">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-sm bg-[#0C1929] text-[#B4D4F7] rounded-md border border-[#1E3A5F] hover:border-[#00D4FF]/50 hover:text-[#00D4FF] transition-colors"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 md:py-32 bg-[#132F4C]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#B4D4F7]">
            <span className="font-mono text-[#00D4FF] text-xl md:text-2xl mr-2">04.</span>
            Skills & Expertise
          </h2>
          <div className="flex-1 h-px bg-[#1E3A5F] ml-6" />
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
          <p className="text-[#B4D4F7] text-sm mb-4">Other Technologies & Tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Agile/Scrum', 'JIRA', 'Confluence', 'Salesforce', 'Data Storytelling', 'Technical Documentation'].map(
              (skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-[#0C1929] text-[#B4D4F7] rounded-full border border-[#1E3A5F] hover:border-[#00D4FF]/30 hover:text-[#B4D4F7] transition-colors"
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
