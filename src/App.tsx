import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRouter from "./components/AppRouter";

function App() {
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
