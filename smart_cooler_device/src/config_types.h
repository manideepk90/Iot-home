#ifndef CONFIG_TYPES_H
#define CONFIG_TYPES_H

enum CoolerState {
    COOLER_OFF = 0,
    COOLER_LOW,
    COOLER_MEDIUM,
    COOLER_HIGH
};

enum SwitchState {
    SWITCH_OFF = 0,
    SWITCH_ON
};

struct Config {
    CoolerState coolerState;
    SwitchState coolState;
    SwitchState swingState;
};

#endif
