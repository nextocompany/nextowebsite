export function Closing({ line }: { line: string }) {
  return (
    <section aria-label={line} className="bg-charcoal text-mist">
      <div className="mx-auto max-w-page px-4 py-20 sm:px-8 sm:py-28">
        <p className="max-w-4xl text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-5xl th:leading-[1.45] th:tracking-normal">
          {line}
        </p>
      </div>
    </section>
  )
}
