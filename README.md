# Figma React Mockup Plugin

[Demo](https://www.figma.com/community/plugin/1353080571822508263/mockup-magic-elevate-your-figma-designs)

This project is a Figma plugin designed to elevate your design workflow by generating device mockups directly within Figma. Utilizing React for the UI and leveraging the Figma Plugin API, this tool allows designers to quickly create high-quality mockups for presentations or prototyping.

## Features

- **Device Frame Selection**: Choose from a variety of device frames to wrap your designs in.
- **Image Generation**: Convert selected frames in your Figma file into images, then apply them to the chosen device mockup.
- **Real-time Preview**: Instantly preview how your design looks on different devices.

## Getting Started

To get started with the plugin development:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Start the development server with `npm run dev`.

For building the plugin for production, use `npm run build`.

## Development

This plugin is built using React and leverages the Vite build tool for an efficient development experience. The main entry point for the plugin UI is `src/main.jsx`, which renders the React application:

```javascript:src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

The `App` component (`src/app.jsx`) orchestrates the plugin's functionality, handling device selection, image generation, and UI rendering.

## Plugin UI

The plugin UI is defined in `index.html`, which serves as the container for the React application:

```html:index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Figma Plugin API Integration

The Figma Plugin API is used to interact with the Figma document and UI. The main logic for this interaction is found in `lib/code.js`, which handles tasks such as selecting elements, generating images from selections, and creating image frames within the Figma document.

## Styling

The plugin uses CSS for styling, organized into component-specific files within the `src/components` directory. Global styles are defined in `src/index.css`.

## Configuration

The plugin's metadata is defined in `manifest.json`, specifying details like the plugin name, API version, and entry points for the plugin code and UI:

```json:manifest.json
{
  "name": "Mockup Magic | Elevate Your Figma Designs",
  "id": "1353080571822508263",
  "api": "1.0.0",
  "main": "lib/code.js",
  "capabilities": [],
  "enableProposedApi": false,
  "editorType": [
    "figma"
  ],
  "ui": "dist/index.html",
  "networkAccess": {
  "allowedDomains": [
      "none"
    ]
  },
  "documentAccess": "dynamic-page"
}
```

## Contributing

Contributions to the Figma React Mockup Plugin are welcome. Please ensure to follow the project's coding and styling conventions.