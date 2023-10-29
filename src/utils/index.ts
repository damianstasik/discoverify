export function findImageUrlByMinWidth(images: any[], width: number) {
  const image = images
    .slice()
    .reverse()
    .find((img) => img.width >= width);

  if (image?.url) {
    return image.url;
  }

  return images[0].url;
}
