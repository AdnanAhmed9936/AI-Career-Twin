import React, { useState } from 'react';
import './SkillGap.css';

function SkillGap() {

  const [skills, setSkills] = useState([
    { name: 'Java', required: 'Advanced', current: 'Intermediate' },
    { name: 'React', required: 'Advanced', current: 'Beginner' },
    { name: 'MySQL', required: 'Intermediate', current: 'Intermediate' },
    { name: 'Spring Boot', required: 'Advanced', current: 'Beginner' },
    { name: 'HTML/CSS', required: 'Intermediate', current: 'Advanced' }
  ]);

  const [role, setRole] = useState('Java Full Stack Developer');

  const getStatus = (current, required) => {
    const levels = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3
    };

    return levels[current] >= levels[required]
      ? 'Completed'
      : 'Skill Gap';
  };

  return (
    <div className="skill-gap-page">

      <h1>Skill Gap Analysis</h1>

      <p>Identify your missing skills and improve your career readiness.</p>

      <div className="skill-role">
        <label>Target Career Role</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Java Full Stack Developer</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Software Engineer</option>
        </select>
      </div>

      <div className="skill-summary">

        <div className="summary-card">
          <h3>{skills.length}</h3>
          <p>Total Skills</p>
        </div>

        <div className="summary-card">
          <h3>
            {skills.filter(s =>
              getStatus(s.current, s.required) === 'Completed'
            ).length}
          </h3>
          <p>Completed Skills</p>
        </div>

        <div className="summary-card">
          <h3>
            {skills.filter(s =>
              getStatus(s.current, s.required) === 'Skill Gap'
            ).length}
          </h3>
          <p>Missing Skills</p>
        </div>

      </div>

      <div className="skills-table">

        <h2>Skills Comparison</h2>

        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Required Level</th>
              <th>Your Level</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((skill, index) => (
              <tr key={index}>
                <td>{skill.name}</td>
                <td>{skill.required}</td>
                <td>{skill.current}</td>
                <td>
                  <span className={
                    getStatus(skill.current, skill.required) === 'Completed'
                      ? 'completed'
                      : 'missing'
                  }>
                    {getStatus(skill.current, skill.required)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div className="recommendation">

        <h2>Recommendations</h2>

        <p>Focus on improving these skills:</p>

        {skills
          .filter(s => getStatus(s.current, s.required) === 'Skill Gap')
          .map((skill, index) => (
            <div key={index} className="recommendation-item">
              Learn {skill.name} - Target Level: {skill.required}
            </div>
          ))}

      </div>

    </div>
  );
}

export default SkillGap;