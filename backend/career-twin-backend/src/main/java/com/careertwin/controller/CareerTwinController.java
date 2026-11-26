
package com.careertwin.controller;
import com.careertwin.dto.SkillGapResponse;
import com.careertwin.dto.CareerAnalysisResponse;
import com.careertwin.dto.CareerTwinAIResponse;
import com.careertwin.service.CareerTwinService;
import com.careertwin.service.CareerTwinAIService;
import com.careertwin.service.RoleSkillCatalog;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-twin")
public class CareerTwinController {

    private final CareerTwinService careerTwinService;
    private final CareerTwinAIService careerTwinAIService;
    private final RoleSkillCatalog roleSkillCatalog;

    public CareerTwinController(
            CareerTwinService careerTwinService,
            CareerTwinAIService careerTwinAIService,
            RoleSkillCatalog roleSkillCatalog) {

        this.careerTwinService = careerTwinService;
        this.careerTwinAIService = careerTwinAIService;
        this.roleSkillCatalog = roleSkillCatalog;
    }

    @GetMapping("/roles")
    public List<String> getAvailableRoles() {
        return roleSkillCatalog.getAvailableRoles();
    }

    @GetMapping("/analyze")
    public CareerAnalysisResponse analyzeCareer(
            @RequestParam(required = false) String role) {

        return careerTwinService.analyzeCareer(role);
    }

    @GetMapping("/recommendations")
    public CareerTwinAIResponse getRecommendations(
            @RequestParam(required = false) String role) {

        return careerTwinAIService.generateRecommendations(role);
    }

    @GetMapping("/skill-gap")
    public SkillGapResponse analyzeSkillGaps(
            @RequestParam(required = false) String role) {

        return careerTwinService.analyzeSkillGaps(role);
    }

}
