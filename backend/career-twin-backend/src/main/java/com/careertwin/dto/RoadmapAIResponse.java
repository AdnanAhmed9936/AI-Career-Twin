package com.careertwin.dto;

import java.util.List;

public record RoadmapAIResponse(
        String targetRole,
        String totalDuration,
        List<Phase> phases
) {
    public record Phase(
            String phaseName,
            String duration,
            int phaseOrder,
            List<Task> tasks
    ) {}

    public record Task(
            String title,
            String description,
            String duration
    ) {}
}