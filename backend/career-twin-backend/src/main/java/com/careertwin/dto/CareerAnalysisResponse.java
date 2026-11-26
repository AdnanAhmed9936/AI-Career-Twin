
package com.careertwin.dto;

import java.util.List;

public record CareerAnalysisResponse(
        String targetRole,
        int readinessScore,
        String readinessLevel,
        int skillScore,
        int projectScore,
        int profileScore,
        List<String> existingSkills,
        List<String> missingSkills,
        List<String> improvementAreas,
        int totalProjects,
        List<String> projectHighlights
) {}
