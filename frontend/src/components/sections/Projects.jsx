import React, { useState } from 'react';
import { ExternalLink, Folder, Star, Filter } from 'lucide-react';
import { projects } from '../../data/mock';
import { Button } from '../ui/button';

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'cloud', label: 'Cloud/DevOps' },
  { id: 'backend', label: 'Backend' }
];

const ProjectCard = ({ project }) => {
  return (
    <div
      className={`project-card group relative bg-[#132F4C] rounded-lg p-6 border transition-all duration-300 ${
        project.featured ? 'border-[#00D4FF]/30' : 'border-[#1E3A5F]'
      } hover:border-[#00D4FF]/50`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Folder className="text-[#00D4FF]" size={24} />
          {project.featured && (
            <Star className="text-[#00D4FF] fill-[#00D4FF]" size={16} />
          )}
        </div>
        {project.badge && (
          <span className="px-2 py-1 text-xs font-mono bg-[#00D4FF]/10 text-[#00D4FF] rounded">
            {project.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-[#B4D4F7] font-semibold text-lg mb-2 group-hover:text-[#00D4FF] transition-colors">
        {project.title}
      </h3>
      <p className="text-[#00D4FF] text-xs font-mono mb-3">
        {project.type} • {project.company}
      </p>
      <p className="text-[#B4D4F7] text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Impact */}
      <div className="space-y-2 mb-4">
        {project.impact.slice(0, 2).map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-[#B4D4F7] text-xs">
            <span className="text-[#00D4FF] mt-0.5">▹</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#1E3A5F]">
        {project.technologies.slice(0, 4).map((tech, index) => (
          <span
            key={index}
            className="text-xs font-mono text-[#B4D4F7]"
          >
            {tech}{index < Math.min(project.technologies.length, 4) - 1 && ' •'}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="text-xs font-mono text-[#B4D4F7]">+{project.technologies.length - 4}</span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#00D4FF]/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none" />
    </div>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 md:py-32 bg-[#0C1929]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#B4D4F7]">
            <span className="font-mono text-[#00D4FF] text-xl md:text-2xl mr-2">03.</span>
            Things I've Built
          </h2>
          <div className="flex-1 h-px bg-[#1E3A5F] ml-6" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Filter size={16} className="text-[#B4D4F7]" />
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              variant="ghost"
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeFilter === category.id
                  ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]'
                  : 'text-[#B4D4F7] border border-[#1E3A5F] hover:border-[#00D4FF]/50 hover:text-[#B4D4F7]'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
          >
            <ExternalLink className="mr-2" size={16} />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
