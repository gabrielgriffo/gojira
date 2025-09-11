import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRouter from "./components/AppRouter";
import { useAppInitialization } from "./hooks/useAppInitialization";

function App() {
  // Inicializar o app e controlar splash screen
  useAppInitialization();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationProvider>
          <AppRouter />
        </NavigationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
