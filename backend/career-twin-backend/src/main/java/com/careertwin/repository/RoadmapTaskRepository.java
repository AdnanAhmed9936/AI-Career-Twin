package com.careertwin.repository;

import com.careertwin.entity.RoadmapTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, Long> {

    Optional<RoadmapTask> findByIdAndPhase_Roadmap_IdAndPhase_Roadmap_User_Id(
            Long taskId,
            Long roadmapId,
            Long userId
    );
}