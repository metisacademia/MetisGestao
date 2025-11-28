'use client';

import { useToast } from '@/components/ui/use-toast';
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastViewport>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = props.variant ?? 'default';
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              variant === 'destructive' && 'border-destructive bg-destructive/10 text-destructive-foreground',
              variant === 'success' && 'border-green-500/50 bg-green-50 text-green-900',
            )}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
    </ToastViewport>
  );
}
