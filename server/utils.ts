export const slugify = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-')
}
