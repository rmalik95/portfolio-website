import React, { useState, useEffect, useRef } from 'react';
import { Send, Mail, MapPin, Linkedin, Github, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { personalInfo, contactSubjects } from '../../data/mock';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field - should remain empty
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  // Security: Track form load time for bot detection
  const [formLoadTime] = useState(Date.now());

  // Security: Track if form has been interacted with
  const [hasInteracted, setHasInteracted] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (formData.name && formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    // Message validation
    if (!formData.message || formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    if (formData.message && formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Security: Sanitize input to prevent XSS
  const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;

    // Remove potentially dangerous characters
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .trim();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Security Check 1: Honeypot detection
    // If the honeypot field (website) is filled, it's likely a bot
    if (formData.website && formData.website.trim().length > 0) {
      console.warn('Bot detected via honeypot');
      // Silently "succeed" to not reveal the honeypot
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
      return;
    }

    // Security Check 2: Time-based bot detection
    // If form submitted too quickly (< 3 seconds), likely a bot
    const submitTime = Date.now();
    const timeTaken = submitTime - formLoadTime;
    const minSubmitTime = 3000; // 3 seconds

    if (timeTaken < minSubmitTime) {
      console.warn('Form submitted too quickly, possible bot');
      setSubmitError('Please take your time filling out the form.');
      return;
    }

    // Security Check 3: User interaction check
    // Basic check to ensure user actually interacted with the form
    if (!hasInteracted) {
      console.warn('No interaction detected');
      setSubmitError('Please fill out the form completely.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Sanitize all inputs before sending
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        message: sanitizeInput(formData.message),
        // Include security metadata
        form_load_time: formLoadTime,
        submit_time: submitTime,
        // Don't include honeypot field in submission
      };

      // Send email via EmailJS
      const emailParams = {
        from_name: sanitizedData.name,
        from_email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams,
        EMAILJS_PUBLIC_KEY
      );

      // Also store in database for backup
      try {
        await axios.post(
          `${API}/contact`,
          sanitizedData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );
      } catch (dbError) {
        console.log('Database backup failed, but email sent successfully');
      }

      // Success
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setHasInteracted(false);

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (error) {
      console.error('Contact form submission error:', error);

      // User-friendly error messages
      if (error.response?.status === 429) {
        setSubmitError('You\'ve sent too many messages. Please try again later.');
      } else if (error.response?.status === 400) {
        setSubmitError('Invalid form data. Please check your inputs.');
      } else {
        setSubmitError(
          'Something went wrong. Please try again or email me directly at ' + personalInfo.email
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    // Mark as interacted
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#0C1929]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-[#00D4FF] text-sm mb-2">05. What's Next?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#B4D4F7] mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-[#B4D4F7] max-w-2xl mx-auto">
            Whether you're looking for a Data Scientist, ML Engineer, or Cloud Architect—or just want to discuss data science and tech—I'd love to connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot Field - Hidden from users, visible to bots */}
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-[#B4D4F7] text-sm font-medium mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  maxLength={100}
                  className={`bg-[#132F4C] border-[#1E3A5F] text-[#B4D4F7] placeholder:text-[#66B2FF] focus:border-[#00D4FF] focus:ring-[#00D4FF] ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#B4D4F7] text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`bg-[#132F4C] border-[#1E3A5F] text-[#B4D4F7] placeholder:text-[#66B2FF] focus:border-[#00D4FF] focus:ring-[#00D4FF] ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-[#B4D4F7] text-sm font-medium mb-2">
                  Subject *
                </label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleChange('subject', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={`bg-[#132F4C] border-[#1E3A5F] text-[#B4D4F7] focus:border-[#00D4FF] focus:ring-[#00D4FF] ${
                    errors.subject ? 'border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#132F4C] border-[#1E3A5F]">
                    {contactSubjects.map((subject, index) => (
                      <SelectItem
                        key={index}
                        value={subject}
                        className="text-[#B4D4F7] focus:bg-[#1E3A5F] focus:text-[#00D4FF]"
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
                <label htmlFor="message" className="block text-[#B4D4F7] text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project, opportunity, or just say hello..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  maxLength={1000}
                  className={`bg-[#132F4C] border-[#1E3A5F] text-[#B4D4F7] placeholder:text-[#66B2FF] focus:border-[#00D4FF] focus:ring-[#00D4FF] resize-none ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
                  <p className="text-[#66B2FF] text-xs ml-auto">{formData.message.length}/1000</p>
                </div>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex items-start gap-2">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              {/* Submit Success */}
              {isSubmitted && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3 flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-green-400 text-sm">
                    Thank you for reaching out! I'll get back to you as soon as possible.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-[#00D4FF] text-[#0C1929] hover:bg-[#66B2FF] font-medium py-3 rounded-md transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#132F4C] rounded-lg p-6 border border-[#1E3A5F] space-y-6">
              <h3 className="text-[#B4D4F7] font-semibold text-lg">Get in Touch</h3>

              {/* Email */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 text-[#B4D4F7] hover:text-[#00D4FF] transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-[#0C1929] rounded-lg border border-[#1E3A5F] group-hover:border-[#00D4FF] transition-colors">
                  <Mail size={18} className="text-[#00D4FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#B4D4F7]">Email</p>
                  <p className="text-sm text-[#B4D4F7] group-hover:text-[#00D4FF]">{personalInfo.email}</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 text-[#B4D4F7]">
                <div className="w-10 h-10 flex items-center justify-center bg-[#0C1929] rounded-lg border border-[#1E3A5F]">
                  <MapPin size={18} className="text-[#00D4FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#B4D4F7]">Location</p>
                  <p className="text-sm text-[#B4D4F7]">{personalInfo.location}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-[#1E3A5F] pt-6">
                <p className="text-[#B4D4F7] text-sm mb-4">Connect with me</p>
                <div className="flex gap-3">
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0C1929] rounded-lg border border-[#1E3A5F] hover:border-[#00D4FF] transition-colors group"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} className="text-[#B4D4F7] group-hover:text-[#00D4FF]" />
                  </a>
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0C1929] rounded-lg border border-[#1E3A5F] hover:border-[#00D4FF] transition-colors group"
                    aria-label="GitHub"
                  >
                    <Github size={18} className="text-[#B4D4F7] group-hover:text-[#00D4FF]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-6 p-4 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
                <p className="text-[#00D4FF] text-sm font-medium">Open to Opportunities</p>
              </div>
              <p className="text-[#B4D4F7] text-xs mt-2">
                Currently exploring opportunities in Data Science, ML Engineering, and Cloud/DevOps roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
