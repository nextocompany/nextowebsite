export function HowWeWork() {
  const steps = [
    { num: '01', title: 'Assess', desc: 'We study how you operate today.' },
    { num: '02', title: 'Fit', desc: 'Match the right solution to your workflow.' },
    { num: '03', title: 'Deploy', desc: 'Up and running with minimal disruption.' },
    { num: '04', title: 'Evolve', desc: 'Refine as your operations grow.' },
  ]

  return (
    <section id="how-we-work">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2">Process</h2>
        <div className="w-8 h-0.5 bg-brand-teal mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 rounded-xl overflow-hidden">
          {steps.map((step) => (
            <div key={step.num} className="bg-white p-6 flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                {step.num}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-neutral-400 tracking-wide">We simplify. You operate.</p>
      </div>
    </section>
  )
}
