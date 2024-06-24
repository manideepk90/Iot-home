import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { WifiModuleViewProps } from './WifiModule.types';

const NativeView: React.ComponentType<WifiModuleViewProps> =
  requireNativeViewManager('WifiModule');

export default function WifiModuleView(props: WifiModuleViewProps) {
  return <NativeView {...props} />;
}
