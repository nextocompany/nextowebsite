export function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12">Contact</h2>
        <p className="text-neutral-600 mb-8">Get in touch to discuss your project.</p>
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <span className="text-sm text-neutral-500 w-12 shrink-0">Email</span>
            <a
              href="mailto:info@nexto.co.th"
              className="underline hover:text-neutral-600"
            >
              info@nexto.co.th
            </a>
          </li>
          <li className="flex items-center gap-4">
            <span className="text-sm text-neutral-500 w-12 shrink-0">LINE</span>
            <a
              href="https://line.me/R/ti/p/@nextocompany"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-600"
            >
              @nextocompany
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
