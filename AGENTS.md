# AI Agent Guidelines for Vibecoding Demo

## Project Overview

**Goal**: Build a web app that uses webcam feed to detect dominant color and control a Shelly Duo GU10 RGBW smart bulb over local network.

**Demo Context**: 3-hour live conference demo using agentic AI IDEs and tools (Windsurf, Junie, Kiro, Claude Code, OpenAI Codex)

**Design Philosophy**: Intentionally prioritize simplicity - NO cloud, databases, Docker, or complex infrastructure.

---

## 🚨 CRITICAL RULE: Context7 MCP Consultation

**MANDATORY FOR ALL AI AGENTS**: Before writing ANY code, you MUST consult Context7 MCP for technical information.

### Why This Matters
- Pre-trained knowledge is outdated (Java 25 released September 2025, Spring Boot 3.5.6 is latest)
- API signatures change between versions
- Hallucinated code will break the demo

### How to Use Context7 MCP

1. **Resolve Library ID First**
   ```
   Tool: resolve-library-id
   Input: "Spring Boot" or "Color Thief" or "Java 25"
   Output: Context7-compatible library ID (e.g., "/spring-projects/spring-boot")
   ```

2. **Get Documentation**
   ```
   Tool: get-library-docs
   Input: Library ID from step 1
   Optional: Topic (e.g., "RestClient", "getUserMedia")
   Output: Up-to-date documentation
   ```

3. **Focus on Specific Topics**
   - For Spring Boot: "RestClient", "Spring MVC", "application.properties"
   - For JavaScript: "MediaStream API", "Fetch API", "Canvas API"
   - For Color Thief: "getDominantColor", "getPalette"

### What You MUST NOT Do
- ❌ NEVER rely on pre-trained knowledge about libraries or APIs
- ❌ NEVER search elsewhere or make assumptions
- ❌ NEVER hallucinate API signatures, methods, or configurations
- ❌ NEVER skip Context7 MCP consultation to "save time"

### What You MUST Do
- ✅ ALWAYS use Context7 MCP before writing code
- ✅ ALL technical knowledge must come from Context7 MCP
- ✅ Verify API signatures match documentation
- ✅ Check for deprecated methods and use modern alternatives

---

## Technology Stack

### Backend
- **Java**: 25 (LTS, released September 2025)
- **Spring Boot**: 3.5.6 (latest stable)
- **Build Tool**: Maven 3.9+
- **HTTP Client**: RestClient (not RestTemplate)

### Frontend
- **Core**: Vanilla HTML5 + Modern JavaScript (ES2024)
- **Color Detection**: Color Thief 2.4.0
- **Styling**: Modern CSS with CSS Grid/Flexbox
- **No Build Tools**: Direct browser execution

---

## Project Structure

```
vibecoding-demo/
├── pom.xml
├── src/
│   └── main/
│       ├── java/com/vibecoding/
│       │   ├── VibeCodingApplication.java
│       │   ├── controller/
│       │   │   └── ColorController.java
│       │   ├── service/
│       │   │   └── ShellyBulbService.java
│       │   └── model/
│       │       ├── ColorRequest.java
│       │       └── ColorResponse.java
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── index.html
│               ├── app.js
│               └── styles.css
└── src/test/java/
    └── com/vibecoding/
        └── integration/
            └── ColorControllerTest.java
```

---

## Code Style & Best Practices

### Backend (Java/Spring Boot)

#### Use Records for DTOs
```java
public record ColorRequest(int red, int green, int blue, int white) {}
public record ColorResponse(String status, String message) {}
```

#### Constructor Injection Only
```java
@Service
public class ShellyBulbService {
    private final RestClient restClient;
    
    public ShellyBulbService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }
}
```

#### Keep Methods Under 20 Lines
- Break complex logic into smaller methods
- Use meaningful variable names
- Add comments only for non-obvious logic

#### Use RestClient (Not RestTemplate)
**IMPORTANT**: Consult Context7 MCP for RestClient usage in Spring Boot 3.5.6

### Frontend (JavaScript)

#### Modern JavaScript (ES2024)
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

#### Error Handling
- Wrap async operations in try/catch
- Display user-friendly error messages
- Log technical details to console

---

## What NOT to Implement

### Backend - Explicitly Excluded
- ❌ WebSocket connections
- ❌ Circuit breakers (Resilience4j)
- ❌ Connection pooling configuration
- ❌ Actuator endpoints beyond defaults
- ❌ Prometheus metrics
- ❌ Redis caching
- ❌ Any database (PostgreSQL, H2, etc.)
- ❌ Docker containerization
- ❌ MQTT protocol
- ❌ Authentication/Authorization
- ❌ Rate limiting
- ❌ Complex logging frameworks (SLF4J default is fine)

### Frontend - Explicitly Excluded
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

---

## Common Pitfalls to Avoid

