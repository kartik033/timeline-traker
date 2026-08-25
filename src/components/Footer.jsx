import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full max-w-md mt-8 mb-4 text-center text-[11px] text-white/50 space-x-3">
      <a href="/privacy-policy.html" className="hover:text-white/80 underline transition-colors">
        Privacy Policy
      </a>
      <span aria-hidden="true">·</span>
      <a href="/terms-of-service.html" className="hover:text-white/80 underline transition-colors">
        Terms of Service
      </a>
    </footer>
  );
}