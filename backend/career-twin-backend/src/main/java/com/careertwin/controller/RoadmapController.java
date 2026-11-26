
package com.careertwin.controller;

import com.careertwin.dto.LearningRoadmapResponse;
import com.careertwin.dto.RoadmapPhaseResponse;
import com.careertwin.dto.RoadmapTaskResponse;
import com.careertwin.dto.UpdateTaskRequest;
import com.careertwin.entity.LearningRoadmap;
import com.careertwin.entity.RoadmapPhase;
import com.careertwin.entity.RoadmapTask;
import com.careertwin.entity.User;
import com.careertwin.repository.LearningRoadmapRepository;
import com.careertwin.repository.RoadmapTaskRepository;
import com.careertwin.repository.UserRepository;
import com.careertwin.service.RoadmapService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5176",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5177"
})
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final LearningRoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final RoadmapTaskRepository taskRepository;

    public RoadmapController(
            RoadmapService roadmapService,
            LearningRoadmapRepository roadmapRepository,
            UserRepository userRepository,
            RoadmapTaskRepository taskRepository) {

        this.roadmapService = roadmapService;
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    // Generate and save a new roadmap
    @PostMapping("/generate")
    public ResponseEntity<LearningRoadmapResponse> generateRoadmap(
            @RequestParam(required = false) String role) {

        LearningRoadmap roadmap = roadmapService.generateRoadmap(role);

        return ResponseEntity.ok(convertToResponse(roadmap));
    }

    // Get the latest roadmap of the logged-in user
    @GetMapping("/latest")
    public ResponseEntity<LearningRoadmapResponse> getLatestRoadmap() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return roadmapRepository
                .findTopByUserOrderByCreatedAtDesc(user)
                .map(roadmap -> ResponseEntity.ok(convertToResponse(roadmap)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Update task completion status
    @PatchMapping("/{roadmapId}/tasks/{taskId}")
    @Transactional
    public ResponseEntity<RoadmapTaskResponse> updateTaskStatus(
            @PathVariable Long roadmapId,
            @PathVariable Long taskId,
            @RequestBody UpdateTaskRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        RoadmapTask task = taskRepository
                .findByIdAndPhase_Roadmap_IdAndPhase_Roadmap_User_Id(
                        taskId, roadmapId, user.getId()
                )
                .orElse(null);

        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        task.setCompleted(request.completed());

        taskRepository.save(task);

        return ResponseEntity.ok(convertToTask(task));
    }

    // Convert database entity into response DTO
    private LearningRoadmapResponse convertToResponse(
            LearningRoadmap roadmap) {

        List<RoadmapPhaseResponse> phases =
                roadmap.getPhases().stream()
                        .map(this::convertPhase)
                        .toList();

        return new LearningRoadmapResponse(
                roadmap.getId(),
                roadmap.getTargetRole(),
                roadmap.getTotalDuration(),
                roadmap.getCreatedAt(),
                phases
        );
    }

    private RoadmapPhaseResponse convertPhase(RoadmapPhase phase) {

        List<RoadmapTaskResponse> tasks =
                phase.getTasks().stream()
                        .map(this::convertTask)
                        .toList();

        return new RoadmapPhaseResponse(
                phase.getId(),
                phase.getPhaseName(),
                phase.getDuration(),
                phase.getPhaseOrder(),
                tasks
        );
    }

    private RoadmapTaskResponse convertTask(RoadmapTask task) {

        return new RoadmapTaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDuration(),
                task.isCompleted()
        );
    }

    private RoadmapTaskResponse convertToTask(RoadmapTask task) {
        return convertTask(task);
    }
}
