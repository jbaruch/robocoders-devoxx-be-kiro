---
inclusion: fileMatch
fileMatchPattern: '**/*.java|**/pom.xml|**/application.properties'
---

# Backend Development Guidelines - Java Spring Boot

## Technology Stack

- **Java**: 25 (LTS, released September 2025)
- **Spring Boot**: 3.5.6 (latest stable)
- **Build Tool**: Maven 3.9+

## Critical Rule: Context7 MCP Consultation

**MANDATORY**: Before writing ANY code, you MUST consult Context7 MCP for technical information.

- ❌ NEVER rely on pre-trained knowledge about libraries or APIs
- ❌ NEVER search elsewhere or make assumptions
- ❌ NEVER hallucinate API signatures, methods, or configurations
- ✅ ALWAYS use Context7 MCP to get accurate, up-to-date documentation
- ✅ ALL technical knowledge must come from Context7 MCP

### How to Use Context7 MCP

1. Resolve library ID: `resolve-library-id` with library name (e.g., "Spring Boot", "Java 25")
2. Get documentation: `get-library-docs` with the resolved library ID
3. Focus on specific topics when needed (e.g., "RestClient", "Spring MVC")

## Project Structure

```
src/main/java/com/vibecoding/
├── VibeCodingApplication.java    # Main Spring Boot application
├── controller/
│   └── ColorController.java      # REST endpoints
├── service/
│   └── ShellyBulbService.java    # Bulb communication logic
└── model/
    ├── ColorRequest.java         # DTO for incoming color data
    └── ColorResponse.java        # DTO for responses

src/main/resources/
├── application.properties        # Configuration (bulb IP, port)
└── static/
    ├── index.html               # Frontend files
    ├── app.js
    └── styles.css
```

## Code Style & Best Practices

### Use Records for DTOs
```java
public record ColorRequest(int red, int green, int blue, int white) {}
public record ColorResponse(String status, String message) {}
```

### Constructor Injection Only
```java
@Service
public class ShellyBulbService {
    private final RestClient restClient;
    
    public ShellyBulbService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }
}
```

### Keep Methods Under 20 Lines
- Break complex logic into smaller methods
- Use meaningful variable names
- Add comments only for non-obvious logic

### Use RestClient (Not RestTemplate)
- Spring Boot 3.5+ uses `RestClient` as the modern HTTP client
- Consult Context7 MCP for correct usage patterns

## What NOT to Implement

### Explicitly Excluded (Keep It Simple)
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

## Common Pitfalls to Avoid

1. **Don't use `@EnableWebMvc`** - Breaks Spring Boot auto-configuration
2. **Don't configure `RestTemplate`** - Use `RestClient` instead
3. **Don't add complex exception handling** - Keep it simple for demo
4. **Don't optimize prematurely** - Code clarity > performance
5. **Hardcoded bulb IP will fail** - Ask user for real IP before testing

## Configuration

### application.properties
```properties
# Server configuration
server.port=8080

# Shelly Bulb configuration (user will provide real IP)
shelly.bulb.ip=192.168.1.100
shelly.bulb.timeout=5000
```

## File Generation Order

1. `pom.xml` - Dependencies first
2. `application.properties` - Configuration
3. Model classes - Simple records
4. `ShellyBulbService` - Core logic
5. `ColorController` - REST endpoint
6. `VibeCodingApplication` - Main class

## Acceptance Criteria

- ✅ App runs with single `mvn spring-boot:run` command
- ✅ No crashes or exceptions during demo
- ✅ Code is simple enough to explain in 5 minutes
- ✅ Bulb changes color within 2 seconds of request
