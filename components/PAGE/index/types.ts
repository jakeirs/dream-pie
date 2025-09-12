export interface AnimationButtonProps {
  title: string;
  onPress: () => void;
  variant:
    | 'scale'
    | 'rotate'
    | 'bounce'
    | 'shake'
    | 'fade'
    | 'color'
    | 'spin'
    | 'slide'
    | 'flip'
    | 'pulse';
}

export interface AnimationControlsType {
  handleScaleAnimation: () => void;
  handleRotationAnimation: () => void;
  handleBounceAnimation: () => void;
  handleShakeAnimation: () => void;
  handleFadeAnimation: () => void;
  handleColorAnimation: () => void;
  handleContinuousRotation: () => void;
  handleSlideAnimation: () => void;
  handleFlipAnimation: () => void;
  handlePulseAnimation: () => void;
}

export interface AnimatedValuesType {
  scale: any;
  rotation: any;
  translateX: any;
  translateY: any;
  opacity: any;
  colorProgress: any;
}

export interface BottomSheetControlsType {
  handleOpenBottomSheet: () => void;
  handleCloseBottomSheet: () => void;
}

export interface IndexPageProps {
  className?: string;
}
