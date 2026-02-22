export function Footer() {
  return (
    <footer className="bg-white">
      <div className="px-8 py-6 flex flex-col items-center gap-3 text-xs text-neutral-500 md:flex-row md:justify-between">
        <p>&copy; 2026 Nexto Co., Ltd.</p>
        <div className="flex items-center gap-3">
          <a href="https://www.facebook.com/nextocompany" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal-dark transition-colors">Facebook</a>
          <span className="text-neutral-300">&middot;</span>
          <a href="https://x.com/nextocompany" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal-dark transition-colors">X</a>
          <span className="text-neutral-300">&middot;</span>
          <a href="https://line.me/R/ti/p/@nextocompany" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal-dark transition-colors">LINE</a>
          <span className="text-neutral-300">&middot;</span>
          <a href="mailto:info@nexto.co.th" className="hover:text-brand-teal-dark transition-colors">Email</a>
          <span className="text-neutral-300">&middot;</span>
          <a href="/privacy" className="hover:text-brand-teal-dark transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
