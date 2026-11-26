
package com.careertwin.controller;

import com.careertwin.entity.Project;
import com.careertwin.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // GET all projects of logged-in user
    @GetMapping
    public List<Project> getProjects(Principal principal) {
        return projectService.getUserProjects(principal.getName());
    }

    // ADD project
    @PostMapping
    public Project addProject(
            @RequestBody Project project,
            Principal principal) {

        return projectService.addProject(
                principal.getName(), project
        );
    }

    // UPDATE project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project,
            Principal principal) {

        return projectService.updateProject(
                principal.getName(), id, project
        );
    }

    // DELETE project
    @DeleteMapping("/{id}")
    public String deleteProject(
            @PathVariable Long id,
            Principal principal) {

        projectService.deleteProject(principal.getName(), id);

        return "Project deleted successfully";
    }
}
