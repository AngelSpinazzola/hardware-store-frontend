interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customSize?: string; // Ej: "w-10 h-10"
}

export default function Spinner({ size = 'md', className = '', customSize }: SpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const sizeClass = customSize || sizes[size];

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClass} border-orange-500 rounded-full animate-spin`}></div>
      <div className={`absolute inset-0 ${sizeClass} border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150`}></div>
    </div>
  );
}
