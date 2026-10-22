import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
const root = createRoot(rootElement);

root.render(
<div style={{ padding: 24, fontFamily: 'sans-serif' }}>
<h2>EarnBridge is starting...</h2>
<p>Please wait while we check the application.</p>
</div>
);

import('./App')
.then(({ default: App }) => {
root.render(
<React.StrictMode>
<App />
</React.StrictMode>
);
})
.catch((error: unknown) => {
console.error('EarnBridge startup error:', error);

  const message =
    error instanceof Error ? error.message : String(error);

  root.render(
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        color: '#991b1b',
        overflowWrap: 'anywhere',
      }}
    >
      <h1>EarnBridge could not start</h1>
      <p>We found a startup error. Please share the error message below.</p>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {message}
      </pre>
    </div>
  );
});

}
