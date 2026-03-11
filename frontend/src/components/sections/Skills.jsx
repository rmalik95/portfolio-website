import React from 'react';
import { skills } from '../../data/mock';

const SkillCategory = ({ category, icon, items }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-foreground font-semibold">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-sm bg-background text-foreground rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors"
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
    <section id="skills" className="py-20 md:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            <span className="font-mono text-primary text-xl md:text-2xl mr-2">05.</span>
            Skills & Expertise
          </h2>
          <div className="flex-1 h-px bg-border ml-6" />
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
          <p className="text-foreground text-sm mb-4">Other Technologies & Tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Agile/Scrum', 'JIRA', 'Confluence', 'Salesforce', 'Data Storytelling', 'Technical Documentation'].map(
              (skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-background text-foreground rounded-full border border-border hover:border-primary/30 hover:text-foreground transition-colors"
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
