import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.jsx";
import { useState } from "react";

export default function HelpSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <span>How to Use This Tool</span>
            <span className="ml-2 text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">Help</span>
          </CardTitle>
          <span className="text-zinc-400 text-xl">{open ? '▲' : '▼'}</span>
        </CardHeader>
        {open && (
          <CardContent className="text-zinc-300 text-base animate-fade-in">
            <ol className="list-decimal pl-6 space-y-2">
              <li>Select an aircraft from the list below. Use the search and category filters to find your aircraft quickly.</li>
              <li>Choose the variant (standard or dark) if available. Dark variants are best for night or dark mode viewing.</li>
              <li>Click <span className="font-semibold">Generate PDF Checklist</span> to create and download your checklist.</li>
              <li>Open the PDF on your device or print it for use during your flight.</li>
            </ol>
            <Alert className="mt-4 bg-zinc-800 border-zinc-700">
              <AlertTitle className="text-zinc-100">Tip</AlertTitle>
              <AlertDescription className="text-zinc-400">You can switch between light and dark mode at any time using the toggle in the header.</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
