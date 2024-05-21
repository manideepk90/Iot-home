import { PixelRatio } from "react-native";

const useResponsiveFontSize = (fontSize) => {
  const pixelRatio = PixelRatio.get();
  const adjustedFontSize = Math.round(fontSize * pixelRatio);
  return adjustedFontSize;
};

export default useResponsiveFontSize;