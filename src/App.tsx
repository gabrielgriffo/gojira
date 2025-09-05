import { NavigationProvider } from "./contexts/NavigationContext";
import AppRouter from "./components/AppRouter";

function App() {
  return (
    <NavigationProvider>
      <AppRouter />
    </NavigationProvider>
  );
}

export default App;
