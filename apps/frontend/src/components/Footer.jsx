import { Separator } from "@/components/ui/separator.jsx";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 py-6 mt-12 border-t border-zinc-800">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center gap-2 px-4">
        <Separator className="mb-2 bg-zinc-700" />
        <span className="text-sm">Aircraft Checklist PDF Generator &copy; {new Date().getFullYear()} &mdash; <a href="https://msfschecklist.de" className="underline hover:text-blue-400 transition-colors">msfschecklist.de</a></span>
        <span className="text-xs text-zinc-500">Made with <span className="text-pink-400">♥</span> for flight sim pilots</span>
      </div>
    </footer>
  );
}
