// AI Consultation API Integration
// This file handles the communication with the AI diagnostic service

import { type AIConsultationInput, type AIConsultationOutput } from "../types"

// Configuration for AI API
const AI_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_AI_CONSULTATION_API_URL || "https://api.ai-consultation.com",
  apiKey: process.env.NEXT_PUBLIC_AI_CONSULTATION_API_KEY || "",
  timeout: 30000, // 30 seconds
}

// Error types for AI API
export class AIConsultationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = "AIConsultationError"
  }
}

// AI API client class
export class AIConsultationClient {
  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor(config = AI_API_CONFIG) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.timeout = config.timeout
  }

  /**
   * Generate AI diagnosis based on consultation data
   */
  async generateDiagnosis(input: AIConsultationInput): Promise<AIConsultationOutput> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseUrl}/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "X-API-Version": "1.0",
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new AIConsultationError(
          `AI API request failed: ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()
      return this.validateAIResponse(data)
    } catch (error) {
      if (error instanceof AIConsultationError) {
        throw error
      }
      
      if (error.name === "AbortError") {
        throw new AIConsultationError("AI API request timed out", 408, "TIMEOUT")
      }

      throw new AIConsultationError(
        `Failed to generate AI diagnosis: ${error.message}`,
        500,
        "NETWORK_ERROR"
      )
    }
  }

  /**
   * Validate AI API response structure
   */
  private validateAIResponse(data: any): AIConsultationOutput {
    // Basic validation of response structure
    if (!data || typeof data !== "object") {
      throw new AIConsultationError("Invalid AI API response format", 500, "INVALID_RESPONSE")
    }

    if (!data.id_paciente || !data.prediagnosticos_sugeridos || !data.pasos_recomendados) {
      throw new AIConsultationError("Missing required fields in AI API response", 500, "INCOMPLETE_RESPONSE")
    }

    return data as AIConsultationOutput
  }

  /**
   * Get AI service status and health
   */
  async getServiceStatus(): Promise<{ status: string; version: string; uptime: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new AIConsultationError(
          `Health check failed: ${response.statusText}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      throw new AIConsultationError(
        `Failed to check AI service status: ${error.message}`,
        500,
        "HEALTH_CHECK_FAILED"
      )
    }
  }

  /**
   * Get available AI models and their capabilities
   */
  async getAvailableModels(): Promise<Array<{ id: string; name: string; version: string; capabilities: string[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new AIConsultationError(
          `Failed to get models: ${response.statusText}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      throw new AIConsultationError(
        `Failed to get available AI models: ${error.message}`,
        500,
        "MODELS_FETCH_FAILED"
      )
    }
  }
}

// Default client instance
export const aiConsultationClient = new AIConsultationClient()

// Utility functions for common AI operations
export const aiConsultationUtils = {
  /**
   * Transform consultation data to AI-friendly format
   */
  transformConsultationData: (consultationData: any): AIConsultationInput => {
    // This function can be used to transform consultation data
    // into the exact format expected by the AI API
    return consultationData
  },

  /**
   * Parse AI response and extract key information
   */
  parseAIResponse: (response: AIConsultationOutput) => {
    return {
      diagnoses: response.prediagnosticos_sugeridos,
      recommendations: response.pasos_recomendados,
      disclaimer: response.aviso,
      patientId: response.id_paciente,
    }
  },

  /**
   * Calculate confidence score from AI response
   */
  calculateConfidence: (response: AIConsultationOutput): number => {
    if (!response.prediagnosticos_sugeridos.length) return 0
    
    const avgProbability = response.prediagnosticos_sugeridos.reduce(
      (sum, diagnosis) => sum + diagnosis.probabilidad, 
      0
    ) / response.prediagnosticos_sugeridos.length
    
    return avgProbability
  }
}

// Export types for external use
export type { AIConsultationInput, AIConsultationOutput }
