
package com.careertwin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_progress_history")
public class SkillProgressHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String previousProficiency;
    private String newProficiency;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    public SkillProgressHistory() {
    }

    public Long getId() {
        return id;
    }

    public String getPreviousProficiency() {
        return previousProficiency;
    }

    public void setPreviousProficiency(String previousProficiency) {
        this.previousProficiency = previousProficiency;
    }

    public String getNewProficiency() {
        return newProficiency;
    }

    public void setNewProficiency(String newProficiency) {
        this.newProficiency = newProficiency;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }
}
