# Smart Cooler Control App V 1.0
## Overview

This React Native application allows users to remotely control and monitor a smart cooler over a local Wi-Fi network. The app interfaces with a NodeMCU microcontroller, which manages the cooler's operations using relay modules and sensors. This project showcases IoT integration with mobile applications, providing a seamless and user-friendly experience.

## Features
   * Remote Control: Turn the cooler on/off and adjust settings from your mobile device.
   * State Persistence: Automatically reconnects to the cooler and retains settings even after power cycles.
   * Device Discovery: Uses mDNS to automatically discover smart coolers on the local network.
   * Local Storage: Saves device details for easy reconnection without repeated selection.
   * REST API Integration: Communicates with the cooler using a RESTful API for reliable state management.

## Technologies Used
   * React Native: For cross-platform mobile app development.
   * JavaScript/TypeScript: Core programming languages for the app.
   * AsyncStorage: To persist device information locally on the mobile device.

## Future Enhancements
   + OTA Updates: Facilitate over-the-air updates for the cooler's firmware.
   + Security: Implement HTTPS and token-based authentication for secure communication.
   + Push Notifications: Notify users of status changes and updates.
   + Advanced Device Management: Add features for monitoring device health and performance.

## Sample Figma Design 
  [figma design link](https://www.figma.com/proto/XipQyLPY4CMWgBFP8fRIGK/Smart-Home-V-1.0?node-id=5-47&starting-point-node-id=1%3A2)

## Installation

1. Clone the Repository:

   ```bash
   git clone https://github.com/manideepk90/Iot-home.git
   cd Iot-home
   ```

2. Install Dependencies:

   ```bash
    npm install
   ```
3. For Android
   ```bash
   npx expo start
   ```

## Usage
+ Ensure your smart cooler is connected to the same Wi-Fi network as your mobile device.
+ Open the app and use the device discovery feature to find and connect to your cooler.
+ Use the controls in the app to manage the cooler's operation.

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, please contact manideepk90@example.com.


