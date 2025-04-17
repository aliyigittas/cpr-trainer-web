import { useTheme } from '../context/theme-context';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const icon = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    system: <Monitor size={20} />
  }[theme];

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-row gap-2 w-26 items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {icon} {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </button>
  );
};