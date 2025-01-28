import { cn } from '@/lib/utils';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import React from 'react';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  arrow?: 'right' | 'up' | 'down';
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = 'Button', arrow = 'right', className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold',
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        {arrow === 'right' && <ArrowRight />}
        {arrow === 'up' && <ArrowUp />}
        {arrow === 'down' && <ArrowDown />}
      </div>
      <div className="absolute left-[20%] top-[40%] h-0 w-0 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-gray-700" />
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export { InteractiveHoverButton };
