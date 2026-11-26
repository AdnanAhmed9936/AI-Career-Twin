
package com.careertwin.repository;

import com.careertwin.entity.Project;
import com.careertwin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUser(User user);
}
