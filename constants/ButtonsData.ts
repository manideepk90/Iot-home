import { CoolIcon, SwingIcon } from "./icons";

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
    key: "coolerState",
    icon: { 0: "" },
    values: [0, 1, 3],
    actionCallback: (value: number) => {
      return {
        coolerState: value === 0 ? 1 : value === 1 ? 3 : 0,
      };
    },
  },
  {
    label: "cool",
    key: "coolState",
    icon: { 0: CoolIcon },
    values: [0, 1],
    actionCallback: (value: number) => {
      return { coolState: value === 0 ? 1 : 0 };
    },
  },
  {
    label: "swing",
    key: "swingState",
    icon: { 0: SwingIcon },
    values: [0, 1],
    actionCallback: (value: number) => {
      return { swingState: value === 0 ? 1 : 0 };
    },
  },
];
