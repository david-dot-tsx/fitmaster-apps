import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const isPreview = process.env.EAS_BUILD_PROFILE === "preview";
  return {
    ...config,
    name: "FitMaster",
    slug: "fitmaster",
    version: "0.0.1",
    runtimeVersion: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.daviddottsx.fitmaster",
    },
    android: {
      package: "com.daviddottsx.fitmaster",
      backgroundColor: "#09090b",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "single",
    },
    backgroundColor: "#09090b",
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      ],
      ["expo-font"],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: isPreview,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    updates: {
      enabled: !isPreview,
      url: "https://u.expo.dev/56928831-fef8-4274-a8f7-d91d2c1c607a",
    },
    extra: {
      eas: {
        projectId: "56928831-fef8-4274-a8f7-d91d2c1c607a",
      },
    },
  };
};
