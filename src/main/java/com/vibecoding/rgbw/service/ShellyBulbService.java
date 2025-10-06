package com.vibecoding.rgbw.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ShellyBulbService {

    private final RestClient restClient;
    private final String bulbIp;

    public ShellyBulbService(@Value("${shelly.bulb.ip}") String bulbIp) {
        this.bulbIp = bulbIp;
        this.restClient = RestClient.builder().build();
    }

    public void setColor(int red, int green, int blue) {
        String url = String.format("http://%s/light/0?turn=on&red=%d&green=%d&blue=%d",
                bulbIp, red, green, blue);
        
        try {
            restClient.get()
                    .uri(url)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to bulb: " + e.getMessage(), e);
        }
    }
}
