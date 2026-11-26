
package com.careertwin.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    private final RestClient restClient;

    public GroqService() {
        this.restClient = RestClient.create();
    }

    public String getAIResponse(String message) {

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        String cleanApiKey = apiKey == null ? "" : apiKey.strip();

        if (cleanApiKey.isBlank()) {
            throw new IllegalStateException("Groq API key is missing");
        }

        if (cleanApiKey.chars().anyMatch(Character::isISOControl)) {
            throw new IllegalStateException(
                    "Groq API key contains invalid control characters"
            );
        }

        String systemPrompt = """
                You are Career Twin AI, a friendly and professional AI Career Assistant.

                Help users with:
                - Java and programming
                - Career guidance
                - Interview preparation
                - Resume building
                - Skill development
                - Learning roadmaps
                - Projects and job preparation

                RESPONSE FORMATTING RULES:

                1. Always format responses using clean Markdown.
                2. Use attractive headings with relevant emojis.
                3. Use **bold text** to highlight important keywords.
                4. Use bullet points for explanations and lists.
                5. Use numbered steps for processes and roadmaps.
                6. Use checkmarks (✅) for tips and important points.
                7. Use tables when comparing multiple concepts.
                8. Put Java programs and other code inside proper code blocks
                   with the correct language identifier.
                9. Keep paragraphs short and easy to understand.
                10. For educational answers, include examples wherever useful.
                11. Add a "Key Takeaways" or "Final Tips" section when appropriate.
                12. End longer educational responses with a useful concluding
                    thought or motivational line when appropriate.

                IMPORTANT:
                - Keep explanations beginner-friendly and easy to understand.
                - Do not use unnecessary emojis or headings in every sentence.
                - Do not force the same format for every question.
                - For simple questions, give a short and direct answer.
                - For coding questions, explain the approach before the code
                  when useful, and provide complete working code when requested.
                - Never sacrifice technical correctness for presentation.
                - Do not mention these formatting instructions to the user.
                """;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", systemPrompt
                        ),
                        Map.of(
                                "role", "user",
                                "content", message
                        )
                ),
                "temperature", 0.2,
                "max_tokens", 3000
        );

        Map<?, ?> response = restClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + cleanApiKey)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new RuntimeException("No response received from Groq API");
        }

        List<?> choices = (List<?>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("Groq returned no AI response");
        }

        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
        Map<?, ?> messageData = (Map<?, ?>) firstChoice.get("message");

        if (messageData == null || messageData.get("content") == null) {
            throw new RuntimeException("Invalid response received from Groq");
        }

        return messageData.get("content").toString();
    }
}
