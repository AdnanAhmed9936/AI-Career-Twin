
package com.careertwin.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {

        return Map.of(
                "status", "SUCCESS",
                "message", "AI Career Twin Backend is Running!"
        );
    }
}
