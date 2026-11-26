
package com.careertwin.repository;

import com.careertwin.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrue();

    List<Job> findByActiveTrueAndTitleContainingIgnoreCase(String title);

}
