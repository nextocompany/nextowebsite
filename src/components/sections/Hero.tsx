import Image from 'next/image'

export function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <div className="flex flex-col items-center space-y-6">
          <Image
            src="/hero-icon.svg"
            alt="Enterprise software systems"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-4xl md:text-5xl font-light text-neutral-900">
            Your operations<br />simplified
          </h1>

        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 px-6 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-neutral-100"
          >
            Products
          </a>
        </div>
      </div>
    </section>
  )
}
