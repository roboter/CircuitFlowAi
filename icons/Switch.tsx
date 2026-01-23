
import React from 'react';

export const SwitchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.1" />
    <path d="M4 8h-2M4 16h-2M20 8h2M20 16h2" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
