export function HowWeWork() {
  const steps = [
    {
      number: 1,
      title: 'Understand',
      description: 'We start by listening. What does your operation actually need?',
    },
    {
      number: 2,
      title: 'Prototype',
      description: 'A working pilot in weeks, not months.',
    },
    {
      number: 3,
      title: 'Deploy',
      description: 'Roll out to production with monitoring from day one.',
    },
    {
      number: 4,
      title: 'Iterate',
      description: 'Continuous improvement based on real usage data.',
    },
  ]

  return (
    <section id="how-we-work">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12">How we work</h2>
        <ol className="space-y-10">
          {steps.map((step) => (
            <li key={step.number} className="flex items-start gap-6">
              <span className="text-5xl font-semibold text-neutral-200 leading-none select-none tabular-nums w-12 shrink-0">
                {step.number}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-neutral-500 italic">Small pilots over big promises.</p>
      </div>
    </section>
  )
}
