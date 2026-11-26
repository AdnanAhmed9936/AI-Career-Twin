
package com.careertwin.service;

import com.careertwin.chat.GroqService;
import com.careertwin.dto.RoadmapAIResponse;
import com.careertwin.entity.LearningRoadmap;
import com.careertwin.entity.RoadmapPhase;
import com.careertwin.entity.RoadmapTask;
import com.careertwin.entity.User;
import com.careertwin.repository.LearningRoadmapRepository;
import com.careertwin.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

    private final CareerTwinService careerTwinService;
    private final GroqService groqService;
    private final LearningRoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public RoadmapService(
            CareerTwinService careerTwinService,
            GroqService groqService,
            LearningRoadmapRepository roadmapRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper) {

        this.careerTwinService = careerTwinService;
        this.groqService = groqService;
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public LearningRoadmap generateRoadmap(String selectedRole) {

        // 1. Get logged-in user
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Determine target role
        String role = selectedRole;

        if (role == null || role.isBlank()) {
            role = user.getTargetRole();
        }

        if (role == null || role.isBlank()) {
            role = "Java Developer";
        }

        // 3. Get user's skill-gap analysis
        Object skillGap = careerTwinService.analyzeSkillGaps(role);

        String skillGapJson;

        try {
            skillGapJson = objectMapper.writeValueAsString(skillGap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Could not process skill-gap analysis", e);
        }

        // 4. Create prompt for Groq
        String prompt = """
                Create a personalized learning roadmap for this career role.

                Target Role: %s

                User Skill Gap Analysis:
                %s

                Instructions:
                1. Prioritize missing and weak skills.
                2. Start with fundamentals and move to advanced topics.
                3. Create exactly 3 learning phases.
                4. Each phase must contain exactly 3 practical tasks.
                5. Keep every task description under 20 words.
                6. Keep the complete JSON response concise.
                7. Do not include unrelated skills.

                Return ONLY valid JSON.
                Do not use Markdown or code fences.

                Use exactly this JSON structure:
                {
                  "targetRole": "Java Developer",
                  "totalDuration": "12 weeks",
                  "phases": [
                    {
                      "phaseName": "Java Fundamentals",
                      "duration": "3 weeks",
                      "phaseOrder": 1,
                      "tasks": [
                        {
                          "title": "Learn Java basics",
                          "description": "Study variables, data types, operators and control statements.",
                          "duration": "5 days"
                        }
                      ]
                    }
                  ]
                }
                """.formatted(role, skillGapJson);

        // 5. Get AI response
        String aiResponse = groqService.getAIResponse(prompt);

        if (aiResponse == null || aiResponse.isBlank()) {
            throw new RuntimeException("AI returned an empty roadmap");
        }

        // 6. Clean and parse AI JSON
        RoadmapAIResponse roadmapData;

        try {
            String cleanJson = aiResponse.trim();

            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7).trim();
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3).trim();
            }

            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(
                        0, cleanJson.length() - 3).trim();
            }

            roadmapData = objectMapper.readValue(
                    cleanJson,
                    RoadmapAIResponse.class
            );

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "AI returned invalid roadmap JSON", e);
        }

        // 7. Validate AI response
        validateRoadmap(roadmapData);

        // 8. Create roadmap entity
        LearningRoadmap roadmap = new LearningRoadmap();
        roadmap.setTargetRole(role);
        roadmap.setTotalDuration(roadmapData.totalDuration());
        roadmap.setUser(user);

        // 9. Create phases and tasks
        for (RoadmapAIResponse.Phase phaseData : roadmapData.phases()) {

            RoadmapPhase phase = new RoadmapPhase();

            phase.setPhaseName(phaseData.phaseName());
            phase.setDuration(phaseData.duration());
            phase.setPhaseOrder(phaseData.phaseOrder());

            for (RoadmapAIResponse.Task taskData : phaseData.tasks()) {

                RoadmapTask task = new RoadmapTask();

                task.setTitle(taskData.title());
                task.setDescription(taskData.description());
                task.setDuration(taskData.duration());
                task.setCompleted(false);

                phase.addTask(task);
            }

            roadmap.addPhase(phase);
        }

        // 10. Save roadmap in MySQL
        return roadmapRepository.save(roadmap);
    }

    // Validate the generated roadmap
    private void validateRoadmap(RoadmapAIResponse roadmap) {

        if (roadmap == null
                || roadmap.targetRole() == null
                || roadmap.totalDuration() == null
                || roadmap.phases() == null
                || roadmap.phases().isEmpty()) {

            throw new RuntimeException(
                    "AI generated an incomplete roadmap");
        }

        for (RoadmapAIResponse.Phase phase : roadmap.phases()) {

            if (phase == null
                    || phase.phaseName() == null
                    || phase.duration() == null
                    || phase.tasks() == null
                    || phase.tasks().isEmpty()) {

                throw new RuntimeException(
                        "AI generated an invalid roadmap phase");
            }

            for (RoadmapAIResponse.Task task : phase.tasks()) {

                if (task == null
                        || task.title() == null
                        || task.description() == null
                        || task.duration() == null) {

                    throw new RuntimeException(
                            "AI generated an invalid roadmap task");
                }
            }
        }
    }
}
