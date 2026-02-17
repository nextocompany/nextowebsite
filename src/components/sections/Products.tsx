export function Products() {
  return (
    <section id="products">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-neutral-200 rounded-lg p-6">
            <h3>Endyra</h3>
            <p className="text-neutral-600">Workflow orchestration for regulated industries.</p>
            <span className="text-sm text-neutral-400">View</span>
          </div>
          <div className="border border-neutral-200 rounded-lg p-6">
            <h3>Manverra</h3>
            <p className="text-neutral-600">Manufacturing execution and traceability platform.</p>
            <span className="text-sm text-neutral-400">View</span>
          </div>
          <div className="border border-neutral-200 rounded-lg p-6">
            <h3>Careyra</h3>
            <p className="text-neutral-600">Patient management for clinics and hospitals.</p>
            <span className="text-sm text-neutral-400">View</span>
          </div>
        </div>
      </div>
    </section>
  )
}
