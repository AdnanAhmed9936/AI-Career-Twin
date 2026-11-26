
package com.careertwin.service;

import com.careertwin.dto.CareerAnalysisResponse;
import com.careertwin.entity.User;
import com.careertwin.entity.Skill;
import com.careertwin.entity.Project;
import com.careertwin.dto.SkillGapItem;
import com.careertwin.dto.SkillGapResponse;

import com.careertwin.repository.UserRepository;
import com.careertwin.repository.SkillRepository;
import com.careertwin.repository.ProjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

@Service
public class CareerTwinService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final RoleSkillCatalog roleSkillCatalog;

    public CareerTwinService(
            UserRepository userRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            RoleSkillCatalog roleSkillCatalog) {

        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.roleSkillCatalog = roleSkillCatalog;
    }

    public CareerAnalysisResponse analyzeCareer(String selectedRole) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = selectedRole;

        if (role == null || role.isBlank()) {
            role = user.getTargetRole();
        }

        if (role == null || role.isBlank()) {
            role = "Java Developer";
        }

        Map<String, Integer> requiredSkills =
                roleSkillCatalog.getRequiredSkills(role);

        List<Skill> userSkills = skillRepository.findByUser(user);
        List<Project> userProjects = projectRepository.findByUser(user);

        List<String> existingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> improvementAreas = new ArrayList<>();
        List<String> projectHighlights = new ArrayList<>();

        // 1. SKILL SCORE OUT OF 60

        double skillPoints = 0;

        for (Map.Entry<String, Integer> entry : requiredSkills.entrySet()) {

            String required = entry.getKey();
            int weight = entry.getValue();

            Skill matchedSkill = null;

            for (Skill skill : userSkills) {

                if (skill.getSkillName() != null &&
                        normalizeSkill(skill.getSkillName())
                                .equals(normalizeSkill(required))) {

                    matchedSkill = skill;
                    break;
                }
            }

            if (matchedSkill == null) {

                missingSkills.add(required);
                improvementAreas.add("Learn and practice " + required + ".");

            } else {

                existingSkills.add(required);

                double multiplier = getProficiencyMultiplier(
                        matchedSkill.getProficiency()
                );

                skillPoints += weight * multiplier;

                if (multiplier < 0.75) {
                    improvementAreas.add(
                            "Improve your " + required + " proficiency."
                    );
                }
            }
        }

        int skillScore = (int) Math.round(skillPoints);

        // 2. PROJECT SCORE OUT OF 25

        double totalProjectScore = 0;

        for (Project project : userProjects) {

            double relevance = calculateProjectRelevance(
                    project, requiredSkills.keySet()
            );

            double completion = isCompleted(project.getStatus())
                    ? 1.0 : 0.5;

            totalProjectScore += 12.5 * relevance * completion;

            if (project.getTitle() != null) {
                projectHighlights.add(project.getTitle());
            }
        }

        int projectScore = (int) Math.round(
                Math.min(totalProjectScore, 25)
        );

        if (projectScore < 10) {
            improvementAreas.add(
                    "Build practical projects related to " + role + "."
            );
        }

        // 3. PROFILE SCORE OUT OF 15

        int profileScore = 0;

        if (user.getFullName() != null &&
                !user.getFullName().isBlank()) {
            profileScore += 5;
        } else {
            improvementAreas.add("Complete your profile name.");
        }

        if (user.getTargetRole() != null &&
                !user.getTargetRole().isBlank()) {
            profileScore += 5;
        } else {
            improvementAreas.add("Set your target career role.");
        }

        if (user.getExperience() != null &&
                !user.getExperience().isBlank()) {
            profileScore += 5;
        } else {
            improvementAreas.add("Add your experience details.");
        }

        // 4. TOTAL READINESS SCORE

        int readinessScore = Math.min(
                skillScore + projectScore + profileScore, 100
        );

        String readinessLevel;

        if (readinessScore >= 80) {
            readinessLevel = "Job Ready";
        } else if (readinessScore >= 60) {
            readinessLevel = "Almost Ready";
        } else if (readinessScore >= 40) {
            readinessLevel = "Developing";
        } else {
            readinessLevel = "Beginner";
        }

        return new CareerAnalysisResponse(
                role,
                readinessScore,
                readinessLevel,
                skillScore,
                projectScore,
                profileScore,
                existingSkills,
                missingSkills,
                improvementAreas,
                userProjects.size(),
                projectHighlights
        );
    }

    private double getProficiencyMultiplier(String proficiency) {

        if (proficiency == null) {
            return 0;
        }

        return switch (proficiency.trim().toLowerCase()) {
            case "beginner" -> 0.25;
            case "intermediate" -> 0.50;
            case "advanced" -> 0.75;
            case "expert" -> 1.0;
            default -> 0;
        };
    }

    private double calculateProjectRelevance(
            Project project, Set<String> requiredSkills) {

        String projectText = (
                safe(project.getTitle()) + " " +
                        safe(project.getCategory()) + " " +
                        safe(project.getDescription()) + " " +
                        safe(project.getTechnologies())
        ).toLowerCase();

        int matches = 0;

        for (String skill : requiredSkills) {

            if (projectText.contains(skill.toLowerCase())) {
                matches++;
            }
        }

        if (requiredSkills.isEmpty()) {
            return 0;
        }

        return Math.min((double) matches / 3.0, 1.0);
    }

    private boolean isCompleted(String status) {

        if (status == null) {
            return false;
        }

        String value = status.trim().toLowerCase();

        return value.equals("completed") ||
                value.equals("complete") ||
                value.equals("done");
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String normalizeSkill(String skill) {

        String value = skill.toLowerCase().trim();

        return switch (value) {

            case "core java", "java programming" -> "java";

            case "oops",
                 "object oriented programming",
                 "object oriented programming concepts" -> "oop";

            case "dsa",
                 "data structures and algorithms",
                 "data structures & algorithms" -> "data structures";

            case "mysql",
                 "structured query language" -> "sql";

            case "spring framework" -> "spring boot";

            case "restful api",
                 "rest apis",
                 "restful apis" -> "rest api";

            case "hibernate orm" -> "hibernate";

            case "version control",
                 "github",
                 "git and github" -> "git";

            default -> value;
        };
    }

    public SkillGapResponse analyzeSkillGaps(String selectedRole) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = selectedRole;

        if (role == null || role.isBlank()) {
            role = user.getTargetRole();
        }

        if (role == null || role.isBlank()) {
            role = "Java Developer";
        }

        Map<String, Integer> requiredSkills =
                roleSkillCatalog.getRequiredSkills(role);

        List<Skill> userSkills = skillRepository.findByUser(user);

        List<SkillGapItem> matchedSkills = new ArrayList<>();
        List<SkillGapItem> missingSkills = new ArrayList<>();
        List<SkillGapItem> improvementSkills = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : requiredSkills.entrySet()) {

            String required = entry.getKey();
            int importance = entry.getValue();

            Skill matchedSkill = null;

            for (Skill skill : userSkills) {

                if (skill.getSkillName() != null &&
                        normalizeSkill(skill.getSkillName())
                                .equals(normalizeSkill(required))) {

                    matchedSkill = skill;
                    break;
                }
            }

            if (matchedSkill == null) {

                missingSkills.add(new SkillGapItem(
                        required,
                        "Not Added",
                        importance,
                        "Start learning and practicing " + required + "."
                ));

            } else {

                String proficiency = matchedSkill.getProficiency();

                SkillGapItem item = new SkillGapItem(
                        required,
                        proficiency,
                        importance,
                        "Continue improving your " + required + " skills."
                );

                double multiplier = getProficiencyMultiplier(proficiency);

                if (multiplier < 0.75) {

                    improvementSkills.add(new SkillGapItem(
                            required,
                            proficiency,
                            importance,
                            "Improve your " + required +
                                    " proficiency from " + proficiency + "."
                    ));

                } else {

                    matchedSkills.add(item);
                }
            }
        }

        return new SkillGapResponse(
                role,
                matchedSkills,
                missingSkills,
                improvementSkills,
                requiredSkills.size(),
                matchedSkills.size() + improvementSkills.size(),
                missingSkills.size()
        );
    }

}