### Backend
1. **Don't use `@EnableWebMvc`** - Breaks Spring Boot auto-configuration
2. **Don't configure `RestTemplate`** - Use `RestClient` instead (consult Context7 MCP)
3. **Don't add complex exception handling** - Keep it simple for demo
4. **Don't optimize prematurely** - Code clarity > performance
5. **Hardcoded bulb IP will fail** - Ask user for real IP before testing

### Frontend
1. **Don't overthink camera selection** - Basic dropdown is fine
2. **Don't add complex color algorithms** - Color Thief handles it
3. **Don't use deprecated APIs** - Consult Context7 MCP for modern alternatives
4. **Don't forget error handling** - Camera/network can fail
5. **Don't optimize prematurely** - Code clarity > performance

---

## File Generation Order

### Phase 1: Backend Setup
1. `pom.xml` - Dependencies first (consult Context7 MCP for Spring Boot 3.5.6)
2. `application.properties` - Configuration
3. Model classes - Simple records (`ColorRequest`, `ColorResponse`)
4. `ShellyBulbService` - Core logic (consult Context7 MCP for RestClient)
5. `ColorController` - REST endpoint
6. `VibeCodingApplication` - Main class

### Phase 2: Frontend Setup
7. `index.html` - UI structure
8. `app.js` - Client logic (consult Context7 MCP for MediaStream API, Fetch API)
9. `styles.css` - Styling

### Phase 3: Testing
10. Integration tests with Playwright (optional for demo)

---

## Configuration

### application.properties
```properties
# Server configuration
server.port=8080

# Shelly Bulb configuration (user will provide real IP)
shelly.bulb.ip=192.168.1.100
shelly.bulb.timeout=5000
```

**IMPORTANT**: Hardcoded IP will likely be wrong. Ask user for real bulb IP before testing.

---

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

---

## Testing Strategy

### Integration Testing (Playwright)
- [ ] Camera selection dropdown populates
- [ ] Video stream displays from selected camera
- [ ] Color preview updates continuously
- [ ] Manual mode: send button works
- [ ] Auto mode: color sends every 3 seconds
- [ ] Bulb actually changes color
- [ ] Error messages display on network failure
- [ ] App works on Chrome, Firefox, Safari

### Unit Tests (Optional for Demo)
- `ShellyBulbService`: Mock RestClient calls
- `ColorController`: Test request/response mapping

---

## Acceptance Criteria

**The demo is successful if**:
- ✅ App runs with single `mvn spring-boot:run` command
- ✅ Webcam activates without manual permission prompts
- ✅ Color preview visibly updates in real-time
- ✅ Manual send changes bulb color within 2 seconds
- ✅ Auto mode sends color every 3 seconds reliably
- ✅ UI is large enough to see from back of conference room
- ✅ No crashes or exceptions during demo
- ✅ Code is simple enough to explain in 5 minutes

---

## Agent-Specific Workflow

### Step 1: Consult Context7 MCP
Before writing ANY code:
1. Resolve library IDs for all technologies
2. Get documentation for specific features you'll implement
3. Verify API signatures and method names

### Step 2: Generate Backend
1. Create `pom.xml` with correct Spring Boot 3.5.6 dependencies
2. Create model records
3. Implement `ShellyBulbService` with RestClient
4. Implement `ColorController`
5. Create `VibeCodingApplication` main class
6. Create `application.properties`

### Step 3: Generate Frontend
1. Create `index.html` with semantic structure
2. Implement `app.js` with camera access and color detection
3. Style with `styles.css` for large, visible UI

### Step 4: Ask for Bulb IP
Before testing, ask user: "What is the IP address of your Shelly Duo GU10 bulb?"

### Step 5: Test
1. Run `mvn spring-boot:run`
2. Open browser to `http://localhost:8080`
3. Verify camera access
4. Test manual color send
5. Test auto mode
6. Verify bulb changes color

---

## Emergency Troubleshooting

### If Context7 MCP is unavailable:
1. **STOP** - Do not proceed with code generation
2. Inform user that Context7 MCP is required
3. Wait for Context7 MCP to be available

### If bulb doesn't respond:
1. Verify bulb IP address with user
2. Check bulb is on same network
3. Test bulb API with curl: `curl http://<bulb-ip>/status`

### If camera doesn't work:
1. Check browser permissions
2. Try different camera from dropdown
3. Verify HTTPS or localhost (required for getUserMedia)

---

## Summary for AI Agents

1. **ALWAYS consult Context7 MCP first** - No exceptions
2. **Keep it simple** - This is a demo, not production
3. **Ask for bulb IP** - Hardcoded value will fail
4. **Large UI elements** - Visible from distance
5. **No complex infrastructure** - Single command to run
6. **Code clarity > performance** - Must be explainable in 5 minutes
7. **Test before declaring success** - Verify bulb actually changes color

**Remember**: The goal is a working demo in 3 hours, not a production-ready application. Simplicity and reliability are more important than features.
