import { useRef, useCallback, useState } from 'react';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { DemoConfig } from './types';

export const useBottomSheetDemo = () => {
  const scrollViewBottomSheetRef = useRef<BottomSheetLib>(null);
  const viewBottomSheetRef = useRef<BottomSheetLib>(null);
  const [activeDemo, setActiveDemo] = useState<string>('');

  const demoConfigs: DemoConfig[] = [
    {
      id: 'scrollView',
      title: 'Scrollable BottomSheet',
      description: 'BottomSheet with BottomSheetScrollView - ideal for long content',
      scrollView: true,
      content: 'This demo shows a BottomSheet with scrollView=true (default), which renders a BottomSheetScrollView inside. Perfect for displaying long lists or content that exceeds the screen height.',
    },
    {
      id: 'view',
      title: 'Static BottomSheet',
      description: 'BottomSheet with BottomSheetView - for fixed content',
      scrollView: false,
      content: 'This demo shows a BottomSheet with scrollView=false, which renders a BottomSheetView inside. Use this when your content is fixed and doesn\'t need scrolling.',
    },
  ];

  const openBottomSheet = useCallback((demoId: string) => {
    setActiveDemo(demoId);
    if (demoId === 'scrollView') {
      scrollViewBottomSheetRef.current?.expand();
    } else if (demoId === 'view') {
      viewBottomSheetRef.current?.expand();
    }
  }, []);

  const closeBottomSheet = useCallback((demoId: string) => {
    if (demoId === 'scrollView') {
      scrollViewBottomSheetRef.current?.close();
    } else if (demoId === 'view') {
      viewBottomSheetRef.current?.close();
    }
    setActiveDemo('');
  }, []);

  return {
    scrollViewBottomSheetRef,
    viewBottomSheetRef,
    demoConfigs,
    activeDemo,
    openBottomSheet,
    closeBottomSheet,
  };
};