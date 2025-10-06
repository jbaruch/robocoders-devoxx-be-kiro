package com.vibecoding.rgbw.controller;

import com.vibecoding.rgbw.model.ColorRequest;
import com.vibecoding.rgbw.model.ColorResponse;
import com.vibecoding.rgbw.service.ShellyBulbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ColorController {

    private final ShellyBulbService shellyBulbService;

    public ColorController(ShellyBulbService shellyBulbService) {
        this.shellyBulbService = shellyBulbService;
    }

    @PostMapping("/color")
    public ResponseEntity<ColorResponse> setColor(@RequestBody ColorRequest request) {
        // Validate RGB values
        if (request.red() < 0 || request.red() > 255 ||
            request.green() < 0 || request.green() > 255 ||
            request.blue() < 0 || request.blue() > 255) {
            return ResponseEntity.badRequest()
                    .body(new ColorResponse(false, "RGB values must be between 0 and 255"));
        }

        try {
            shellyBulbService.setColor(request.red(), request.green(), request.blue());
            return ResponseEntity.ok(new ColorResponse(true, "Color set successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ColorResponse(false, "Failed to connect to bulb: " + e.getMessage()));
        }
    }
}
