import React from 'react';
import { cn } from '../../lib/utils';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div
      className={cn(
        'card',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export { Card };
export default Card;