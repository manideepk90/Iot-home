#ifndef COOLER_DEVICE_H
#define COOLER_DEVICE_H

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include "storage.h"
#include "config_types.h"

// OUTPUT PINS
#define COOLER_PIN_1 27 // LOW SPEED
#define COOLER_PIN_2 12 // HIGH SPEED
#define COOL_PIN 14     // COOL
#define SWING_PIN 32    // SWING

// INPUT PINS (Push buttons)
#define COOLER_INPUT 4
#define COOL_INPUT 13
#define SWING_INPUT 15

// Light pins (optional for feedback)
#define COOLER_HIGH_LIGHT 26
#define COOLER_LOW_LIGHT 25
#define SWING_LIGHT 33
#define COOL_LIGHT 23

Config config = {COOLER_OFF, SWITCH_OFF, SWITCH_OFF};

// Debounce states per push button
struct Button
{
    uint8_t pin;
    bool pressed = false;
    bool handled = false;
    unsigned long lastDebounceTime = 0;
    int lastState = HIGH;

    Button(uint8_t p) : pin(p) {}
};

const unsigned long debounceDelay = 200;

Button coolerButton = {COOLER_INPUT};
Button coolButton = {COOL_INPUT};
Button swingButton = {SWING_INPUT};

void initConnectionSetup()
{
    pinMode(COOLER_PIN_1, OUTPUT);
    pinMode(COOLER_PIN_2, OUTPUT);
    pinMode(COOL_PIN, OUTPUT);
    pinMode(SWING_PIN, OUTPUT);

    // Button inputs
    pinMode(COOLER_INPUT, INPUT_PULLUP);
    pinMode(COOL_INPUT, INPUT_PULLUP);
    pinMode(SWING_INPUT, INPUT_PULLUP);

    // Optional: initialize lights
    pinMode(COOLER_HIGH_LIGHT, OUTPUT);
    pinMode(COOLER_LOW_LIGHT, OUTPUT);
    pinMode(COOL_LIGHT, OUTPUT);
    pinMode(SWING_LIGHT, OUTPUT);
}

void updateLights()
{
    if (config.coolerState == COOLER_HIGH || config.coolerState == COOLER_MEDIUM)
    {
        digitalWrite(COOLER_HIGH_LIGHT, HIGH);
        digitalWrite(COOLER_LOW_LIGHT, LOW);
    }
    else if (config.coolerState == COOLER_LOW)
    {
        digitalWrite(COOLER_HIGH_LIGHT, LOW);
        digitalWrite(COOLER_LOW_LIGHT, HIGH);
    }
    else
    {
        digitalWrite(COOLER_HIGH_LIGHT, LOW);
        digitalWrite(COOLER_LOW_LIGHT, LOW);
    }
}

void handleCoolerState()
{
    switch (config.coolerState)
    {
    case COOLER_HIGH:
    case COOLER_MEDIUM:
        digitalWrite(COOLER_PIN_1, HIGH);
        digitalWrite(COOLER_PIN_2, LOW);
        break;
    case COOLER_LOW:
        digitalWrite(COOLER_PIN_1, LOW);
        digitalWrite(COOLER_PIN_2, HIGH);
        break;
    default: // OFF
        digitalWrite(COOLER_PIN_1, HIGH);
        digitalWrite(COOLER_PIN_2, HIGH);
        break;
    }
    updateLights();
}

void handleCoolState()
{
    digitalWrite(COOL_PIN, config.coolState == SWITCH_ON ? LOW : HIGH);
    digitalWrite(COOL_LIGHT, config.coolState == SWITCH_ON ? HIGH : LOW);
}

void handleSwingState()
{
    digitalWrite(SWING_PIN, config.swingState == SWITCH_ON ? LOW : HIGH);
    digitalWrite(SWING_LIGHT, config.swingState == SWITCH_ON ? HIGH : LOW);
}

// Action handlers
void onCoolerTouch()
{
    config.coolerState = static_cast<CoolerState>((config.coolerState + 1) % 2);
    handleCoolerState();
    updateCoolerStatus(config);
}

void onCoolTouch()
{
    config.coolState = (config.coolState == SWITCH_ON) ? SWITCH_OFF : SWITCH_ON;
    handleCoolState();
    updateCoolerStatus(config);
}

void onSwingTouch()
{
    config.swingState = (config.swingState == SWITCH_ON) ? SWITCH_OFF : SWITCH_ON;
    handleSwingState();
    updateCoolerStatus(config);
}

// Push button debounce handler
void handlePushButton(Button &btn, void (*onPress)(), long pressDuration)
{
    int reading = digitalRead(btn.pin);
    unsigned long currentTime = millis();

    if (reading == LOW)
    {
        // Button is pressed
        if (!btn.pressed)
        {
            btn.pressed = true;
            btn.lastDebounceTime = currentTime;
        }
        else if (btn.pressed && !btn.handled && (currentTime - btn.lastDebounceTime >= pressDuration))
        {
            btn.handled = true;
            onPress(); // Trigger long press action
        }
    }
    else
    {
        // Button released, reset state
        btn.pressed = false;
        btn.handled = false;
    }
}

void handleAllPushButtons()
{
    handlePushButton(coolerButton, onCoolerTouch, 80);
    handlePushButton(coolButton, onCoolTouch, 80);
    handlePushButton(swingButton, onSwingTouch, 80);
}

void coolerSetup()
{
    initConnectionSetup();
    config = readCoolerStatus();
    handleCoolerState();
    handleCoolState();
    handleSwingState();
}

#endif
