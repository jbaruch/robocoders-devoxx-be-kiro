---
inclusion: fileMatch
fileMatchPattern: '**/*.html|**/*.js|**/*.css'
---

# Frontend Development Guidelines - Vanilla JavaScript

## Technology Stack

- **Core**: Vanilla HTML5 + Modern JavaScript (ES2024)
- **Color Detection**: Color Thief 2.4.0
- **Styling**: Modern CSS with CSS Grid/Flexbox
- **No Build Tools**: Direct browser execution

## Critical Rule: Context7 MCP Consultation

**MANDATORY**: Before writing ANY code, you MUST consult Context7 MCP for technical information.

- ❌ NEVER rely on pre-trained knowledge about browser APIs or libraries
- ❌ NEVER search elsewhere or make assumptions
- ❌ NEVER hallucinate API signatures, methods, or configurations
- ✅ ALWAYS use Context7 MCP to get accurate, up-to-date documentation
- ✅ ALL technical knowledge must come from Context7 MCP

### How to Use Context7 MCP

1. Resolve library ID: `resolve-library-id` with library name (e.g., "Color Thief", "MediaStream API")
2. Get documentation: `get-library-docs` with the resolved library ID
3. Focus on specific topics when needed (e.g., "getUserMedia", "canvas API")

## Project Structure

```
src/main/resources/static/
├── index.html      # Main UI structure
├── app.js          # Client-side logic
└── styles.css      # Styling
```

## Core Features

### 1. Camera Selection
- Dropdown populated via `navigator.mediaDevices.enumerateDevices()`
- Filter for `videoinput` devices only
- Default to first available camera

### 2. Video Stream
- Use `getUserMedia()` to access webcam
- Display in `<video>` element with autoplay
- Handle permission denials gracefully

### 3. Color Detection
- Use Color Thief library to extract dominant color
- Sample from video frame via canvas
- Update color preview in real-time

### 4. Manual Mode
- Large "Send Color" button (50px+ height)
- POST color to `/api/color` endpoint
- Show success/error feedback

### 5. Auto Mode
- Toggle button to enable/disable
- Send color every 3 seconds when enabled
- Clear interval when disabled

## Code Style & Best Practices

### Modern JavaScript (ES2024)
```javascript
// Use const/let, never var
const videoElement = document.getElementById('video');

// Use arrow functions
const sendColor = async (color) => { /* ... */ };

// Use async/await for promises
try {
    const response = await fetch('/api/color', { /* ... */ });
    const data = await response.json();
} catch (error) {
    console.error('Failed to send color:', error);
}
```

### DOM Manipulation
- Use `getElementById()` or `querySelector()` for element selection
- Add event listeners with `addEventListener()`
- Update UI with `textContent` or `innerHTML`

### Error Handling
- Wrap async operations in try/catch
- Display user-friendly error messages
- Log technical details to console

## What NOT to Implement

### Explicitly Excluded (Keep It Simple)
- ❌ WebSocket client
- ❌ K-means clustering for color
- ❌ OffscreenCanvas
- ❌ Web Workers
- ❌ HSL/HSV conversions
- ❌ Kelvin temperature calculations
- ❌ Complex color science
- ❌ MediaStream constraints configuration beyond basics
- ❌ Frontend frameworks (React, Vue, Angular)
- ❌ Build tools (Webpack, Vite)
- ❌ CSS preprocessors (Sass, Less)

## UI Requirements

### Usability
- Zero configuration for end user
- Large, touch-friendly buttons (50px+ height)
- High contrast for visibility from distance
- Clear visual feedback for all actions

### Layout
```
┌─────────────────────────────────┐
│  Camera: [Dropdown ▼]          │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    Video Stream         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  Current Color: ████            │
│                                 │
│  [ Send Color ]  [ Auto: OFF ] │
│                                 │
│  Status: Ready                  │
└─────────────────────────────────┘
```

### Styling Guidelines
- Use CSS Grid or Flexbox for layout
- Mobile-first responsive design
- High contrast colors (dark text on light background)
- Smooth transitions for visual feedback
- No external CSS frameworks

## Common Pitfalls to Avoid

1. **Don't overthink camera selection** - Basic dropdown is fine
2. **Don't add complex color algorithms** - Color Thief handles it
3. **Don't use deprecated APIs** - Consult Context7 MCP for modern alternatives
4. **Don't forget error handling** - Camera/network can fail
5. **Don't optimize prematurely** - Code clarity > performance

## API Integration

### POST /api/color
```javascript
const sendColorToBulb = async (red, green, blue, white) => {
    try {
        const response = await fetch('/api/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ red, green, blue, white })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to send color:', error);
        throw error;
    }
};
```

## File Generation Order

1. `index.html` - UI structure
2. `app.js` - Client logic
3. `styles.css` - Styling

## Acceptance Criteria

- ✅ Webcam activates without manual permission prompts
- ✅ Color preview visibly updates in real-time
- ✅ Manual send changes bulb color within 2 seconds
- ✅ Auto mode sends color every 3 seconds reliably
- ✅ UI is large enough to see from back of conference room
- ✅ No crashes during demo
- ✅ Works on Chrome, Firefox, Safari
