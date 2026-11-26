
package com.careertwin.dto;

public record CareerTwinAIResponse(
        String targetRole,
        int readinessScore,
        String readinessLevel,
        String recommendations
) {}
