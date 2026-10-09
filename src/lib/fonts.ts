import { Anuphan, IBM_Plex_Mono, Montserrat } from 'next/font/google'

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['400', '500'],
  variable: '--font-anuphan',
  display: 'swap',
})

// Mono has no Thai glyphs: English labels and numbers only.
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const fontVariables = [montserrat.variable, anuphan.variable, plexMono.variable].join(' ')
