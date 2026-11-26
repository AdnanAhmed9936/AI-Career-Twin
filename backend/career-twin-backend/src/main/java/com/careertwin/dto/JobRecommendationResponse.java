
package com.careertwin.dto;

import java.util.List;

public record JobRecommendationResponse(
        Long id,
        String title,
        String company,
        String location,
        String experienceLevel,
        String jobType,
        String description,
        String requiredSkills,
        String salary,
        String applicationUrl,
        int matchPercentage,
        List<String> matchedSkills,
        List<String> missingSkills
) {
}
