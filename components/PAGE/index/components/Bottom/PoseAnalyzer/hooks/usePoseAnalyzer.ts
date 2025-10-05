import { useState } from 'react'
import { useStore } from 'zustand'
import { File } from 'expo-file-system'

import { usePoseStore } from '@/stores'
import { GeminiImageAnalysisRequest, GeminiResponse } from '@/types'
import { PoseAnalyzerState } from '../types'
import { getMimeTypeFromExtension } from '@/shared/types/image'

export const usePoseAnalyzer = (): PoseAnalyzerState & { analyzePose: () => Promise<void> } => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)

  const analyzePose = async (): Promise<void> => {
    if (!selectedPose) {
      console.log('❌ No pose selected')
      setError('No pose selected')
      return
    }

    console.log('📷 Selected pose:', selectedPose.name, selectedPose.imageUrl)

    setIsAnalyzing(true)
    setError(null)
    setAnalyzeResult(null)

    try {
      const file = new File(selectedPose.imageUrl)
      const imageBase64 = await file.base64()

      // Determine MIME type from file extension
      const extension = selectedPose.imageUrl.split('.').pop()?.toLowerCase() || 'jpg'
      const mediaType = getMimeTypeFromExtension(extension)

      const analysisPrompt = `Analyze this pose photo and provide detailed feedback about:
            1. Body posture and positioning
            2. Facial expression and engagement
            3. Overall composition and framing
            4. Lighting and visual appeal
            5. Suggestions for improvement
            6. What makes this pose effective or ineffective

            Please provide constructive, specific feedback in a friendly and helpful tone.`

      const requestData: GeminiImageAnalysisRequest = {
        prompt: analysisPrompt,
        imageBase64,
        mediaType,
      }

      console.log('🚀 Sending request to /api/gemini...')

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('📥 Response status:', response.status, response.statusText)

      const data: GeminiResponse = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze pose')
      }

      setAnalyzeResult(data.text)
    } catch (err) {
      console.error('💥 Pose analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze pose')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    isAnalyzing,
    analyzeResult,
    error,
    analyzePose,
  }
}
