
package com.careertwin.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "roadmap_phases")
public class RoadmapPhase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phaseName;

    private String duration;

    private Integer phaseOrder;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private LearningRoadmap roadmap;

    @OneToMany(
            mappedBy = "phase",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RoadmapTask> tasks = new ArrayList<>();

    public RoadmapPhase() {
    }

    public Long getId() {
        return id;
    }

    public String getPhaseName() {
        return phaseName;
    }

    public void setPhaseName(String phaseName) {
        this.phaseName = phaseName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getPhaseOrder() {
        return phaseOrder;
    }

    public void setPhaseOrder(Integer phaseOrder) {
        this.phaseOrder = phaseOrder;
    }

    public LearningRoadmap getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(LearningRoadmap roadmap) {
        this.roadmap = roadmap;
    }

    public List<RoadmapTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<RoadmapTask> tasks) {
        this.tasks = tasks;
    }

    public void addTask(RoadmapTask task) {
        tasks.add(task);
        task.setPhase(this);
    }
}
