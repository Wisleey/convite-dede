"use client";

import { useEffect } from "react";

export function ForceTheme() {
  useEffect(() => {
    // Força o tema imediatamente
    const forceTheme = () => {
      document.documentElement.style.backgroundColor = '#000000';
      document.documentElement.style.color = '#ffd700';
      document.documentElement.style.colorScheme = 'dark';
      document.documentElement.classList.add('dark');
      
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffd700';
      document.body.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
      
      // Força em todos os elementos pais
      const elements = ['html', 'body', '#__next', '#root', '[data-reactroot]'];
      elements.forEach(selector => {
        const el = document.querySelector(selector);
        if (el && el instanceof HTMLElement) {
          el.style.backgroundColor = '#000000';
          el.style.color = '#ffd700';
        }
      });
    };

    // Executa imediatamente
    forceTheme();

    // Executa quando a página carrega
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', forceTheme);
    }

    // Executa em intervalos para garantir
    const interval = setInterval(forceTheme, 100);
    
    // Limpa depois de 3 segundos
    setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('DOMContentLoaded', forceTheme);
    };
  }, []);

  return null;
}
