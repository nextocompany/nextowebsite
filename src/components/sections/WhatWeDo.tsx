export function WhatWeDo() {
  return (
    <section id="what-we-do">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12">What we do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3>Build</h3>
            <p className="text-neutral-600">Custom systems tailored to how your business operates.</p>
          </div>
          <div>
            <h3>Deploy</h3>
            <p className="text-neutral-600">Cloud or on-premise. We handle infrastructure so you don&apos;t have to.</p>
          </div>
          <div>
            <h3>Support</h3>
            <p className="text-neutral-600">Ongoing maintenance, monitoring, and iteration after launch.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
