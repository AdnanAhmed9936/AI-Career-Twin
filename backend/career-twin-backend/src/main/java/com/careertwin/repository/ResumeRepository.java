
package com.careertwin.repository;

import com.careertwin.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUser_EmailOrderByUploadedAtDesc(String email);

    Optional<Resume> findByIdAndUser_Email(Long id, String email);
}
