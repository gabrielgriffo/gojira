import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useAppInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitialized(true);

        await invoke('show_main_window');

        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
          splashScreen.classList.add('fade-out');
          setTimeout(() => {
            splashScreen.remove();
            document.body.style.overflow = '';
          }, 500); // 500ms deve coincidir com o transition do CSS
        }
      } catch (err) {
        console.error('Erro na inicialização da aplicação:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');

        try {
          await invoke('show_main_window');
        } catch (showError) {
          console.error('Erro ao mostrar janela:', showError);
        }
      }
    };

    initializeApp();
  }, []);

  return {
    isInitialized,
    error
  };
}