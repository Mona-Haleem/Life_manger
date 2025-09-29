const theme = (isDark:boolean)=> isDark ? {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    textMuted: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
  } : {
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
  };
export default theme;