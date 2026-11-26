
package com.careertwin.repository;

import com.careertwin.entity.SkillProgressHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillProgressHistoryRepository
        extends JpaRepository<SkillProgressHistory, Long> {

    List<SkillProgressHistory> findBySkill_IdOrderByUpdatedAtDesc(Long skillId);
}
