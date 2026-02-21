export function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2">Connect</h2>
        <div className="w-8 h-0.5 bg-brand-teal mb-6" />
        <p className="text-sm text-neutral-500 mb-10">Tell us what slows you down. We&apos;ll show you what&apos;s possible.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 rounded-xl overflow-hidden">
          <a
            href="mailto:info@nexto.co.th"
            className="group bg-white p-6 flex flex-col gap-1 transition-colors hover:bg-neutral-50"
          >
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Email</span>
            <span className="text-sm font-medium text-neutral-900 group-hover:text-brand-teal transition-colors">info@nexto.co.th</span>
          </a>
          <a
            href="https://line.me/R/ti/p/@nextocompany"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 flex flex-col gap-1 transition-colors hover:bg-neutral-50"
          >
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Line</span>
            <span className="text-sm font-medium text-neutral-900 group-hover:text-brand-teal transition-colors">@nextocompany</span>
          </a>
          <a
            href="https://www.facebook.com/nextocompany"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 flex flex-col gap-1 transition-colors hover:bg-neutral-50"
          >
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Facebook</span>
            <span className="text-sm font-medium text-neutral-900 group-hover:text-brand-teal transition-colors">nextocompany</span>
          </a>
          <div className="bg-white p-6 flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Telephone</span>
            <span className="text-sm font-medium text-neutral-900">062-269-6639</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-neutral-400 tracking-wide">We typically reply within 24 hours.</p>
      </div>
    </section>
  )
}
