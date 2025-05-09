import { Separator } from "@/components/ui/separator.jsx";

export default function Footer() {
  return (
    <footer className="w-full glass-card text-zinc-400 py-8 mt-16 border-t border-blue-900/20 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span className="text-sm font-medium">Aircraft Checklist PDF Generator &copy; {new Date().getFullYear()}</span>
          <a href="https://msfschecklist.de" className="underline hover:text-blue-400 transition-colors text-sm">msfschecklist.de</a>
        </div>
        <nav className="flex items-center gap-4 mt-2 md:mt-0">
          <a href="/docs" className="hover:text-blue-400 transition text-sm">Docs</a>
          <a href="/contact" className="hover:text-blue-400 transition text-sm">Contact</a>
          <a href="https://github.com/yourusername/pdf-checklists" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
            GitHub
          </a>
        </nav>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-xs text-zinc-500">Made with <span className="text-pink-400">♥</span> for flight sim pilots</span>
      </div>
    </footer>
  );
}
