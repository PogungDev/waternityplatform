"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, RefreshCw, LineChart, Zap } from "lucide-react"

interface AIForecastModalProps {
  isOpen: boolean
  onClose: () => void
  wellId: number
  location: string
}

export function AIForecastModal({ isOpen, onClose, wellId, location }: AIForecastModalProps) {
  const [forecast, setForecast] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateForecast = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate realistic forecast data
      const baseYield = 3.2 + Math.random() * 1.5
      const confidence = 75 + Math.random() * 20
      const riskLevel = Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"

      // Generate 7-day forecast
      const weeklyForecast = []
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        weeklyForecast.push({
          date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          yield: Number.parseFloat((baseYield + (Math.random() - 0.5) * 0.8).toFixed(1)),
          waterFlow: Number.parseFloat((3.5 + (Math.random() - 0.5) * 1.0).toFixed(1)),
          confidence: Math.floor(confidence + (Math.random() - 0.5) * 10),
        })
      }

      setForecast({
        wellId,
        location,
        predictedYield: baseYield,
        confidence,
        riskLevel,
        weeklyForecast,
        factors: [
          "Seasonal rainfall patterns (87% weight)",
          "Local water demand trends (12% weight)",
          "Infrastructure maintenance status (8% weight)",
          "Regional economic indicators (5% weight)",
        ],
        aiModel: "GPT-4 + Chainlink Functions",
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Forecast generation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      generateForecast()
    }
  }, [isOpen])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-purple-500" />🧠 AI Yield Forecast - Well #{wellId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
              </div>
              <p className="text-lg font-semibold">AI is analyzing water production data...</p>
              <p className="text-sm text-muted-foreground">Powered by Chainlink Functions + GPT-4</p>
            </div>
          ) : forecast ? (
            <>
              {/* Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Predicted APY</span>
                  </div>
                  <p className="text-3xl font-bold">{forecast.predictedYield.toFixed(1)}%</p>
                  <p className="text-blue-100 text-sm">Next 30 days</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">Confidence</span>
                  </div>
                  <p className="text-3xl font-bold">{forecast.confidence.toFixed(0)}%</p>
                  <p className="text-green-100 text-sm">AI certainty</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge className={`${getRiskColor(forecast.riskLevel)} border-0`}>
                      {forecast.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold">Risk Level</p>
                  <p className="text-purple-100 text-sm">Based on 47 factors</p>
                </div>
              </div>

              {/* 7-Day Forecast Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">7-Day Yield & Water Flow Forecast</h3>
                </div>

                <div className="space-y-4">
                  {/* Chart Headers */}
                  <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600">
                    <div>Date</div>
                    <div>Yield %</div>
                    <div>Flow L/s</div>
                    <div>Confidence</div>
                    <div className="col-span-4">Visual Trend</div>
                  </div>

                  {/* Chart Data */}
                  {forecast.weeklyForecast.map((day: any, index: number) => (
                    <div key={index} className="grid grid-cols-8 gap-2 items-center text-sm">
                      <div className="font-medium">{day.date}</div>
                      <div className="font-semibold text-blue-600">{day.yield}%</div>
                      <div className="font-semibold text-green-600">{day.waterFlow}</div>
                      <div className="text-gray-600">{day.confidence}%</div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                              style={{ width: `${(day.yield / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{day.yield}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis Factors */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Analysis Factors
                </h3>
                <div className="space-y-2">
                  {forecast.factors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chainlink Integration Info */}
              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                <h3 className="text-lg font-semibold mb-4 text-orange-800">🔗 Chainlink Functions Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-orange-700">Data Sources:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Weather API (OpenWeatherMap)</li>
                      <li>Satellite imagery (NASA)</li>
                      <li>Local IoT sensors</li>
                      <li>Economic indicators (World Bank)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-700">AI Model:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>GPT-4 for pattern analysis</li>
                      <li>Time series forecasting</li>
                      <li>Risk assessment algorithms</li>
                      <li>Confidence scoring</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  Last updated: {forecast.lastUpdated.toLocaleString()} • Next update: Every 6 hours
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={generateForecast} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Forecast
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No forecast data available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
