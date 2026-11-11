// Transliterare diacritice (ă→a, â→a, î→i, ș/ş→s, ț/ţ→t) in loc sa fie sterse.
// slugify('Semănătoare Zefir') → 'semanatoare-zefir'
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' si ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
