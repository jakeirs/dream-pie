import React, { forwardRef, useCallback, useMemo } from 'react'
import BottomSheetLib, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetProps as BottomSheetLibProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import { brandColors } from '@/shared/theme'

export interface BottomSheetProps extends Omit<BottomSheetLibProps, 'children'> {
  children: React.ReactNode
  scrollView?: boolean
  isModal?: boolean
}

export const BottomSheet = forwardRef<BottomSheetLib | BottomSheetModal, BottomSheetProps>(
  ({ children, scrollView = true, isModal = false, ...props }, ref) => {
    const snapPoints = useMemo(() => ['50%', '90%'], [])

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    )

    const defaultProps: Partial<BottomSheetLibProps> = {
      snapPoints,
      index: -1,
      enablePanDownToClose: true,
      handleIndicatorStyle: { backgroundColor: brandColors.textMuted },
      backgroundStyle: { backgroundColor: brandColors.card },
      backdropComponent: renderBackdrop,
    }

    const combinedProps = { ...defaultProps, ...props }

    const renderContent = () => (
      scrollView ? (
        <BottomSheetScrollView className="flex-1">{children}</BottomSheetScrollView>
      ) : (
        <BottomSheetView className="flex-1">{children}</BottomSheetView>
      )
    )

    if (isModal) {
      return (
        <BottomSheetModal ref={ref} {...combinedProps}>
          {renderContent()}
        </BottomSheetModal>
      )
    }

    return (
      <BottomSheetLib ref={ref} {...combinedProps}>
        {renderContent()}
      </BottomSheetLib>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'
