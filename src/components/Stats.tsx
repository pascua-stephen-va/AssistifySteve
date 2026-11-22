import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  {
    value: '10+',
    label: 'Years Experience',
    detail: 'IT Systems & Executive VA Leadership',
  },
  {
    value: '95+',
    label: 'Workflows Automated',
    detail: 'SOPs, CRM Pipelines & Cloud Tenants',
  },
  {
    value: '99.4%',
    label: 'Resolution SLA',
    detail: 'Verified Client Satisfaction & Uptime',
  },
];

export const Stats: React.FC = () => {
  return (
    <section id="stats" className="bg-bg py-16 md:py-24 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="p-8 rounded-3xl bg-surface/40 border border-stroke flex flex-col justify-between"
            >
              <div className="text-6xl md:text-7xl font-display italic text-text-primary tabular-nums tracking-tight mb-4">
                {stat.value}
              </div>
              <div>
                <div className="text-base font-medium text-text-primary mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted">
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
