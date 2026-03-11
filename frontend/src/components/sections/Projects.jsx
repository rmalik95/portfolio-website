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
      className={`project-card group relative bg-card rounded-lg p-6 border transition-all duration-300 ${
        project.featured ? 'border-primary/30' : 'border-border'
      } hover:border-primary/50`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Folder className="text-primary" size={24} />
          {project.featured && (
            <Star className="text-primary fill-primary" size={16} />
          )}
        </div>
        {project.badge && (
          <span className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded">
            {project.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <p className="text-primary text-xs font-mono mb-3">
        {project.type} • {project.company}
      </p>
      <p className="text-foreground text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Impact */}
      <div className="space-y-2 mb-4">
        {project.impact.slice(0, 2).map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-foreground text-xs">
            <span className="text-primary mt-0.5">▹</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
        {project.technologies.slice(0, 4).map((tech, index) => (
          <span
            key={index}
            className="text-xs font-mono text-foreground"
          >
            {tech}{index < Math.min(project.technologies.length, 4) - 1 && ' •'}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="text-xs font-mono text-foreground">+{project.technologies.length - 4}</span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none" />
    </div>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            <span className="font-mono text-primary text-xl md:text-2xl mr-2">04.</span>
            Things I've Built
          </h2>
          <div className="flex-1 h-px bg-border ml-6" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Filter size={16} className="text-foreground" />
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              variant="ghost"
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeFilter === category.id
                  ? 'bg-primary/10 text-primary border border-primary'
                  : 'text-foreground border border-border hover:border-primary/50 hover:text-foreground'
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
            className="border-primary text-primary hover:bg-primary/10"
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
