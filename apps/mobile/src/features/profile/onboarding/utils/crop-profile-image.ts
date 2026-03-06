import * as ImageManipulator from "expo-image-manipulator";

import {
  AVATAR_SIZE,
  MODAL_CIRCLE_SIZE,
  type ProfilePictureValue,
} from "@/components/form/form-profile-picture";

/**
 * Converts a ProfilePictureValue (uri + editor transforms + original dimensions)
 * into a cropped & resized File ready to be uploaded.
 *
 * Crop math
 * ---------
 * The editor shows the image via `resizeMode="cover"` inside a square container
 * of MODAL_CIRCLE_SIZE. On top of that the user can pinch-to-zoom (userScale)
 * and pan (translateX / translateY) in the Animated.View.
 *
 * Transform order in the animated style:
 *   [translateX(tx), translateY(ty), scale(s)]
 * React Native applies these right-to-left, so the effective pipeline is:
 *   1. scale(s)  – around the element's own centre
 *   2. translate(tx, ty)
 *
 * To find which rectangle of the original image fills the circular viewport:
 *
 *   coverScale  = max(W / imgW, W / imgH)          — how "cover" scales the image
 *   effectScale = s * coverScale                   — total scale from img → screen
 *
 *   // Centre of the visible crop in original-image pixels:
 *   imgCX = imgW/2  −  tx / effectScale
 *   imgCY = imgH/2  −  ty / effectScale
 *
 *   // How many original pixels fit across the W-pixel viewport at this zoom:
 *   cropSize = W / effectScale
 *
 *   originX = imgCX − cropSize/2
 *   originY = imgCY − cropSize/2
 */
export async function cropProfileImage(value: ProfilePictureValue): Promise<File> {
  const {
    uri,
    originalWidth: imgW,
    originalHeight: imgH,
    scale: userScale,
    translateX,
    translateY,
  } = value;

  const W = MODAL_CIRCLE_SIZE;
  const coverScale = Math.max(W / imgW, W / imgH);
  const effectScale = userScale * coverScale;

  const cropSize = W / effectScale;
  const imgCX = imgW / 2 - translateX / effectScale;
  const imgCY = imgH / 2 - translateY / effectScale;

  // Clamp to valid image bounds
  const originX = Math.max(0, Math.round(imgCX - cropSize / 2));
  const originY = Math.max(0, Math.round(imgCY - cropSize / 2));
  const width = Math.min(Math.round(cropSize), imgW - originX);
  const height = Math.min(Math.round(cropSize), imgH - originY);

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      { crop: { originX, originY, width, height } },
      { resize: { width: AVATAR_SIZE, height: AVATAR_SIZE } },
    ],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
  );

  const response = await fetch(result.uri);
  const blob = await response.blob();

  return new File([blob], "profile.jpg", { type: "image/jpeg" });
}
