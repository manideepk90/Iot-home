import { act } from "react-test-renderer";
import { CoolIcon, PowerIcon, SwingIcon } from "./icons";

export const pushButtonsData = [
//   {
//     label: "power",
//     value: 0,
//     icon: { 0: PowerIcon },
//     actionCallback: (value: number) => {
//       return {
//         coolerState: value,
//       };
//     },
//   },
  {
    label: "speed",
    value: 1,
    icon: { 0: "" },
    actionCallback: (value: number) => {
      return {
        coolerState: value,
      };
    },
  },
  {
    label: "cool",
    value: 0,
    icon: { 0: CoolIcon },
    actionCallback: (value: number) => {
      return { coolState: value };
    },
  },
  {
    label: "swing",
    value: 0,
    icon: { 0: SwingIcon },
    actionCallback: (value: number) => {
      return { swingState: value };
    },
  },
];
