export function isSupportWebp() {
  return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
}

export function getImageUrl(name) {
  if (!name) return '';
  
  const ext = isSupportWebp() ? 'webp' : 'png';
  const url = new URL(`../assets/img/${name}.${ext}`, import.meta.url).href;
  return url;
}