export const colors = {
  dark: {
    // Backgrounds
    bg: {
      primary: "bg-slate-950",
      secondary: "bg-slate-900",
      tertiary: "bg-slate-800",
      hover: "hover:bg-slate-800/50",
      card: "bg-slate-900",
    },
    // Borders
    border: {
      primary: "border-slate-800",
      secondary: "border-slate-700",
      hover: "hover:border-blue-500",
    },
    // Text
    text: {
      primary: "text-white",
      secondary: "text-slate-400",
      tertiary: "text-slate-500",
      heading: "text-white",
    },
    // Input
    input: {
      bg: "bg-slate-800",
      border: "border-slate-700",
      text: "text-white",
      placeholder: "placeholder-slate-400",
      focus: "focus:border-blue-500",
    },
    // Status badges
    status: {
      available: "bg-green-500/10 text-green-500",
      in_use: "bg-blue-500/10 text-blue-500",
      maintenance: "bg-yellow-500/10 text-yellow-500",
      retired: "bg-slate-500/10 text-slate-400",
      disposed: "bg-red-500/10 text-red-500",
    },
    condition: {
      excellent: "bg-green-500/10 text-green-500",
      good: "bg-blue-500/10 text-blue-500",
      fair: "bg-yellow-500/10 text-yellow-500",
      poor: "bg-orange-500/10 text-orange-500",
      damaged: "bg-red-500/10 text-red-500",
    },
  },
  light: {
    // Backgrounds
    bg: {
      primary: "bg-slate-50",
      secondary: "bg-white",
      tertiary: "bg-slate-100",
      hover: "hover:bg-slate-100",
      card: "bg-white",
    },
    // Borders
    border: {
      primary: "border-slate-200",
      secondary: "border-slate-300",
      hover: "hover:border-blue-500",
    },
    // Text
    text: {
      primary: "text-slate-900",
      secondary: "text-slate-600",
      tertiary: "text-slate-500",
      heading: "text-slate-900",
    },
    // Input
    input: {
      bg: "bg-white",
      border: "border-slate-300",
      text: "text-slate-900",
      placeholder: "placeholder-slate-400",
      focus: "focus:border-blue-500",
    },
    // Status badges
    status: {
      available: "bg-green-100 text-green-800",
      in_use: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      retired: "bg-slate-100 text-slate-800",
      disposed: "bg-red-100 text-red-800",
    },
    condition: {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-orange-100 text-orange-800",
      damaged: "bg-red-100 text-red-800",
    },
  },
};

export const getThemeClasses = (isDark: boolean) => {
  return isDark ? colors.dark : colors.light;
};
