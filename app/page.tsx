"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Upload } from "lucide-react"
import { parseCSV } from "@/lib/csv-parser"

type Friend = {
  Order: number
  First_Name: string
  Last_Name: string
}

export default function PrizePicker() {
  const [winners, setWinners] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)

    try {
      const text = await file.text()
      const friends = parseCSV<Friend>(text)

      // Shuffle and pick 5 winners
      const shuffled = [...friends].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 5)

      setWinners(selected)
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert("Error parsing CSV file. Please make sure it's a valid CSV with Order, First_Name, and Last_Name columns.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickAgain = () => {
    setIsLoading(true)

    setTimeout(() => {
      if (winners.length > 0) {
        const allFriends = [...winners]
        const shuffled = [...allFriends].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 5)
        setWinners(selected)
      }
      setIsLoading(false)
    }, 800) // Add a small delay for effect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo_tetrate_io.png" alt="Tetrate Logo" className="h-16 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">KubeCon EU 2025</CardTitle>
          <CardDescription className="text-xl">Prize Winner Selector</CardDescription>
        </CardHeader>
        <CardContent>
          {winners.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium">Upload your friends list</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your CSV file with Order, First_Name, and Last_Name columns
                </p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Button variant="outline" className="h-24 w-64 flex flex-col items-center justify-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span>Upload CSV</span>
                </Button>
              </div>
              {fileName && <p className="text-sm text-muted-foreground">File: {fileName}</p>}
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center">
                <Card className="w-full bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
                  <CardContent className="flex items-center p-6">
                    <Trophy className="h-12 w-12 text-yellow-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-bold">Grand Prize Winner</h3>
                      <p className="text-2xl font-semibold text-yellow-800">
                        {winners[0].First_Name} {winners[0].Last_Name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {winners.slice(1).map((winner, index) => (
                  <Card key={index} className="bg-blue-50 border-blue-200">
                    <CardContent className="flex items-center p-4">
                      <Medal className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-600">Runner-up #{index + 1}</h4>
                        <p className="text-lg font-medium">
                          {winner.First_Name} {winner.Last_Name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {winners.length > 0 && (
            <Button onClick={handlePickAgain} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Selecting..." : "Pick Again"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

