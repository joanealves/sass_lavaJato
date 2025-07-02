'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="text-center py-4">
        <a
          href="https://website-schema.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-700 hover:underline text-sm"
        >
          CarFlow - Desenvolvido por Schema Desenvolvimento Web
        </a>
      </div>
    </footer>
  );
};

export default Footer;
