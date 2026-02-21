import Image from 'next/image'

const products = [
  { name: 'Endyra', desc: 'Captures and organizes endoscopy cases. Fast, secure, and OR ready.', logo: '/endyra-logo.svg', url: 'https://endyra.io' },
  { name: 'Manverra', desc: 'Manufacturing execution and traceability platform.', logo: '/manverra-logo.svg', url: 'https://manverra.io' },
  { name: 'Careyra', desc: 'Telemedicine platform for clinics and hospitals.', logo: '/careyra-logo.png', url: 'https://careyra.com' },
]

export function Products() {
  return (
    <section id="products">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-2">Products</h2>
        <div className="w-8 h-0.5 bg-brand-teal mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl p-6 transition-all duration-300 hover:bg-neutral-50 block"
            >
              <div className="absolute left-6 bottom-6 h-[2px] w-0 bg-brand-teal rounded-full group-hover:w-12 transition-all duration-500" />
              {product.logo && (
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 mb-3"
                />
              )}
              <h3 className="text-lg font-semibold group-hover:text-brand-teal transition-colors duration-300">{product.name}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{product.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 group-hover:text-brand-teal group-hover:gap-3 transition-all duration-300">
                Learn more
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </span>
            </a>
          ))}
        </div>
        <p className="mt-8 text-xs text-neutral-400 tracking-wide">Deployed across hospitals, corporate, and border clinics in Thailand.</p>
      </div>
    </section>
  )
}
