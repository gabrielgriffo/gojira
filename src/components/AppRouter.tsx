import { useNavigation } from '../contexts/NavigationContext';
import AppLayout from './AppLayout';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Development from '../pages/Development';
import History from '../pages/History';
import Monitoring from '../pages/Monitoring';

const pages = {
  dashboard: Dashboard,
  development: Development,
  history: History,
  monitoring: Monitoring,
  settings: Settings,
};

export default function AppRouter() {
  const { currentPage } = useNavigation();
  const CurrentPageComponent = pages[currentPage];

  return (
    <AppLayout>
      <CurrentPageComponent />
    </AppLayout>
  );
}