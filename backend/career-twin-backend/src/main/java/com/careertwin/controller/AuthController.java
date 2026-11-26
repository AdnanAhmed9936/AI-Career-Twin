
package com.careertwin.controller;

import com.careertwin.dto.RegisterRequest;
import com.careertwin.dto.LoginRequest;
import com.careertwin.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        return Map.of("message", message);
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
