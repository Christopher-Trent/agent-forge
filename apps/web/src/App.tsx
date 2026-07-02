import { Blueprint } from './panels/Blueprint';
import { Loadout } from './panels/Loadout';
import { Traits } from './panels/Traits';
import { Stage } from './three/Stage';
import { useForge } from './store/forge';

export function App() {
  const toast = useForge((state) => state.toast);
  return (
    <main className="app-shell">
      <Blueprint />
      <Stage />
      <div className="right-stack"><Loadout /><Traits /></div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </main>
  );
}
