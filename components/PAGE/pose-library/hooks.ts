// Following Import Order Standards (React 19+)
import { useState, useEffect } from 'react'
import { Pose } from '@/types/dream'
import { mockPoses, mockSubscriptions } from '@/mockData/dream'

export const usePoseLibrary = (onClose: () => void) => {
  const [poses, setPoses] = useState<Pose[]>([])
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null)
  const [subscription] = useState(mockSubscriptions[0]) // Free tier

  useEffect(() => {
    setPoses(mockPoses)
  }, [])

  const handlePoseSelect = (pose: Pose) => {
    if (pose.isPremium && subscription.tier === 'free') {
      // TODO: Need to open paywall modal - for now just return
      return
    }

    setSelectedPose(pose)
    onClose()
  }

  return {
    poses,
    selectedPose,
    subscription,
    handlePoseSelect,
  }
}