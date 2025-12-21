type IconButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
};

function IconButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary",
  className = "" 
}: IconButtonProps) {
  const baseClasses = "rounded-full p-1 transition-colors cursor-pointer";
  const variantClasses = variant === "primary" 
    ? "bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
    : "bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400";
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default IconButton;
