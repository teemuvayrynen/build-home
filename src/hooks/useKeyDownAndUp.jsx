import { useEffect } from 'react';

export const useKeyDown = (callback, keys) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      const wasAnyKeyPressed = keys.some((key) => event.keyCode === key);
      if (wasAnyKeyPressed) {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [callback, keys]);
};

export const useKeyUp = (callback) => {
  useEffect(() => {
    const onKeyUp = (event) => {
      event.preventDefault();
      callback();
    };
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [callback]);
};