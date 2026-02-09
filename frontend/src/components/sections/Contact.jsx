import React, { useState } from 'react';
import { Send, Mail, MapPin, Linkedin, Github, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { personalInfo, contactSubjects } from '../../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    if (!formData.message || formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await axios.post(`${API}/contact`, formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError(
        error.response?.data?.detail || 
        'Something went wrong. Please try again or email me directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#0A192F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-[#64FFDA] text-sm mb-2">05. What's Next?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#CCD6F6] mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-[#B8C5D9] max-w-2xl mx-auto">
            Whether you're looking for a Data Scientist, ML Engineer, or Cloud Architect—or just want to discuss data science and tech—I'd love to connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-[#CCD6F6] text-sm font-medium mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`bg-[#112240] border-[#233554] text-[#CCD6F6] placeholder:text-[#495670] focus:border-[#64FFDA] focus:ring-[#64FFDA] ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#CCD6F6] text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`bg-[#112240] border-[#233554] text-[#CCD6F6] placeholder:text-[#495670] focus:border-[#64FFDA] focus:ring-[#64FFDA] ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-[#CCD6F6] text-sm font-medium mb-2">
                  Subject *
                </label>
                <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                  <SelectTrigger className={`bg-[#112240] border-[#233554] text-[#CCD6F6] focus:border-[#64FFDA] focus:ring-[#64FFDA] ${
                    errors.subject ? 'border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112240] border-[#233554]">
                    {contactSubjects.map((subject, index) => (
                      <SelectItem
                        key={index}
                        value={subject}
                        className="text-[#CCD6F6] focus:bg-[#233554] focus:text-[#64FFDA]"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[#CCD6F6] text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project, opportunity, or question..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  maxLength={1000}
                  className={`bg-[#112240] border-[#233554] text-[#CCD6F6] placeholder:text-[#495670] focus:border-[#64FFDA] focus:ring-[#64FFDA] resize-none ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
                  <p className="text-[#495670] text-xs ml-auto">{formData.message.length}/1000</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90 font-medium py-3 rounded-md transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="mr-2" size={18} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={18} />
                    Send Message
                  </>
                )}
              </Button>

              {isSubmitted && (
                <p className="text-[#64FFDA] text-sm text-center">
                  Thanks for reaching out! I'll respond within 24-48 hours.
                </p>
              )}

              {submitError && (
                <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                  <AlertCircle size={16} />
                  <p>{submitError}</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#112240] rounded-lg p-6 border border-[#233554] space-y-6">
              <h3 className="text-[#CCD6F6] font-semibold text-lg">Get in Touch</h3>

              {/* Email */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 text-[#B8C5D9] hover:text-[#64FFDA] transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-[#0A192F] rounded-lg border border-[#233554] group-hover:border-[#64FFDA] transition-colors">
                  <Mail size={18} className="text-[#64FFDA]" />
                </div>
                <div>
                  <p className="text-xs text-[#B8C5D9]">Email</p>
                  <p className="text-sm text-[#CCD6F6] group-hover:text-[#64FFDA]">{personalInfo.email}</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 text-[#B8C5D9]">
                <div className="w-10 h-10 flex items-center justify-center bg-[#0A192F] rounded-lg border border-[#233554]">
                  <MapPin size={18} className="text-[#64FFDA]" />
                </div>
                <div>
                  <p className="text-xs text-[#B8C5D9]">Location</p>
                  <p className="text-sm text-[#CCD6F6]">{personalInfo.location}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#233554] pt-6">
                <p className="text-[#B8C5D9] text-sm mb-4">Connect with me</p>
                <div className="flex gap-4">
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0A192F] rounded-lg border border-[#233554] hover:border-[#64FFDA] transition-colors group"
                  >
                    <Linkedin size={18} className="text-[#B8C5D9] group-hover:text-[#64FFDA]" />
                  </a>
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0A192F] rounded-lg border border-[#233554] hover:border-[#64FFDA] transition-colors group"
                  >
                    <Github size={18} className="text-[#B8C5D9] group-hover:text-[#64FFDA]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-6 p-4 bg-[#64FFDA]/5 border border-[#64FFDA]/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#64FFDA] rounded-full animate-pulse" />
                <p className="text-[#64FFDA] text-sm font-medium">Open to Opportunities</p>
              </div>
              <p className="text-[#B8C5D9] text-xs mt-2">
                Currently exploring roles in Data Science, ML Engineering, and Cloud Architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
