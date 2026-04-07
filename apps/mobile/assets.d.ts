/**
 * Metro resolves static image imports to a numeric asset id at build time.
 * Without these declarations, TypeScript reports "Cannot find module '*.jpg'".
 */
declare module "*.jpg" {
  const asset: number;
  export default asset;
}

declare module "*.jpeg" {
  const asset: number;
  export default asset;
}

declare module "*.png" {
  const asset: number;
  export default asset;
}

declare module "*.webp" {
  const asset: number;
  export default asset;
}

declare module "*.gif" {
  const asset: number;
  export default asset;
}
