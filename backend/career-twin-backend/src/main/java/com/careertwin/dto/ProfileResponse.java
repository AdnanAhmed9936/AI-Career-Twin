
package com.careertwin.dto;

public class ProfileResponse {

    private String fullName;
    private String email;
    private String targetRole;
    private String experience;
    private String location;

    public ProfileResponse() {
    }

    public ProfileResponse(String fullName, String email,
                           String targetRole, String experience,
                           String location) {
        this.fullName = fullName;
        this.email = email;
        this.targetRole = targetRole;
        this.experience = experience;
        this.location = location;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public String getExperience() {
        return experience;
    }

    public String getLocation() {
        return location;
    }
}
