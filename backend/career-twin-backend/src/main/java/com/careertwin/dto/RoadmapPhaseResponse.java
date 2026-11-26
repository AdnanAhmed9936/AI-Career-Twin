package com.careertwin.dto;

import java.util.List;

public record RoadmapPhaseResponse(
        Long id,
        String phaseName,
        String duration,
        int phaseOrder,
        List<RoadmapTaskResponse> tasks
) {}