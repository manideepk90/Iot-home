import * as React from 'react';

import { WifiModuleViewProps } from './WifiModule.types';

export default function WifiModuleView(props: WifiModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
