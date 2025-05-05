interface DeviceInfo {
    id: string;
    name: string;
    ip: string;
    nickname?: string;
    lastConnected?: string;
    firmwareVersion?: string;
    batteryLevel?: number;
    mood?: string;
    selectedImage?: string;
    type?: string;
    coolerSettings?: CoolerSettings;
    status?: 'connecting' | 'connected' | 'not_found' | 'scanning' | 'disconnected';
  }