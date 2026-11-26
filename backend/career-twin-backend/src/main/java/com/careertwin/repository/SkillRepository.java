
package com.careertwin.repository;

import com.careertwin.entity.Skill;
import com.careertwin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);

}
