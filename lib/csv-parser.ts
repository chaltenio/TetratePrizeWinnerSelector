/**
 * Parse CSV text into an array of objects
 * @param csvText The CSV text to parse
 * @returns Array of objects with keys from the header row
 */
export function parseCSV<T>(csvText: string): T[] {
  // Split the text into lines
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "")

  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row")
  }

  // Extract headers (first line)
  const headers = lines[0].split(",").map((header) => header.trim())

  // Process data rows
  const results: T[] = []
  const emailSet = new Set<string>() // Track unique emails

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",").map((value) => value.trim())

    // Skip if the line doesn't have the same number of values as headers
    if (currentLine.length !== headers.length) continue

    const obj: any = {}

    headers.forEach((header, index) => {
      // Try to convert to number if it looks like one
      const value = currentLine[index]
      if (/^\d+$/.test(value)) {
        obj[header] = Number.parseInt(value, 10)
      } else if (/^\d+\.\d+$/.test(value)) {
        obj[header] = Number.parseFloat(value)
      } else {
        obj[header] = value
      }
    })

    // Check for duplicate email
    const email = obj.Last_Name?.toLowerCase()
    if (Last_Name) {
      if (emailSet.has(Last_Name)) {
        // Skip this entry as it's a duplicate
        continue
      }
      emailSet.add(Last_Name)
    }

    results.push(obj as T)
  }

  return results
}

