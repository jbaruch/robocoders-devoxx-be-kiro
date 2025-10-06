# Requirements Document

## Introduction

The RGBW Control App is a web application designed for a 3-hour live conference demo that showcases agentic AI IDE capabilities. The app uses a webcam feed to detect the dominant color in real-time and controls a Shelly Duo GU10 RGBW smart bulb over the local network. The application prioritizes simplicity and ease of demonstration, avoiding cloud services, databases, Docker, or complex infrastructure. It must be deployable with a single command and provide a clear, visible interface suitable for conference room viewing.

## Requirements

### Requirement 1: Camera Integration and Color Detection

**User Story:** As a conference attendee, I want to see my webcam feed with real-time color detection, so that I can understand how the app captures and processes visual input.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a dropdown list of available camera devices
2. WHEN a user selects a camera from the dropdown THEN the system SHALL activate that camera and display the video stream
3. WHEN the video stream is active THEN the system SHALL continuously detect the dominant color from the webcam feed
4. WHEN a dominant color is detected THEN the system SHALL display a color preview box showing the detected RGB values
5. IF the camera stream drops THEN the system SHALL attempt to auto-reconnect the camera
6. WHEN an invalid camera is selected THEN the system SHALL display an error message without crashing

### Requirement 2: Manual Color Control

**User Story:** As a demo presenter, I want to manually send the detected color to the smart bulb, so that I can control when color changes occur during my presentation.

#### Acceptance Criteria

1. WHEN the user interface loads THEN the system SHALL display a "Send Color" button with minimum 50px height
2. WHEN the user clicks the "Send Color" button THEN the system SHALL send the current detected RGB color to the Shelly bulb
3. WHEN the color is sent successfully THEN the bulb SHALL change to the detected color within 2 seconds
4. IF the bulb is offline THEN the system SHALL display an error message and continue operating
5. WHEN the send operation completes THEN the system SHALL provide visual feedback of success or failure

### Requirement 3: Automatic Color Synchronization

**User Story:** As a demo presenter, I want an automatic mode that continuously syncs the detected color to the bulb, so that I can demonstrate real-time color tracking without manual intervention.

#### Acceptance Criteria

1. WHEN the user interface loads THEN the system SHALL display an "Auto Mode" toggle button with minimum 50px height
2. WHEN the user enables auto mode THEN the system SHALL send the detected color to the bulb every 3 seconds
3. WHEN auto mode is active THEN the system SHALL visually indicate the active state
4. WHEN the user disables auto mode THEN the system SHALL stop automatic color sending
5. IF the bulb is offline during auto mode THEN the system SHALL display an error but continue detecting colors

### Requirement 4: Network Communication with Shelly Bulb

**User Story:** As a system, I need to communicate with the Shelly Duo GU10 bulb over the local network, so that I can control its RGBW color settings.

#### Acceptance Criteria

1. WHEN the backend receives a color request THEN the system SHALL convert RGB values to the Shelly API format
2. WHEN sending color commands THEN the system SHALL use HTTP REST calls to the Shelly bulb's local IP address
3. IF the network request fails THEN the system SHALL return an error response without crashing
4. WHEN the bulb responds successfully THEN the system SHALL return a success status to the frontend
5. WHEN the bulb IP is unreachable THEN the system SHALL handle the timeout gracefully

### Requirement 5: Simple Deployment and Configuration

**User Story:** As a demo presenter, I want to start the application with a single command, so that I can quickly set up the demo without complex configuration.

#### Acceptance Criteria

1. WHEN the user runs `mvn spring-boot:run` THEN the system SHALL start the application successfully
2. WHEN the application starts THEN the system SHALL be accessible at a default port without additional configuration
3. WHEN the application is accessed THEN the system SHALL serve the frontend without requiring a separate web server
4. IF dependencies are missing THEN Maven SHALL download them automatically
5. WHEN the application runs THEN the system SHALL require zero manual configuration files from the user

### Requirement 6: User Interface Visibility and Usability

**User Story:** As a conference attendee in the back of the room, I want to see large, high-contrast UI elements, so that I can follow along with the demo from a distance.

#### Acceptance Criteria

1. WHEN the UI renders THEN all interactive buttons SHALL have a minimum height of 50px
2. WHEN displaying text THEN the system SHALL use high contrast colors for visibility
3. WHEN showing the color preview THEN the preview box SHALL be large enough to see from 20 feet away
4. WHEN displaying the video feed THEN the feed SHALL be sized appropriately for conference room viewing
5. WHEN showing status messages THEN the system SHALL use clear, large fonts

### Requirement 7: Cross-Browser Compatibility

**User Story:** As a demo presenter, I want the app to work on multiple browsers, so that I have flexibility in my demo setup.

#### Acceptance Criteria

1. WHEN accessed from Chrome THEN the system SHALL function correctly with camera access
2. WHEN accessed from Firefox THEN the system SHALL function correctly with camera access
3. WHEN accessed from Safari THEN the system SHALL function correctly with camera access
4. WHEN the browser requests camera permissions THEN the system SHALL handle the permission flow
5. IF a browser doesn't support required features THEN the system SHALL display a clear error message

### Requirement 8: Error Handling and Resilience

**User Story:** As a demo presenter, I want the app to handle errors gracefully, so that my demo doesn't crash during the presentation.

#### Acceptance Criteria

1. WHEN a network error occurs THEN the system SHALL display a user-friendly error message
2. WHEN the bulb is offline THEN the system SHALL continue operating and allow retry
3. WHEN camera access is denied THEN the system SHALL display instructions without crashing
4. IF an unexpected error occurs THEN the system SHALL log the error and continue running
5. WHEN errors are displayed THEN the system SHALL provide clear, actionable information
