import { useEffect, useRef } from 'https://esm.sh/preact/hooks';

/**
 * @param {(event: KeyboardEvent) => void} cb
 */
export const useKeyDown = (cb) => {
  /**
   * @type {preact.RefObject<(event: KeyboardEvent) => void>}
   */
  const eventListenerRef = useRef(null);
  useEffect(() => {
    if (!cb) return;
    eventListenerRef.current = cb;
  }, [cb]);
  useEffect(() => {
    if (!eventListenerRef.current) return;
    window.addEventListener('keydown', eventListenerRef.current);
    return () => {
      if (!eventListenerRef.current) return;
      window.removeEventListener('keydown', eventListenerRef.current);
    };
  }, [eventListenerRef.current]);
};
