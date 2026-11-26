package com.careertwin.dto;

public record RoadmapTaskResponse(
        Long id,
        String title,
        String description,
        String duration,
        boolean completed
) {}