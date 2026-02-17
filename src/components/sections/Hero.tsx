export function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold">Nexto</h1>
          <p className="text-neutral-500">Enterprise software studio.</p>
          <p className="text-neutral-600">We build systems that run in production.</p>
          <p className="text-neutral-600">From pilot to rollout.</p>
        </div>
        <div className="mt-8 flex gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 px-6 py-2 text-sm font-medium transition-colors duration-150 hover:bg-neutral-100"
          >
            Contact
          </a>
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 px-6 py-2 text-sm font-medium transition-colors duration-150 hover:bg-neutral-100"
          >
            Products
          </a>
        </div>
      </div>
    </section>
  )
}
