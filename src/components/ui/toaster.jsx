// Minimal Toaster placeholder — satisfies the platform scaffold contract.
// Toast notifications are not required for the dashboard to render.
export function Toaster() {
  return null;
}

export function useToast() {
  return { toast: () => {} };
}