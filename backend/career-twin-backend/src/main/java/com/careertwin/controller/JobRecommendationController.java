
package com.careertwin.controller;

import com.careertwin.dto.JobRecommendationResponse;
import com.careertwin.service.JobRecommendationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobRecommendationController {

    private final JobRecommendationService jobRecommendationService;

    public JobRecommendationController(
            JobRecommendationService jobRecommendationService) {
        this.jobRecommendationService = jobRecommendationService;
    }

    @GetMapping("/recommendations")
    public List<JobRecommendationResponse> getRecommendedJobs() {
        return jobRecommendationService.getRecommendedJobs();
    }
}
