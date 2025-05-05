// storage.h

#ifndef STORAGE_H
#define STORAGE_H
#include <Preferences.h>
#include "config_types.h"
#define MAX_NETWORKS 5

Preferences prefs;
void saveWiFiToPrefs(String ssid, String pass)
{
    prefs.begin("wifistore", false);

    int count = prefs.getInt("count", 0);
    if (count >= MAX_NETWORKS)
        count = 0; // Overwrite old

    prefs.putString(("ssid" + String(count)).c_str(), ssid.c_str());
    prefs.putString(("pass" + String(count)).c_str(), pass.c_str());
    prefs.putInt("count", count + 1);

    prefs.end();
}

void updateCoolerStatus(Config config)
{
    prefs.begin("coolerStore", false); // RW mode
    prefs.putInt("coolerState", static_cast<int>(config.coolerState));
    prefs.putBool("coolState", config.coolState == SWITCH_ON);
    prefs.putBool("swingState", config.swingState == SWITCH_ON);
    prefs.end();
}
Config readCoolerStatus()
{
    prefs.begin("coolerStore", true); // Read-only mode

    Config cfg;
    cfg.coolerState = static_cast<CoolerState>(prefs.getInt("coolerState", COOLER_OFF));
    cfg.coolState = prefs.getBool("coolState", false) ? SWITCH_ON : SWITCH_OFF;
    cfg.swingState = prefs.getBool("swingState", false) ? SWITCH_ON : SWITCH_OFF;

    prefs.end();
    return cfg;
}

#endif