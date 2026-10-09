/**
 * Splits text into words for line reveals. Uses Intl.Segmenter so Thai is cut
 * at word boundaries, never inside a cluster such as ที่ or ไว้. Spaces and
 * punctuation stay attached to the word before them.
 */
export function segmentWords(text: string, locale: string): string[] {
  const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
  const words: string[] = []
  let leading = ''
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (isWordLike) {
      words.push(leading + segment)
      leading = ''
    } else if (words.length > 0) {
      words[words.length - 1] += segment
    } else {
      leading += segment
    }
  }
  return leading ? [...words, leading] : words
}
