export function generateSmartSku(title: string, color?: string, size?: string) {
  const prefix = title.substring(0, 3).toUpperCase();
  const colorCode = color ? color.substring(0, 3).toUpperCase() : "000";
  return `${prefix}-${colorCode}-${size || 'UNI'}`;
}

export function formatSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}