import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Mail, Phone, ArrowUpRight, Copy, Check, Calendar } from 'lucide-react';
import { BRAND_DATA } from '../data/portfolioData.ts';
import { HlsBackgroundVideo } from './HlsBackgroundVideo.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

const FOOTER_VIDEO_URL = './assets/aistudio/motionsites-background-1ed54127_db250406.mp4';

const INQUIRY_TOPICS = [
  'Executive VA & Operations',
  'IT Systems & Security',
  'Customer & Client Care',
  'Custom Workflow Automation',
];

const FORM_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.12,
      staggerChildren: 0.09,
    },
  },
};

const FORM_FIELD_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -24, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('Executive VA & Operations');
  const [clientName, setClientName] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !marqueeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.contact-marquee-track', {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(BRAND_DATA.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const getEncodedSubject = () =>
    encodeURIComponent(`AssistifySteve Inquiry: ${inquiryTopic}${clientName ? ` (${clientName})` : ''}`);

  const getEncodedBody = () => {
    const text = `Hi Steve,\n\nI am interested in your ${inquiryTopic} services.\n\nDetails: ${
      clientMessage || 'I would like to explore working together on streamlining our operational workflows.'
    }\n\nBest regards,\n${clientName || 'Prospective Client'}`;
    return encodeURIComponent(text);
  };

  const emailHref = `mailto:${BRAND_DATA.email}?subject=${getEncodedSubject()}&body=${getEncodedBody()}`;
  const whatsappHref = `https://wa.me/639922442290?text=${getEncodedBody()}`;
  const viberHref = `${BRAND_DATA.viber}&draft=${getEncodedBody()}`;

  const socialLinks = [
    { name: 'Upwork', url: BRAND_DATA.social.upwork },
    { name: 'LinkedIn', url: BRAND_DATA.social.linkedin },
    { name: 'Facebook', url: BRAND_DATA.social.facebook },
    { name: 'Instagram', url: BRAND_DATA.social.instagram },
  ];

  const marqueeText = `${BRAND_DATA.tagline} • `.repeat(8);

  return (
    <footer
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden scroll-mt-[78px] md:scroll-mt-[88px]"
    >
      {/* Flipped Background Video */}
      <HlsBackgroundVideo
        src={FOOTER_VIDEO_URL}
        flipped
        overlayClassName="bg-black/65"
        fadeBottom={false}
      />

      {/* GSAP Marquee */}
      <div ref={marqueeRef} className="relative z-10 w-full overflow-hidden border-y border-stroke/80 py-5 mb-16">
        <div className="contact-marquee-track flex w-max whitespace-nowrap">
          <span className="font-display italic text-4xl md:text-6xl text-text-primary/25 tracking-tight pr-4">
            {marqueeText}
          </span>
          <span className="font-display italic text-4xl md:text-6xl text-text-primary/25 tracking-tight pr-4" aria-hidden="true">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Main Contact Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Top CTA Headline & Direct Email */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
            Get in touch
          </p>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-text-primary mb-6">
            Let&apos;s build something <span className="font-display italic">reliable.</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={BRAND_DATA.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center rounded-full"
            >
              <span
                className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <span className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-text-primary text-bg group-hover:bg-surface group-hover:text-text-primary px-7 py-3.5 text-sm md:text-base font-medium transition-colors">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Book a Discovery Call</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>

            <a
              href={`mailto:${BRAND_DATA.email}`}
              className="group relative inline-flex items-center rounded-full"
            >
              <span
                className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <span className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-surface border border-stroke group-hover:border-transparent px-7 py-3.5 text-sm md:text-base text-text-primary transition-colors">
                <Mail className="w-4 h-4 text-brand-blue" aria-hidden="true" />
                <span>{BRAND_DATA.email}</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </div>
        </ScrollReveal>

        {/* Interactive Contact Grid (All Original Channels & Inquiry Composer Preserved) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Direct Channels */}
          <ScrollReveal delay={0.08} className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-surface/90 backdrop-blur-md border border-stroke p-6">
              <h3 className="font-display italic text-2xl text-text-primary mb-1">
                Direct Action Channels
              </h3>
              <p className="text-xs text-muted mb-5">
                Monitored during executive business hours across global timezones.
              </p>

              <div className="space-y-3">
                {/* Calendar Booking */}
                <a
                  href={BRAND_DATA.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-brand-blue/40 hover:border-brand-blue transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/15 border border-brand-blue/35 flex items-center justify-center text-brand-light shrink-0">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.15em] text-brand-blue">
                        Book a Call
                      </span>
                      <span className="block text-sm text-text-primary group-hover:text-brand-light transition-colors truncate">
                        Schedule on Cal.com
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>

                {/* Email + Copy */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke">
                  <a
                    href={`mailto:${BRAND_DATA.email}`}
                    className="flex items-center gap-3 text-sm text-text-primary hover:text-brand-blue transition-colors min-w-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface border border-stroke flex items-center justify-center text-brand-blue shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">Email</span>
                      <span className="block text-sm truncate">{BRAND_DATA.email}</span>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-2 rounded-xl text-muted hover:text-text-primary hover:bg-surface transition-colors shrink-0"
                    title="Copy Email Address"
                    aria-label="Copy Email Address"
                  >
                    {copied ? <Check className="w-4 h-4 text-brand-blue" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp */}
                <a
                  href={BRAND_DATA.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke hover:border-brand-blue/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-stroke p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src="./assets/aistudio/WhatsApp_24ff4c1a.png"
                        alt="WhatsApp icon"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">WhatsApp</span>
                      <span className="block text-sm text-text-primary group-hover:text-brand-blue transition-colors">
                        {BRAND_DATA.displayPhone}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-text-primary" />
                </a>

                {/* Viber */}
                <a
                  href={BRAND_DATA.viber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke hover:border-brand-blue/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-stroke p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src="./assets/aistudio/Viber_0c9c7e2c.png"
                        alt="Viber icon"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">Viber Direct</span>
                      <span className="block text-sm text-text-primary group-hover:text-brand-blue transition-colors">
                        {BRAND_DATA.displayPhone}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-text-primary" />
                </a>

                {/* Phone */}
                <a
                  href={BRAND_DATA.phone}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke hover:border-brand-blue/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-stroke flex items-center justify-center text-brand-blue shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">Mobile Direct</span>
                      <span className="block text-sm text-text-primary group-hover:text-brand-blue transition-colors">
                        {BRAND_DATA.displayPhone}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-text-primary" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Inquiry Composer with Staggered Field Entry */}
          <div className="lg:col-span-7">
            <motion.div
              data-testid="contact-form-card"
              variants={FORM_CONTAINER_VARIANTS}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="rounded-3xl bg-surface/90 backdrop-blur-md border border-stroke p-6 sm:p-8 overflow-hidden"
            >
              <motion.div
                data-testid="contact-form-field"
                data-field-index="0"
                variants={FORM_FIELD_VARIANTS}
                className="pb-4 border-b border-stroke mb-6"
              >
                <h3 className="font-display italic text-2xl text-text-primary">
                  Send a Pre-Formatted Brief
                </h3>
                <p className="text-xs text-muted mt-1">
                  Select your focus scope and launch directly in Email, WhatsApp, or Viber.
                </p>
              </motion.div>

              {/* Scope Selection Tabs */}
              <motion.div
                data-testid="contact-form-field"
                data-field-index="1"
                variants={FORM_FIELD_VARIANTS}
                className="mb-5"
              >
                <span className="block text-[11px] uppercase tracking-[0.2em] text-muted mb-2.5">
                  1. Focus Scope
                </span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Inquiry scope">
                  {INQUIRY_TOPICS.map((topic) => {
                    const isActive = inquiryTopic === topic;
                    return (
                      <button
                        key={topic}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setInquiryTopic(topic)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                          isActive
                            ? 'bg-text-primary text-bg font-medium'
                            : 'bg-bg text-muted hover:text-text-primary border border-stroke'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                data-testid="contact-form-field"
                data-field-index="2"
                variants={FORM_FIELD_VARIANTS}
                className="mb-4"
              >
                <label
                  htmlFor="client-name-input"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5"
                >
                  2. Your Name or Company (Optional)
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Alex Morgan / Acme Ventures"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-text-primary bg-bg border border-stroke focus:border-brand-blue outline-none placeholder:text-muted/60"
                />
              </motion.div>

              <motion.div
                data-testid="contact-form-field"
                data-field-index="3"
                variants={FORM_FIELD_VARIANTS}
                className="mb-6"
              >
                <label
                  htmlFor="client-message-input"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5"
                >
                  3. Key Project or Support Details
                </label>
                <textarea
                  id="client-message-input"
                  rows={3}
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  placeholder="Tell Steve about your timezone, weekly support hours needed, software stack, or timeline..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-text-primary bg-bg border border-stroke focus:border-brand-blue outline-none resize-none placeholder:text-muted/60"
                />
              </motion.div>

              {/* Launch Actions */}
              <motion.div
                data-testid="contact-form-field"
                data-field-index="4"
                variants={FORM_FIELD_VARIANTS}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <a
                  href={emailHref}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-text-primary text-bg hover:opacity-90 text-xs sm:text-sm font-medium transition-opacity whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" />
                  <span>Launch in Email</span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-bg border border-stroke hover:border-brand-blue text-text-primary text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  <img
                    src="./assets/aistudio/WhatsApp_24ff4c1a.png"
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                  <span>Send via WhatsApp</span>
                </a>

                <a
                  href={viberHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-bg border border-stroke hover:border-brand-blue text-text-primary text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  <img
                    src="./assets/aistudio/Viber_0c9c7e2c.png"
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                  <span>Chat on Viber</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="pt-8 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © 2026 {BRAND_DATA.name} · Stephen Pascua
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>{link.name}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 text-text-primary/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Available for projects</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
