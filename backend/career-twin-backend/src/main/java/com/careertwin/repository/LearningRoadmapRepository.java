package com.careertwin.repository;

import com.careertwin.entity.LearningRoadmap;
import com.careertwin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningRoadmapRepository
        extends JpaRepository<LearningRoadmap, Long> {

    List<LearningRoadmap> findByUserOrderByCreatedAtDesc(User user);

    Optional<LearningRoadmap> findTopByUserOrderByCreatedAtDesc(User user);
}