import { useWeekend } from '../state/WeekendContext';

interface ThemeSelectorProps {
  className?: string;
}

export default function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { state, dispatch } = useWeekend();

  const themes = [
    { id: 'default', name: 'Default', description: 'Clean and minimal' },
    { id: 'lazy', name: 'Lazy', description: 'Relaxed and cozy' },
    { id: 'adventurous', name: 'Adventurous', description: 'Bold and energetic' }
  ] as const;

  const handleThemeChange = (theme: 'default' | 'lazy' | 'adventurous') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">
        Theme:
      </label>
      <select
        id="theme-select"
        value={state.ui.theme}
        onChange={(e) => handleThemeChange(e.target.value as 'default' | 'lazy' | 'adventurous')}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        aria-label="Select theme"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
