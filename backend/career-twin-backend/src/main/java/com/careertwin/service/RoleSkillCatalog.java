
package com.careertwin.service;

import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

@Component
public class RoleSkillCatalog {

    private final Map<String, Map<String, Integer>> roleSkills = Map.of(

            "Java Developer", Map.of(
                    "Java", 10,
                    "OOP", 8,
                    "Data Structures", 8,
                    "SQL", 6,
                    "Spring Boot", 10,
                    "REST API", 7,
                    "Hibernate", 6,
                    "Git", 5
            ),

            "App Developer", Map.of(
                    "Java", 8,
                    "Kotlin", 10,
                    "Android Studio", 10,
                    "XML", 5,
                    "REST API", 7,
                    "Firebase", 8,
                    "SQLite", 6,
                    "Git", 6
            ),

            "Data Analyst", Map.of(
                    "Excel", 9,
                    "SQL", 10,
                    "Python", 10,
                    "Pandas", 8,
                    "NumPy", 5,
                    "Statistics", 7,
                    "Power BI", 6,
                    "Data Visualization", 5
            ),

            "Frontend Developer", Map.of(
                    "HTML", 8,
                    "CSS", 8,
                    "JavaScript", 12,
                    "React", 12,
                    "Responsive Design", 7,
                    "REST API", 5,
                    "Git", 8
            ),

            "AI/ML Engineer", Map.of(
                    "Python", 10,
                    "Mathematics", 8,
                    "Statistics", 7,
                    "NumPy", 6,
                    "Pandas", 5,
                    "Machine Learning", 10,
                    "Deep Learning", 8,
                    "Scikit-learn", 6
            ),

            "Backend Developer", Map.of(
                    "Java", 9,
                    "OOP", 7,
                    "Spring Boot", 10,
                    "SQL", 8,
                    "REST API", 8,
                    "Hibernate", 7,
                    "JWT", 5,
                    "Git", 6
            ),

            "Full Stack Developer", Map.of(
                    "HTML", 6,
                    "CSS", 6,
                    "JavaScript", 8,
                    "React", 8,
                    "Java", 8,
                    "Spring Boot", 8,
                    "SQL", 6,
                    "REST API", 5,
                    "Git", 5
            ),

            "Java Full Stack Developer", Map.of(

            )
    );

    public Map<String, Integer> getRequiredSkills(String role) {

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Career role is required");
        }

        return roleSkills.entrySet().stream()
                .filter(entry ->
                        entry.getKey().equalsIgnoreCase(role.trim())
                )
                .map(Map.Entry::getValue)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unsupported career role: " + role
                        )
                );
    }

    public List<String> getAvailableRoles() {
        return List.of(
                "Java Developer",
                "App Developer",
                "Data Analyst",
                "Frontend Developer",
                "AI/ML Engineer",
                "Backend Developer",
                "Full Stack Developer",
                "Java Full Stack Developer"
        );
    }
}
