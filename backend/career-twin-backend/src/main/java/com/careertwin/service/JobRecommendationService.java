
package com.careertwin.service;

import com.careertwin.dto.JobRecommendationResponse;
import com.careertwin.entity.Job;
import com.careertwin.entity.Skill;
import com.careertwin.entity.User;
import com.careertwin.repository.JobRepository;
import com.careertwin.repository.SkillRepository;
import com.careertwin.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobRecommendationService {

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public JobRecommendationService(
            JobRepository jobRepository,
            SkillRepository skillRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    public List<JobRecommendationResponse> getRecommendedJobs() {

        // Get logged-in user
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Get user's skills
        List<Skill> userSkills = skillRepository.findByUser(user);

        Set<String> userSkillNames = userSkills.stream()
                .filter(skill -> skill.getSkillName() != null)
                .map(skill -> normalize(skill.getSkillName()))
                .collect(Collectors.toSet());

        // Get active jobs
        List<Job> jobs = jobRepository.findByActiveTrue();

        // Calculate matching percentage for every job
        return jobs.stream()
                .map(job -> calculateMatch(job, userSkillNames))
                .sorted(Comparator.comparingInt(
                        JobRecommendationResponse::matchPercentage
                ).reversed())
                .toList();
    }

    private JobRecommendationResponse calculateMatch(
            Job job, Set<String> userSkills) {

        List<String> requiredSkills =
                Arrays.stream(job.getRequiredSkills().split(","))
                        .map(String::trim)
                        .filter(skill -> !skill.isBlank())
                        .toList();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String required : requiredSkills) {

            if (userSkills.contains(normalize(required))) {
                matchedSkills.add(required);
            } else {
                missingSkills.add(required);
            }
        }

        int matchPercentage = requiredSkills.isEmpty()
                ? 0
                : (int) Math.round(
                (matchedSkills.size() * 100.0)
                        / requiredSkills.size()
        );

        return new JobRecommendationResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getExperienceLevel(),
                job.getJobType(),
                job.getDescription(),
                job.getRequiredSkills(),
                job.getSalary(),
                job.getApplicationUrl(),
                matchPercentage,
                matchedSkills,
                missingSkills
        );
    }

    private String normalize(String skill) {

        String value = skill.trim().toLowerCase();

        return switch (value) {
            case "core java", "java programming" -> "java";
            case "oops", "object oriented programming" -> "oop";
            case "mysql", "structured query language" -> "sql";
            case "restful api", "rest apis", "restful apis" -> "rest api";
            case "spring framework" -> "spring boot";
            case "github", "version control" -> "git";
            default -> value;
        };
    }
}
