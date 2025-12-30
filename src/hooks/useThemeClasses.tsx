import { useTheme } from "../contexts/ThemeContext";
import { getThemeClasses } from "../lib/theme";

export const useThemeClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const classes = getThemeClasses(isDark);

  return { isDark, classes };
};
