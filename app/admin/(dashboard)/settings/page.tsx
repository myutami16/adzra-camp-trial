"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-gray-500 dark:text-gray-400">Konfigurasi tampilan dan preferensi admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tema Tampilan</CardTitle>
            <CardDescription>Pilih tema tampilan yang Anda inginkan</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme} className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="cursor-pointer">
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="cursor-pointer">
                  System
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
