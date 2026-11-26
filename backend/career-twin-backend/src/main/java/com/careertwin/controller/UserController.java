
package com.careertwin.controller;

import com.careertwin.dto.ProfileResponse;
import com.careertwin.dto.ProfileUpdateRequest;
import com.careertwin.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get logged-in user's profile
    @GetMapping("/me")
    public ProfileResponse getProfile(Authentication authentication) {

        String email = authentication.getName();

        return userService.getProfile(email);
    }

    // Update logged-in user's profile
    @PutMapping("/me")
    public ProfileResponse updateProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return userService.updateProfile(email, request);
    }
}
