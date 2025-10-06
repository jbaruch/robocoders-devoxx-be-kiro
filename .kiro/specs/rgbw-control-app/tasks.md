# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Create Maven project with Spring Boot 3.5.6 and Java 25
  - Configure pom.xml with spring-boot-starter-web dependency
  - Create package structure: controller, service, model
  - Create application.properties with server port and bulb IP placeholder
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 2. Implement backend data models
  - Create ColorRequest record with red, green, blue fields (0-255)
  - Create ColorResponse record with success boolean and message string
  - _Requirements: 4.1, 4.4_

- [x] 3. Implement ShellyBulbService
  - Create service class with RestClient dependency
  - Implement setColor method that constructs Shelly API URL with RGB parameters
  - Add error handling for network failures and timeouts
  - Use @Value annotation to inject bulb IP from application.properties
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ]* 3.1 Write unit tests for ShellyBulbService
  - Mock RestClient to test URL construction
  - Test error handling for network failures
  - _Requirements: 4.3, 4.5_

- [x] 4. Implement ColorController REST endpoint
  - Create controller with @RestController and @RequestMapping("/api")
  - Implement POST /api/color endpoint that accepts ColorRequest
  - Add RGB validation (0-255 range) and return 400 Bad Request for invalid values
  - Call ShellyBulbService.setColor and return ColorResponse
  - Add try-catch for service exceptions and return 500 Internal Server Error
  - Use constructor injection for ShellyBulbService
  - _Requirements: 4.1, 4.4, 8.1, 8.2_

- [ ]* 4.1 Write unit tests for ColorController
  - Use MockMvc to test endpoint with valid RGB values
  - Test validation with invalid RGB values (e.g., 300, -1)
  - Test error handling when service throws exception
  - _Requirements: 4.1, 8.1_

- [x] 5. Create main application class
  - Create VibeCodingApplication class with @SpringBootApplication annotation
  - Add main method with SpringApplication.run
  - Ensure no @EnableWebMvc annotation (breaks Spring Boot auto-config)
  - _Requirements: 5.1, 5.2_

- [x] 6. Create frontend HTML structure
  - Create index.html in src/main/resources/static/
  - Add video element for camera stream
  - Add hidden canvas element for color extraction
  - Add camera selection dropdown with id="cameraSelect"
  - Add color preview div with id="colorPreview"
  - Add "Send Color" button with id="sendButton" (min-height: 50px)
  - Add "Auto Mode" toggle button with id="autoButton" (min-height: 50px)
  - Add status message div with id="statusMessage"
  - Include Color Thief 2.4.0 from CDN
  - Link to app.js and styles.css
  - _Requirements: 1.1, 2.1, 3.1, 6.1, 6.2, 6.3, 6.4_

- [x] 7. Implement camera management in frontend
  - Create app.js in src/main/resources/static/
  - Implement initializeCameras function using navigator.mediaDevices.enumerateDevices
  - Populate camera dropdown with available video input devices
  - Implement selectCamera function using getUserMedia with selected deviceId
  - Display video stream in video element
  - Add error handling for camera access denied (NotAllowedError)
  - Add error handling for no cameras available
  - Add auto-reconnect logic for camera stream drops (video 'ended' event)
  - _Requirements: 1.1, 1.2, 1.5, 1.6, 8.3, 8.4_

- [x] 8. Implement color detection in frontend
  - Initialize Color Thief library
  - Implement detectColor function that captures video frame and extracts dominant color
  - Implement updateColorPreview function to update preview div with RGB color
  - Add continuous color detection loop (requestAnimationFrame or setInterval)
  - Add error handling for color detection failures (video not ready, Color Thief errors)
  - _Requirements: 1.3, 1.4, 8.5_

- [x] 9. Implement manual color sending
  - Add click event listener to "Send Color" button
  - Implement sendColorToBackend function using fetch API
  - POST current RGB values to /api/color endpoint
  - Parse response and display success/error message in status div
  - Add visual feedback during send operation (button disabled state)
  - _Requirements: 2.2, 2.3, 2.5, 8.1_

- [x] 10. Implement automatic color synchronization
  - Add click event listener to "Auto Mode" toggle button
  - Implement startAutoMode function that sets interval to send color every 3 seconds
  - Implement stopAutoMode function that clears interval
  - Toggle button visual state (active/inactive)
  - Continue operation if bulb is offline (display error but keep detecting)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.2_

- [x] 11. Implement error handling and status display
  - Create showStatus function to display messages in status div
  - Add success/error styling (green for success, red for error)
  - Handle network errors from fetch API
  - Display user-friendly error messages from backend
  - Ensure app continues operating after errors (no crashes)
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [x] 12. Create CSS styling
  - Create styles.css in src/main/resources/static/
  - Implement CSS Grid layout for responsive design
  - Style buttons with min-height: 50px and large touch-friendly areas
  - Use high contrast colors for visibility (dark text on light background)
  - Style color preview box to be large and visible (min 100px x 100px)
  - Style video element for appropriate conference room viewing size
  - Style status messages with clear success/error states
  - Add active state styling for auto mode button
  - Use large, readable fonts throughout
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Configure application properties
  - Set server.port=8080 in application.properties
  - Add shelly.bulb.ip property with placeholder value
  - Add logging.level.root=INFO
  - Add comment instructing user to update bulb IP before testing
  - _Requirements: 5.2, 5.5, 4.2_

- [ ] 14. Verify cross-browser compatibility
  - Test camera access and video stream in Chrome
  - Test camera access and video stream in Firefox
  - Test camera access and video stream in Safari
  - Verify camera permission flow works in each browser
  - Add browser compatibility error messages if needed
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 15. Create Playwright integration tests
  - Set up Playwright test project
  - Write test for camera selection dropdown population
  - Write test for video stream display
  - Write test for color preview updates
  - Write test for manual send button functionality
  - Write test for auto mode 3-second interval
  - Write test for error message display on network failure
  - Run tests on Chrome, Firefox, Safari
  - _Requirements: 1.1, 1.2, 1.3, 2.2, 3.2, 8.1, 7.1, 7.2, 7.3_

- [ ] 16. Final integration and testing
  - Verify app starts with single mvn spring-boot:run command
  - Test complete user flow: select camera → see preview → send color → verify bulb changes
  - Test auto mode: enable → verify color sends every 3 seconds → disable
  - Test error scenarios: bulb offline, camera denied, invalid camera
  - Verify UI is visible from distance (large buttons, high contrast)
  - Verify no crashes or exceptions during operation
  - Test graceful degradation when bulb is offline
  - _Requirements: 5.1, 2.3, 3.2, 8.1, 8.2, 8.3, 6.1, 8.4, 8.5_
