package expo.modules.wifimodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWifiModule : Module() {
 override fun definition() = ModuleDefinition {
    Name("ExpoWifiModule")
    Function("getTheme") {
      return@Function "system"
    }
  
  }
}
