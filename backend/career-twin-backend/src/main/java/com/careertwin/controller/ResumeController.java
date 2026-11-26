
package com.careertwin.controller;

import com.careertwin.entity.Resume;
import com.careertwin.service.ResumeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            String email = authentication.getName();

            Resume resume = resumeService.uploadResume(file, email);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Resume uploaded successfully",
                            "resumeId", resume.getId(),
                            "fileName", resume.getFileName(),
                            "uploadedAt", resume.getUploadedAt()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("message", "Unable to upload resume")
            );
        }
    }

    @PostMapping("/{resumeId}/analyze")
    public ResponseEntity<?> analyzeResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        try {
            String email = authentication.getName();

            Resume resume = resumeService.analyzeResume(
                    resumeId, email
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Resume analyzed successfully",
                            "resumeId", resume.getId(),
                            "fileName", resume.getFileName(),
                            "analysis", resume.getAnalysisResult()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Resume analysis failed")
            );
        }
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        try {
            Resume resume = resumeService.getResume(
                    resumeId,
                    authentication.getName()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "resumeId", resume.getId(),
                            "fileName", resume.getFileName(),
                            "uploadedAt", resume.getUploadedAt(),
                            "analysis", resume.getAnalysisResult() == null
                                    ? ""
                                    : resume.getAnalysisResult()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getResumeHistory(
            Authentication authentication) {

        List<Resume> resumes =
                resumeService.getResumeHistory(authentication.getName());

        List<Map<String, Object>> result = resumes.stream()
                .map(resume -> Map.<String, Object>of(
                        "resumeId", resume.getId(),
                        "fileName", resume.getFileName(),
                        "uploadedAt", resume.getUploadedAt(),
                        "analyzed", resume.getAnalysisResult() != null
                                && !resume.getAnalysisResult().isBlank()
                ))
                .toList();

        return ResponseEntity.ok(result);
    }
}
