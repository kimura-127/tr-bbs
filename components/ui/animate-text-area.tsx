import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useId } from 'react';

const AnimateTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ placeholder, className, ...props }, ref) => {
  const id = useId();
  return (
    <div className="group relative min-w-[300px]">
      <label
        htmlFor={id}
        className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground"
      >
        <span className="inline-flex bg-background px-2">{placeholder}</span>
      </label>
      <Textarea
        id={id}
        ref={ref}
        placeholder=""
        className={className}
        {...props}
      />
    </div>
  );
});

AnimateTextarea.displayName = 'AnimateTextarea';

export { AnimateTextarea };
