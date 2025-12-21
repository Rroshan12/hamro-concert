import React from "react";

type CardWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

function CardWrapper({ children, className = "" }: CardWrapperProps) {
  return (
    <div className={`theme-bg-surface shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 theme-border-primary-100 ${className}`}>
      {children}
    </div>
  );
}

export default CardWrapper;
