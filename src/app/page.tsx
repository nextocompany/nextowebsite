import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      {/* Typography demo */}
      <section className="space-y-4">
        <h1>Heading 1 — 40px</h1>
        <h2>Heading 2 — 36px</h2>
        <h3>Heading 3 — 28px</h3>
        <p>Body text at 17px with line-height 1.6. The quick brown fox jumps over the lazy dog.</p>
        <p className="text-neutral-500">Muted body text (neutral-500). Secondary information renders here.</p>
      </section>

      {/* Button demo */}
      <section className="space-y-4">
        <p className="text-neutral-500 text-sm">Button component — outlined, rounded-full:</p>
        <div className="flex gap-4 flex-wrap">
          <Button>Contact</Button>
          <Button>Products</Button>
        </div>
      </section>
    </main>
  )
}
