
package com.careertwin.dto;

import java.time.LocalDateTime;
import java.util.List;

public record LearningRoadmapResponse(
        Long id,
        String targetRole,
        String totalDuration,
        LocalDateTime createdAt,
        List<RoadmapPhaseResponse> phases
) {}