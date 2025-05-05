#include <WiFi.h>
#include "storage.h"
#include "hotspot.h"
#include "wifi_connection.h"
#include "cooler_device.h"
#include <Arduino.h>
#include "storage.h"
void setup()
{
  coolerSetup();
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);

  if (!connectToBestNetwork())
  {
    Serial.println("Failed to connect, starting AP...");
    startHotspot();
  }
  else
  {
    Serial.println("Connected to WiFi!");
    Serial.println(WiFi.localIP());
  }
  startServer();
}

void loop()
{
  hotspotLoop();
  handleAllPushButtons();
}
