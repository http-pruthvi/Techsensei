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
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};

export { Card };
export default Card;