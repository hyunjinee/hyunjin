import { useContext } from 'react';
import { ScrollContext } from 'contexts/scrollObserver';

export function useScroll() {
  const { scrollY } = useContext(ScrollContext);

  if (scrollY === undefined) {
    throw new Error('useScroll must be used within ScrollObserver');
  }

  return scrollY;
}
