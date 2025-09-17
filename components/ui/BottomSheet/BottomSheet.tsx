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
  index?: number
  backdropAppearsIndex?: number
  enablePanDownToClose?: boolean
}

export interface BottomSheetModalExtendedProps extends Omit<BottomSheetModalProps, 'children'> {
  children: React.ReactNode
  scrollView?: boolean
  isModal: true
}

export type CombinedBottomSheetProps = BottomSheetProps | BottomSheetModalExtendedProps

const BottomSheet = forwardRef<BottomSheetLib, CombinedBottomSheetProps>(
  ({ children, scrollView = true, index = 0, isModal = false, ...props }, ref) => {
    const defaultSnapPoints = useMemo(() => ['50%', '90%'], [])
    const defaultBackdropAppearsIndex = 0

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={defaultBackdropAppearsIndex + 1}
          disappearsOnIndex={defaultBackdropAppearsIndex}
          opacity={0.7}
          pressBehavior="collapse"
        />
      ),
      []
    )

    const renderContent = () =>
      scrollView ? (
        <BottomSheetScrollView className="flex-1">{children}</BottomSheetScrollView>
      ) : (
        <BottomSheetView className="flex-1">{children}</BottomSheetView>
      )

    if (isModal) {
      const modalDefaultProps = {
        enablePanDownToClose: true,
        snapPoints: ['100%'],
        index: 0,
        enableDynamicSizing: false,
        handleIndicatorStyle: { backgroundColor: brandColors.textLight },
        backgroundStyle: { backgroundColor: brandColors.primaryForeground },
        backdropComponent: renderBackdrop,
      }

      const modalCombinedProps = { ...modalDefaultProps, ...props }

      return (
        <BottomSheetModal ref={ref as React.RefObject<BottomSheetModal>} {...modalCombinedProps}>
          {renderContent()}
        </BottomSheetModal>
      )
    }

    const defaultProps = {
      snapPoints: props.snapPoints || defaultSnapPoints,
      index: index,
      enablePanDownToClose: props.enablePanDownToClose ?? true,
      handleIndicatorStyle: { backgroundColor: brandColors.textLight },
      backgroundStyle: { backgroundColor: brandColors.primaryForeground },
      backdropComponent: renderBackdrop,
    }

    const combinedProps = { ...defaultProps, ...props }

    return (
      <BottomSheetLib ref={ref} {...combinedProps}>
        {renderContent()}
      </BottomSheetLib>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

export default BottomSheet
