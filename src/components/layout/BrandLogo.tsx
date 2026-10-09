import Image from 'next/image'

interface BrandLogoProps {
  /** Path without the "-reverse" suffix, e.g. "/brand/nexto-logo". */
  basePath: string
  alt: string
  width: number
  height: number
  className?: string
}

/** The site is dark only, so logos always use the reverse (light-on-dark) file. */
export function BrandLogo({ basePath, alt, width, height, className }: BrandLogoProps) {
  return <Image src={`${basePath}-reverse.svg`} alt={alt} width={width} height={height} className={className} />
}
