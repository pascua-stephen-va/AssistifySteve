import React, { useState } from 'react';
import { Terminal, Briefcase, HeartHandshake, Check, ChevronRight, Zap } from 'lucide-react';
import { SERVICES_DATA } from '../data/portfolioData.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-brand-blue" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-brand-blue" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-brand-blue" />;
      default:
        return <Zap className="w-5 h-5 text-brand-blue" />;
    }
  };

  const handleSelectService = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="bg-bg py-16 md:py-24 scroll-mt-[78px] md:scroll-mt-[88px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" aria-hidden="true" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-text-primary mb-3">
            Engineered <span className="font-display italic">services</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-xl">
            A cohesive triad of technical IT systems, disciplined executive administration, and empathetic client retention systems.
          </p>
        </ScrollReveal>

        {/* 3 Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {SERVICES_DATA.map((service, index) => {
            const isExpanded = selectedService === service.id;
            return (
              <ScrollReveal
                key={service.id}
                delay={0.08 * index}
                className="h-full"
              >
              <div
                className="h-full group relative rounded-3xl bg-surface/60 hover:bg-surface border border-stroke p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300"
              >
                <div>
                  {/* Top Index + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-bg border border-stroke flex items-center justify-center">
                      {getIcon(service.icon)}
                    </div>
                    <span className="text-xs text-muted uppercase tracking-[0.2em] tabular-nums">
                      0{index + 1} · {service.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display italic text-text-primary mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-muted mb-6 leading-relaxed">
                    {service.summary}
                  </p>

                  {/* Scope Checklist */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      Key Scope Areas
                    </div>
                    {service.scope.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary/85">
                        <Check className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Deliverables */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stroke mb-6">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-brand-blue mb-2.5">
                        Concrete Deliverables
                      </div>
                      <ul className="space-y-1.5">
                        {service.deliverables.map((deliv, dIdx) => (
                          <li
                            key={dIdx}
                            className="text-xs text-muted flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full accent-gradient inline-block shrink-0" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="pt-4 border-t border-stroke flex items-center justify-between gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedService(isExpanded ? null : service.id)}
                    className="text-xs text-muted hover:text-text-primary transition-colors py-1.5"
                  >
                    {isExpanded ? 'Hide Deliverables' : 'View Deliverables'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectService}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-bg border border-stroke text-text-primary hover:border-brand-blue transition-colors whitespace-nowrap"
                  >
                    <span>Engage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
