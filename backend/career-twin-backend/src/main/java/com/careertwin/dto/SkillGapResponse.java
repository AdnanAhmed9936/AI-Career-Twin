
package com.careertwin.dto;

import java.util.List;

public record SkillGapResponse(
        String targetRole,
        List<SkillGapItem> matchedSkills,
        List<SkillGapItem> missingSkills,
        List<SkillGapItem> improvementSkills,
        int totalRequiredSkills,
        int totalMatchedSkills,
        int totalMissingSkills
) {}
