
package com.careertwin.chat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GroqService groqService;

    public ChatController(GroqService groqService) {
        this.groqService = groqService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        if (request == null ||
                request.message() == null ||
                request.message().isBlank()) {

            return ResponseEntity.badRequest().build();
        }

        String reply = groqService.getAIResponse(request.message());

        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
