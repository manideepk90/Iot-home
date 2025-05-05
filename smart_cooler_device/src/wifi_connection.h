// hotspot.h
#ifndef WIFI_CONNECTION_H
#define WIFI_CONNECTION_H
#include <WiFi.h>
#include "storage.h"

void saveWiFiToPrefs(String ssid, String pass);

struct WiFiCred
{
    String ssid;
    String pass;
};

WiFiCred savedNetworks[MAX_NETWORKS];

void loadSavedNetworks()
{
    prefs.begin("wifistore", true);
    int count = prefs.getInt("count", 0);
    for (int i = 0; i < count && i < MAX_NETWORKS; i++)
    {
        savedNetworks[i].ssid = prefs.getString(("ssid" + String(i)).c_str(), "");
        savedNetworks[i].pass = prefs.getString(("pass" + String(i)).c_str(), "");
    }
    prefs.end();
}

bool connectToBestNetwork()
{
    loadSavedNetworks();
    Serial.println("Scanning WiFi...");
    int n = WiFi.scanNetworks();
    int bestRSSI = -1000;
    int bestIndex = -1;

    for (int i = 0; i < n; ++i)
    {
        for (int j = 0; j < MAX_NETWORKS; j++)
        {
            if (WiFi.SSID(i) == savedNetworks[j].ssid)
            {
                if (WiFi.RSSI(i) > bestRSSI)
                {
                    bestRSSI = WiFi.RSSI(i);
                    bestIndex = j;
                }
            }
        }
    }

    if (bestIndex != -1)
    {
        Serial.println("Connecting to: " + savedNetworks[bestIndex].ssid);
        WiFi.begin(savedNetworks[bestIndex].ssid.c_str(), savedNetworks[bestIndex].pass.c_str());

        unsigned long startAttempt = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 10000)
        {
            Serial.print(".");
            delay(500);
        }
        return WiFi.status() == WL_CONNECTED;
    }
    return false;
}

#endif
