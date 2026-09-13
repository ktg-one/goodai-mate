// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          'agent-id'?: string;
          'avatar-image-url'?: string;
          'avatar-orb-color-1'?: string;
          'avatar-orb-color-2'?: string;
          'action-text'?: string;
          'start-call-text'?: string;
          'end-call-text'?: string;
          'listening-text'?: string;
          'speaking-text'?: string;
        };
      }
    }
  }
}
