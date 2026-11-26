
package com.careertwin.controller;

import com.careertwin.chat.GroqService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176"})
public class InterviewController {

    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public InterviewController(
            GroqService groqService,
            ObjectMapper objectMapper) {
        this.groqService = groqService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestions(
            @RequestParam String role) {

        String prompt = """
                Generate exactly 5 beginner-friendly technical interview
                questions for the role: %s.

                Return ONLY valid JSON in this format:
                {
                  "questions": [
                    "Question 1",
                    "Question 2",
                    "Question 3",
                    "Question 4",
                    "Question 5"
                  ]
                }
                Do not include Markdown or explanations.
                """.formatted(role);

        try {
            String aiResponse = groqService.getAIResponse(prompt);

            String cleanJson = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            Map<String, Object> result =
                    objectMapper.readValue(cleanJson, Map.class);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error",
                            "Unable to generate interview questions"));
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateAnswers(
            @RequestBody Map<String, Object> request) {

        String role = String.valueOf(request.get("role"));
        Object answers = request.get("answers");

        String prompt = """
                You are an experienced technical interviewer.

                Evaluate the following interview answers for the role: %s.

                Answers:
                %s

                Give feedback in simple language.
                Include:
                1. Overall performance
                2. Strengths
                3. Areas to improve
                4. Suggestions for better answers
                5. An overall score out of 10

                Keep the feedback concise and beginner-friendly.
                """.formatted(role, answers);

        try {
            String feedback = groqService.getAIResponse(prompt);

            return ResponseEntity.ok(
                    Map.of("feedback", feedback)
            );

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Unable to generate interview questions",
                            "details", e.getMessage() == null
                                    ? "Unknown error"
                                    : e.getMessage()
                    ));
        }
    }
}
