import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./components/AppRouter";

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppRouter />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
