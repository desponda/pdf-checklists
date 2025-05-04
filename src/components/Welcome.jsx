import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.jsx";

export default function Welcome() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-6">
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            Welcome to the Aircraft Checklist PDF Generator <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded ml-2">v1.0</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300 text-base">
          <p className="mb-2">
            This application allows you to download complete checklists for Microsoft Flight Simulator aircraft as PDF documents. Perfect for printing or viewing on a tablet during your flights!
          </p>
          <p className="mb-2">
            This tool helps pilots organize their flight preparation by combining all checklist pages into a single, convenient PDF document that can be saved or printed.
          </p>
          <Alert className="mt-4 bg-zinc-800 border-zinc-700">
            <AlertTitle className="text-zinc-100">All checklists are sourced from <a href="https://msfschecklist.de" className="underline hover:text-blue-400">msfschecklist.de</a></AlertTitle>
            <AlertDescription className="text-zinc-400">and compiled into single PDF documents for your convenience.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
