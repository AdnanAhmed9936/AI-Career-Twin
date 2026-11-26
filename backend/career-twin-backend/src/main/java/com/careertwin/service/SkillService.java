
package com.careertwin.service;

import com.careertwin.entity.Skill;
import com.careertwin.entity.User;
import com.careertwin.repository.SkillRepository;
import com.careertwin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import com.careertwin.entity.SkillProgressHistory;
import com.careertwin.repository.SkillProgressHistoryRepository;
import java.time.LocalDateTime;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SkillProgressHistoryRepository historyRepository;

    public SkillService(
            SkillRepository skillRepository,
            UserRepository userRepository,
            SkillProgressHistoryRepository historyRepository) {

        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    public Skill addSkill(String email, Skill skill) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        skill.setUser(user);

        return skillRepository.save(skill);
    }

    public List<Skill> getUserSkills(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return skillRepository.findByUser(user);
    }

    public void deleteSkill(String email, Long skillId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        skillRepository.delete(skill);
    }



    public Skill updateSkill(String email, Long skillId, Skill updatedSkill) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        String oldProficiency = skill.getProficiency();
        String newProficiency = updatedSkill.getProficiency();

        // Save history only if proficiency has changed
        if (newProficiency != null &&
                !newProficiency.equalsIgnoreCase(oldProficiency == null ? "" : oldProficiency)) {

            SkillProgressHistory history = new SkillProgressHistory();

            history.setPreviousProficiency(oldProficiency);
            history.setNewProficiency(newProficiency);
            history.setUpdatedAt(LocalDateTime.now());
            history.setSkill(skill);

            historyRepository.save(history);
        }

        skill.setSkillName(updatedSkill.getSkillName());
        skill.setCategory(updatedSkill.getCategory());
        skill.setProficiency(newProficiency);

        return skillRepository.save(skill);
    }
    public List<SkillProgressHistory> getSkillHistory(
            String email, Long skillId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return historyRepository
                .findBySkill_IdOrderByUpdatedAtDesc(skillId);
    }
}
