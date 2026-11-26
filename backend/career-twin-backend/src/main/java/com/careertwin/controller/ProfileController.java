
package com.careertwin.controller;

import com.careertwin.entity.User;
import com.careertwin.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> getMyProfile(Principal principal) {

        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "targetRole", user.getTargetRole() == null ? "" : user.getTargetRole(),
                "experience", user.getExperience() == null ? "" : user.getExperience(),
                "location", user.getLocation() == null ? "" : user.getLocation(),
                "createdAt", user.getCreatedAt()
        );
    }

    @PutMapping("/me")
    public Map<String, Object> updateMyProfile(
            Principal principal,
            @RequestBody Map<String, String> request) {

        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        String fullName = request.get("fullName");
        String targetRole = request.get("targetRole");

        if (fullName == null || fullName.isBlank()
                || targetRole == null || targetRole.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Name and target role are required");
        }

        user.setFullName(fullName.trim());
        user.setTargetRole(targetRole.trim());

        // Update these fields when values are provided
        if (request.containsKey("experience")) {
            user.setExperience(request.get("experience"));
        }

        if (request.containsKey("location")) {
            user.setLocation(request.get("location"));
        }

        userRepository.save(user);

        return Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "targetRole", user.getTargetRole(),
                "experience", user.getExperience() == null ? "" : user.getExperience(),
                "location", user.getLocation() == null ? "" : user.getLocation(),
                "createdAt", user.getCreatedAt()
        );
    }
}
