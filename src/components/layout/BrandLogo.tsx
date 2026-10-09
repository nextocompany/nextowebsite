interface BrandLogoProps {
  /** Path without the theme suffix, e.g. "/brand/nexto-logo". */
  basePath: string
  alt: string
  width: number
  height: number
  className?: string
}

/** Shows the light-ground logo, swapping to the reverse file when the system is dark. */
export function BrandLogo({ basePath, alt, width, height, className }: BrandLogoProps) {
  return (
    <picture>
      <source srcSet={`${basePath}-reverse.svg`} media="(prefers-color-scheme: dark)" />
      <img src={`${basePath}.svg`} alt={alt} width={width} height={height} className={className} />
    </picture>
  )
}
