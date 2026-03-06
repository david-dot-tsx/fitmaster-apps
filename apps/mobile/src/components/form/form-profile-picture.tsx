import React, { useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Controller, useFormContext } from "react-hook-form";
import { Camera, Images, User } from "lucide-react-native";

import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
export const MODAL_CIRCLE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.72;
export const AVATAR_SIZE = 256;
// Scale ratio used to map modal-space transforms into the smaller avatar circle
const AVATAR_SCALE_RATIO = AVATAR_SIZE / MODAL_CIRCLE_SIZE;

interface ProfilePictureValue {
  uri: string;
  /** Original image dimensions from the image picker */
  originalWidth: number;
  originalHeight: number;
  /** Transform values stored in modal coordinate space */
  scale: number;
  translateX: number;
  translateY: number;
}

interface FormProfilePictureProps {
  name: string;
  transform?: (value: ProfilePictureValue) => Promise<unknown>;
}

export const FormProfilePicture = ({ name, transform }: FormProfilePictureProps) => {
  const { control } = useFormContext();

  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<ProfilePictureValue | null>(null);
  const [pendingImageDimensions, setPendingImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [sourcePickerVisible, setSourcePickerVisible] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Gesture shared values (modal coordinate space)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      // Re-clamp translations after scale changes so image never leaves the circle
      const maxT = (MODAL_CIRCLE_SIZE * (scale.value - 1)) / 2;
      translateX.value = Math.min(Math.max(translateX.value, -maxT), maxT);
      translateY.value = Math.min(Math.max(translateY.value, -maxT), maxT);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const maxT = (MODAL_CIRCLE_SIZE * (scale.value - 1)) / 2;
      translateX.value = Math.min(Math.max(savedTranslateX.value + e.translationX, -maxT), maxT);
      translateY.value = Math.min(Math.max(savedTranslateY.value + e.translationY, -maxT), maxT);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const resetTransform = () => {
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  /** Restore previously saved transforms when re-editing the same image */
  const restoreTransform = (saved: ProfilePictureValue) => {
    scale.value = saved.scale;
    savedScale.value = saved.scale;
    translateX.value = saved.translateX;
    translateY.value = saved.translateY;
    savedTranslateX.value = saved.translateX;
    savedTranslateY.value = saved.translateY;
  };

  const openEditor = (
    uri: string,
    fieldValue: ProfilePictureValue | null,
    dimensions?: { width: number; height: number },
  ) => {
    if (fieldValue?.uri === uri) {
      restoreTransform(fieldValue);
      setPendingImageDimensions({
        width: fieldValue.originalWidth,
        height: fieldValue.originalHeight,
      });
    } else {
      resetTransform();
      setPendingImageDimensions(dimensions ?? null);
    }
    setPendingImageUri(uri);
    setAdjustModalVisible(true);
  };

  const handleAvatarPress = () => {
    setPermissionError(null);
    setSourcePickerVisible(true);
  };

  const handleCloseSourcePicker = () => {
    setSourcePickerVisible(false);
    setPermissionError(null);
  };

  const openCamera = (fieldValue: ProfilePictureValue | null) => async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setPermissionError("Camera access is needed to take a photo.");

      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, width, height } = result.assets[0];
      handleCloseSourcePicker();
      openEditor(uri, fieldValue, { width, height });
    }
  };

  const openGallery = (fieldValue: ProfilePictureValue | null) => async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setPermissionError("Gallery access is needed to pick a photo.");

      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, width, height } = result.assets[0];
      handleCloseSourcePicker();
      openEditor(uri, fieldValue, { width, height });
    }
  };

  const handleCancel = () => {
    setAdjustModalVisible(false);
    setPendingImageUri(null);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const saved = previewValue;

        const handleConfirm = async () => {
          const value: ProfilePictureValue = {
            uri: pendingImageUri!,
            originalWidth: pendingImageDimensions!.width,
            originalHeight: pendingImageDimensions!.height,
            scale: scale.value,
            translateX: translateX.value,
            translateY: translateY.value,
          };
          setPreviewValue(value);
          if (transform) {
            const transformed = await transform(value);
            field.onChange(transformed);
          } else {
            field.onChange(value);
          }
          setAdjustModalVisible(false);
        };

        return (
          <>
            {/* Avatar button */}
            <Pressable
              onPress={handleAvatarPress}
              onLongPress={() => saved && openEditor(saved.uri, saved)}
              className="items-center"
            >
              <View className="size-64 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-500 bg-zinc-700">
                {saved ? (
                  // Reproduce the exact framing by scaling the modal transforms down
                  // to the smaller avatar coordinate space.
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: [
                        { translateX: saved.translateX * AVATAR_SCALE_RATIO },
                        { translateY: saved.translateY * AVATAR_SCALE_RATIO },
                        { scale: saved.scale },
                      ],
                    }}
                  >
                    <Image source={{ uri: saved.uri }} className="size-full" resizeMode="cover" />
                  </View>
                ) : (
                  <User size={56} color="#a1a1aa" />
                )}
              </View>
              <Text className="mt-2 text-sm text-zinc-400">Tap to set photo</Text>
            </Pressable>

            {/* Source picker modal */}
            <Modal isOpen={sourcePickerVisible} onClose={handleCloseSourcePicker} size="sm">
              <ModalBackdrop />
              <ModalContent className="border-zinc-800 bg-zinc-900">
                <View className="gap-3">
                  <Text className="mb-1 text-center text-lg font-bold text-white">
                    Profile Picture
                  </Text>

                  {permissionError && (
                    <Alert action="error" className="mb-1">
                      <AlertIcon as={AlertCircleIcon} />
                      <AlertText size="sm">{permissionError}</AlertText>
                    </Alert>
                  )}

                  <Button
                    onPress={openCamera(saved)}
                    className="flex-row items-center gap-3 rounded-xl bg-zinc-800 p-4 active:bg-zinc-700"
                  >
                    <Camera size={20} color="#a1a1aa" />
                    <ButtonText className="text-base text-white">Take Photo</ButtonText>
                  </Button>

                  <Button
                    onPress={openGallery(saved)}
                    className="flex-row items-center gap-3 rounded-xl bg-zinc-800 p-4 active:bg-zinc-700"
                  >
                    <Images size={20} color="#a1a1aa" />
                    <ButtonText className="text-base text-white">Choose from Gallery</ButtonText>
                  </Button>

                  <Button
                    onPress={handleCloseSourcePicker}
                    className="items-center rounded-xl px-4 py-3 active:bg-zinc-800"
                  >
                    <ButtonText className="text-base text-zinc-400">Cancel</ButtonText>
                  </Button>
                </View>
              </ModalContent>
            </Modal>

            {/* Image adjustment modal */}
            <Modal isOpen={adjustModalVisible} onClose={handleCancel} size="full">
              <ModalBackdrop />
              <ModalContent className="h-full rounded-none border-0 bg-zinc-950">
                <View className="flex-1 items-center justify-center">
                  <Text className="mb-2 text-xl font-bold text-white">Adjust Photo</Text>
                  <Text className="mb-8 text-sm text-zinc-400">
                    Pinch to zoom · Drag to reposition
                  </Text>

                  {/* Circular crop frame */}
                  <View
                    style={{
                      width: MODAL_CIRCLE_SIZE,
                      height: MODAL_CIRCLE_SIZE,
                      borderRadius: MODAL_CIRCLE_SIZE / 2,
                    }}
                    className="overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800"
                  >
                    <GestureDetector gesture={composedGesture}>
                      <Animated.View
                        style={[{ width: "100%", height: "100%" }, animatedImageStyle]}
                      >
                        {pendingImageUri && (
                          <Image
                            source={{ uri: pendingImageUri }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        )}
                      </Animated.View>
                    </GestureDetector>
                  </View>

                  {/* Action buttons */}
                  <View className="mt-10 flex-row gap-4">
                    <Button
                      onPress={handleCancel}
                      className="rounded-xl bg-zinc-700 px-8 py-3 active:bg-zinc-600"
                    >
                      <ButtonText className="text-base font-semibold text-white">Cancel</ButtonText>
                    </Button>
                    <Button
                      onPress={handleConfirm}
                      className="rounded-xl bg-primary-500 px-8 py-3 active:bg-primary-600"
                    >
                      <ButtonText className="text-base font-semibold text-white">
                        Confirm
                      </ButtonText>
                    </Button>
                  </View>
                </View>
              </ModalContent>
            </Modal>
          </>
        );
      }}
    />
  );
};

export type { ProfilePictureValue };
