import { Button } from "@/components/ui/button.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { toast } from "sonner";

export default function FloatingButton({ onClick, disabled, loading, selectedAircraft, selectedVariant, progress }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {loading && (
        <div className="w-64 mb-2">
          <Progress value={progress} className="h-2 bg-zinc-800" />
          <span className="text-xs text-zinc-400 mt-1 block">Generating PDF...</span>
        </div>
      )}
      <Button
        size="lg"
        className="rounded-full shadow-xl bg-gradient-to-r from-blue-700 to-purple-700 text-white hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-400"
        onClick={() => {
          if (!selectedAircraft) {
            toast("Please select an aircraft to generate a PDF checklist.", { description: "You must select an aircraft and variant before generating a checklist." });
            return;
          }
          onClick();
        }}
        disabled={disabled || loading}
      >
        {loading ? "Generating..." : "Generate PDF Checklist"}
      </Button>
    </div>
  );
}
