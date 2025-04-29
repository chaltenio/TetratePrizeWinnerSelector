"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Upload, Mail, AlertCircle } from "lucide-react"
import { parseCSV } from "@/lib/csv-parser"

type Friend = {
  First_Name: string
  Last_Name: string
  Created: string
  email: string
}

export default function PrizePicker() {
  const [winners, setWinners] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [previousWinners, setPreviousWinners] = useState<Set<string>>(new Set())
  const allFriendsRef = useRef<Friend[]>([])
  const [showWarning, setShowWarning] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)
    setShowWarning(false)

    try {
      const text = await file.text()
      const friends = parseCSV<Friend>(text)
      allFriendsRef.current = friends

      // Reset previous winners when uploading a new file
      setPreviousWinners(new Set())

      // Shuffle and pick 5 winners
      const shuffled = [...friends].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 5)

      // Add these winners to the set of previous winners
      const newPreviousWinners = new Set(previousWinners)
      selected.forEach((winner) => newPreviousWinners.add(winner.email))
      setPreviousWinners(newPreviousWinners)

      setWinners(selected)
    } catch (error) {
      console.error("Error parsing CSV:", error)
      alert(
        "Error parsing CSV file. Please make sure it's a valid CSV with First_Name, Last_Name, Created, and company columns.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickAgain = () => {
    setIsLoading(true)
    setShowWarning(false)

    setTimeout(() => {
      if (allFriendsRef.current.length > 0) {
        // Filter out previously selected winners
        const availableFriends = allFriendsRef.current.filter((friend) => !previousWinners.has(friend.email))

        // Check if we have enough available friends
        if (availableFriends.length < 5) {
          setShowWarning(true)
          setIsLoading(false)
          return
        }

        // Shuffle and pick 5 new winners
        const shuffled = [...availableFriends].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 5)

        // Add these winners to the set of previous winners
        const newPreviousWinners = new Set(previousWinners)
        selected.forEach((winner) => newPreviousWinners.add(winner.email))
        setPreviousWinners(newPreviousWinners)

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
            <img src="/logo-black.png" alt="CNS Logo" className="h-16 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">Cloud Native Summit 2025</CardTitle>
          <CardDescription className="text-xl">Prize Winner Selector</CardDescription>
        </CardHeader>
        <CardContent>
          {winners.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium">Upload the friends list</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your CSV file with First_Name, Last_Name, Created, and email columns
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
              {showWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Not enough unique names left in the list. Please upload a new file to continue.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center">
                <Card className="w-full bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
                  <CardContent className="flex flex-col p-6">
                    <div className="flex items-center mb-3">
                      <Trophy className="h-12 w-12 text-yellow-600 mr-4" />
                      <div>
                        <h3 className="text-xl font-bold">Grand Prize Winner</h3>
                        <p className="text-2xl font-semibold text-yellow-800">
                          {winners[0].First_Name} {winners[0].Last_Name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 bg-yellow-50 p-2 rounded-md">
                      <Mail className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-sm font-medium text-yellow-700">{winners[0].Company}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {winners.slice(1).map((winner, index) => (
                  <Card key={index} className="bg-blue-50 border-blue-200">
                    <CardContent className="flex flex-col p-4">
                      <div className="flex items-center mb-2">
                        <Medal className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-600">Runner-up #{index + 1}</h4>
                          <p className="text-lg font-medium">
                            {winner.First_Name} {winner.Last_Name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 bg-white/80 p-1.5 rounded-md">
                        <Mail className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                        <p className="text-xs font-medium text-blue-600">{winner.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {winners.length > 0 && (
            <>
              <Button onClick={handlePickAgain} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Selecting..." : "Pick Again"}
              </Button>
              {previousWinners.size > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  {previousWinners.size - winners.length} previous winners excluded from selection
                </p>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

