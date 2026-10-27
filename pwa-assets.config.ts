import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

const background = "#096dd9";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The book sits inside Android's circular safe zone, so no padding is needed; just fill the corners.
    maskable: { sizes: [512], padding: 0, resizeOptions: { background } },
    apple: { sizes: [180], padding: 0, resizeOptions: { background } },
  },
  images: ["public/icon.svg"],
});
