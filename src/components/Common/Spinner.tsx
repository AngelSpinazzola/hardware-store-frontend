interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customSize?: string;
  color?: 'orange' | 'blue';
}

export default function Spinner({ size = 'md', className = '', customSize, color = 'orange' }: SpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const colors = {
    orange: { primary: 'border-orange-500', secondary: 'border-t-pink-400' },
    blue: { primary: 'border-blue-800', secondary: 'border-t-indigo-400' }
  };

  const sizeClass = customSize || sizes[size];
  const colorScheme = colors[color];

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClass} ${colorScheme.primary} rounded-full animate-spin`}></div>
      <div className={`absolute inset-0 ${sizeClass} border-transparent ${colorScheme.secondary} rounded-full animate-spin animation-delay-150`}></div>
    </div>
  );
}
