
package com.careertwin.service;

import com.careertwin.entity.Project;
import com.careertwin.entity.User;
import com.careertwin.repository.ProjectRepository;
import com.careertwin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Add project
    public Project addProject(String email, Project project) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setUser(user);

        return projectRepository.save(project);
    }

    // Get logged-in user's projects
    public List<Project> getUserProjects(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return projectRepository.findByUser(user);
    }

    // Update project
    public Project updateProject(String email, Long projectId,
                                 Project updatedProject) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        project.setTitle(updatedProject.getTitle());
        project.setCategory(updatedProject.getCategory());
        project.setDescription(updatedProject.getDescription());
        project.setTechnologies(updatedProject.getTechnologies());
        project.setStatus(updatedProject.getStatus());

        return projectRepository.save(project);
    }

    // Delete project
    public void deleteProject(String email, Long projectId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        projectRepository.delete(project);
    }
}
