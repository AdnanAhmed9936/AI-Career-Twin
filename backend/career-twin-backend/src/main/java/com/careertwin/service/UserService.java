
package com.careertwin.service;

import com.careertwin.dto.ProfileResponse;
import com.careertwin.dto.ProfileUpdateRequest;
import com.careertwin.entity.User;
import com.careertwin.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get logged-in user's profile
    public ProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getFullName(),
                user.getEmail(),
                user.getTargetRole(),
                user.getExperience(),
                user.getLocation()
        );
    }

    // Update logged-in user's profile
    public ProfileResponse updateProfile(
            String email,
            ProfileUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setTargetRole(request.getTargetRole());
        user.setExperience(request.getExperience());
        user.setLocation(request.getLocation());

        User updatedUser = userRepository.save(user);

        return new ProfileResponse(
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getTargetRole(),
                updatedUser.getExperience(),
                updatedUser.getLocation()
        );
    }
}
