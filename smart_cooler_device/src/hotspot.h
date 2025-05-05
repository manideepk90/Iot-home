#ifndef HOTSPOT_H
#define HOTSPOT_H

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include "storage.h"
#include "cooler_device.h"

// HTML Page
const char htmlPage[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>WiFi Setup</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: sans-serif;
      background: #f4f4f4;
      padding: 20px;
      text-align: center;
    }
    input, button {
      padding: 10px;
      margin: 10px;
      width: 80%;
      max-width: 300px;
    }
    #submit-button {
      padding: 15px 30px;
      background-color: #3480ef;
      color: white;
    }
  </style>
</head>
<body>
  <h2>Configure WiFi</h2>
  <form id="wifiForm">
    <input type="text" id="ssid" placeholder="WiFi SSID" required><br>
    <input type="password" id="password" placeholder="WiFi Password" required><br>
    <button type="submit" id="submit-button">Connect</button>
  </form>

  <script>
    document.getElementById("wifiForm").addEventListener("submit", function(e) {
      e.preventDefault();
      fetch("/wifi_save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ssid: document.getElementById("ssid").value,
          password: document.getElementById("password").value
        })
      }).then(res => {
        if (res.ok) alert("WiFi Credentials Sent!");
        else alert("Failed to send WiFi credentials.");
      });
    });
  </script>
</body>
</html>
)rawliteral";

// WebServer instance
WebServer server(80);
const char *apSSID = "SmartCooler - 123";
const char *apPassword = "123458678";

// Helper to send JSON error response
void sendJSONErrorMsg(String msg = "")
{
  if (msg == "")
    server.send(400, "application/json", "{\"status\":\"Enter value in range\"}");
  else
    server.send(400, "application/json", msg);
}

// Handle WiFi config POST
void handleWifiConfig()
{
  if (server.method() != HTTP_POST)
  {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error)
  {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  String ssid = doc["ssid"] | "";
  String password = doc["password"] | "";

  if (ssid.isEmpty() || password.isEmpty())
  {
    server.send(400, "application/json", "{\"error\":\"Missing fields\"}");
    return;
  }

  saveWiFiToPrefs(ssid, password);

  server.send(200, "application/json", "{\"status\":\"ok\"}");
  Serial.println("[HOTSPOT] WiFi credentials saved.");
  delay(1200);
  ESP.restart();
}

// Send device info
void handleDeviceDetails()
{
  server.send(200, "application/json", R"({
    "deviceName": "Smart cooler",
    "deviceID": "CSDSDFLJAS",
    "deviceOwner": "Electro Coders",
    "firmwareVersion": "0.0.1",
    "type": "cooler"
  })");
}

// Root handler for WiFi page
void handleRoot()
{
  server.send(200, "text/html", htmlPage);
}

// Start WiFi hotspot
void startHotspot()
{
  WiFi.softAP(apSSID);
  Serial.print("[HOTSPOT] AP started. IP: ");
  Serial.println(WiFi.softAPIP());
}

// Send cooler state
void handleGetCoolerStatus()
{
  DynamicJsonDocument doc(256);
  doc["coolerState"] = config.coolerState;
  doc["swingState"] = config.swingState;
  doc["coolState"] = config.coolState;

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Log state to Serial
void printCoolerState()
{
  Serial.print("Cooler state: ");
  Serial.println(config.coolerState);
  Serial.print("Swing state: ");
  Serial.println(config.swingState);
  Serial.print("Cool state: ");
  Serial.println(config.coolState);
}

// Handle cooler state update
void updateCoolerState()
{
  if (!server.hasArg("plain"))
  {
    sendJSONErrorMsg("{\"status\":\"NO DATA\"}");
    return;
  }

  String body = server.arg("plain");
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, body);
  if (error)
  {
    sendJSONErrorMsg("{\"status\":\"Invalid JSON\"}");
    return;
  }

  if (doc.containsKey("coolerState"))
  {
    int value = doc["coolerState"];
    if (value >= 0 && value < 4)
    {
      config.coolerState = static_cast<CoolerState>(value);
      handleCoolerState();
    }
    else
    {
      sendJSONErrorMsg("{\"status\":\"Cooler State is not valid\"}");
      return;
    }
  }

  if (doc.containsKey("swingState"))
  {
    int value = doc["swingState"];
    if (value == 0 || value == 1)
    {
      config.swingState = static_cast<SwitchState>(value);
      handleSwingState();
    }
    else
    {
      sendJSONErrorMsg("{\"status\":\"Swing State is not valid\"}");
      return;
    }
  }

  if (doc.containsKey("coolState"))
  {
    int value = doc["coolState"];
    if (value == 0 || value == 1)
    {
      config.coolState = static_cast<SwitchState>(value);
      handleCoolState();
    }
    else
    {
      sendJSONErrorMsg("{\"status\":\"Cool State is not valid\"}");
      return;
    }
  }

  printCoolerState();
  handleGetCoolerStatus();
}

// Setup server routes
void startServer()
{
  server.on("/", HTTP_GET, handleDeviceDetails);
  server.on("/wifi", HTTP_GET, handleRoot);
  server.on("/wifi_save", HTTP_POST, handleWifiConfig);
  server.on("/cooler_status", HTTP_GET, handleGetCoolerStatus);
  server.on("/cooler_status", HTTP_POST, updateCoolerState);
  server.begin();
}

// Handle incoming clients
void hotspotLoop()
{
  server.handleClient();
}

#endif
