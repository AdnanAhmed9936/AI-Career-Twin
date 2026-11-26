
package com.careertwin.controller;

import com.careertwin.entity.Skill;
import com.careertwin.entity.SkillProgressHistory;
import com.careertwin.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // Add a new skill
    @PostMapping
    public Skill addSkill(@RequestBody Skill skill, Principal principal) {
        return skillService.addSkill(principal.getName(), skill);
    }

    // Get all skills of logged-in user
    @GetMapping
    public List<Skill> getSkills(Principal principal) {
        return skillService.getUserSkills(principal.getName());
    }

    // Delete a skill
    @DeleteMapping("/{id}")
    public String deleteSkill(@PathVariable Long id, Principal principal) {
        skillService.deleteSkill(principal.getName(), id);
        return "Skill deleted successfully";
    }



    @PutMapping("/{id}")
    public Skill updateSkill(
            Principal principal,
            @PathVariable Long id,
            @RequestBody Skill skill) {

        return skillService.updateSkill(
                principal.getName(),
                id,
                skill
        );
    }
    @GetMapping("/{id}/history")
    public List<SkillProgressHistory> getSkillHistory(
            @PathVariable Long id,
            Principal principal) {

        return skillService.getSkillHistory(principal.getName(), id);
    }
}
