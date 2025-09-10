import { useEffect } from 'react';

export function usePersist(state: any, dispatch: any) {
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('weekendly_v1', JSON.stringify(state));
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  // on mount, try to load
  useEffect(() => {
    const raw = localStorage.getItem('weekendly_v1');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        
        // Migrate old data structure to new structure
        const migratedState = {
          ...parsed,
          ui: {
            theme: parsed.ui?.theme || 'default',
            weekendType: parsed.ui?.weekendType || 'standard',
            customDays: parsed.ui?.customDays || [],
            dismissedHolidaySuggestions: parsed.ui?.dismissedHolidaySuggestions || [],
            selectedActivityId: parsed.ui?.selectedActivityId
          }
        };
        
        dispatch({ type: 'LOAD_STATE', payload: migratedState });
      } catch (e) { /* ignore */ }
    }
  }, []);
}
