"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, RefreshCw, LineChart } from "lucide-react" // Import LineChart

interface ForecastData {
  tokenId: number
  location: string
  predictedYield: number
  confidence: number
  riskLevel: "low" | "medium" | "high"
  factors: string[]
  lastUpdated: Date
  yieldHistory: { date: string; yield: number }[] // New: dummy yield history
}

interface AIForecastProps {
  tokenId: number
  location: string
}

export function AIForecast({ tokenId, location }: AIForecastProps) {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateForecast = async () => {
    setIsLoading(true)
    try {
      // Simulate AI forecast generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate dummy yield history for visualization
      const generateYieldHistory = (baseYield: number) => {
        const history = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i * 7) // Weekly data
          const yieldChange = (Math.random() - 0.5) * 0.5 // +/- 0.25
          history.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            yield: Number.parseFloat((baseYield + yieldChange).toFixed(1)),
          })
        }
        return history
      }

      // Mock forecast data
      const predictedYield = 2.8 + Math.random() * 2 // 2.8-4.8%
      const mockForecast: ForecastData = {
        tokenId,
        location,
        predictedYield: predictedYield,
        confidence: 75 + Math.random() * 20, // 75-95%
        riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        factors: [
          "Seasonal rainfall patterns",
          "Local water demand trends",
          "Infrastructure maintenance status",
          "Regional economic indicators",
        ],
        lastUpdated: new Date(),
        yieldHistory: generateYieldHistory(predictedYield),
      }

      setForecast(mockForecast)
    } catch (error) {
      console.error("Forecast generation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateForecast()
  }, [tokenId])

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Yield Forecast
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateForecast} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {forecast ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Predicted APY</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{forecast.predictedYield.toFixed(1)}%</div>
                  {forecast.predictedYield > 3 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <Badge variant={getRiskBadgeVariant(forecast.riskLevel)}>{forecast.riskLevel.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Level</span>
                <span className="font-medium">{forecast.confidence.toFixed(0)}%</span>
              </div>
              <Progress value={forecast.confidence} className="h-2" />
            </div>

            {/* New: Simple Yield History Visualization */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LineChart className="h-4 w-4" />
                <span>Yield Trend (Last 7 Weeks)</span>
              </div>
              <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                {forecast.yieldHistory.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="font-medium text-foreground">{data.yield}%</span>
                    <span>{data.date.split(",")[0]}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-20 bg-gray-100 rounded-md flex items-end justify-around p-1">
                {forecast.yieldHistory.map((data, index) => (
                  <div
                    key={index}
                    className="w-2 bg-blue-500 rounded-t-sm"
                    style={{ height: `${(data.yield / 5) * 100}%` }} // Scale to max 5% yield
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Key Factors</div>
              <div className="space-y-1">
                {forecast.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t text-xs text-muted-foreground">
              Last updated: {forecast.lastUpdated.toLocaleString()}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              {isLoading ? "Generating AI forecast..." : "No forecast available"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
