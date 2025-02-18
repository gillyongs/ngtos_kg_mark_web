// useOrientation.js

import { useState, useEffect } from 'react';

function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(window.innerWidth < 1000);

  const handleOrientationChange = () => {
    setIsPortrait(window.innerWidth < 900);
  };

  useEffect(() => {
    window.addEventListener('resize', handleOrientationChange);
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return isPortrait;
}

export default useOrientation;
