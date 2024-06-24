import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to WifiModule.web.ts
// and on native platforms to WifiModule.ts
import WifiModule from './src/WifiModule';
import WifiModuleView from './src/WifiModuleView';
import { ChangeEventPayload, WifiModuleViewProps } from './src/WifiModule.types';

// Get the native constant value.
export const PI = WifiModule.PI;

export function hello(): string {
  return WifiModule.hello();
}

export async function setValueAsync(value: string) {
  return await WifiModule.setValueAsync(value);
}

const emitter = new EventEmitter(WifiModule ?? NativeModulesProxy.WifiModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { WifiModuleView, WifiModuleViewProps, ChangeEventPayload };
