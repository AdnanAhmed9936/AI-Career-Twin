
package com.careertwin.config;

import com.careertwin.entity.Job;
import com.careertwin.repository.JobRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadJobs(JobRepository jobRepository) {

        return args -> {

            // Avoid inserting duplicate jobs every time the app starts
            if (jobRepository.count() > 0) {
                return;
            }

            Job job1 = new Job();
            job1.setTitle("Java Developer Intern");
            job1.setCompany("Tech Solutions");
            job1.setLocation("Remote");
            job1.setExperienceLevel("Fresher");
            job1.setJobType("Internship");
            job1.setDescription("Work on Java backend applications and REST APIs.");
            job1.setRequiredSkills("Java,OOP,SQL,Spring Boot,REST API,Git");
            job1.setSalary("₹10,000 - ₹15,000/month");
            job1.setApplicationUrl("https://example.com/apply/java-intern");

            Job job2 = new Job();
            job2.setTitle("Spring Boot Developer");
            job2.setCompany("CodeWorks");
            job2.setLocation("Bengaluru");
            job2.setExperienceLevel("Fresher");
            job2.setJobType("Full-time");
            job2.setDescription("Develop backend services using Spring Boot.");
            job2.setRequiredSkills("Java,Spring Boot,Hibernate,SQL,REST API,Git");
            job2.setSalary("₹3 - 5 LPA");
            job2.setApplicationUrl("https://example.com/apply/spring-boot");

            Job job3 = new Job();
            job3.setTitle("Java Full Stack Developer");
            job3.setCompany("WebTech");
            job3.setLocation("Remote");
            job3.setExperienceLevel("Fresher");
            job3.setJobType("Full-time");
            job3.setDescription("Build full stack applications using React and Java.");
            job3.setRequiredSkills("Java,Spring Boot,React,HTML,CSS,JavaScript,SQL");
            job3.setSalary("₹4 - 6 LPA");
            job3.setApplicationUrl("https://example.com/apply/full-stack");

            Job job4 = new Job();
            job4.setTitle("Backend Developer Intern");
            job4.setCompany("Innovate Labs");
            job4.setLocation("Pune");
            job4.setExperienceLevel("Fresher");
            job4.setJobType("Internship");
            job4.setDescription("Build and test backend APIs.");
            job4.setRequiredSkills("Java,SQL,REST API,Spring Boot,Git");
            job4.setSalary("₹8,000 - ₹12,000/month");
            job4.setApplicationUrl("https://example.com/apply/backend");

            jobRepository.save(job1);
            jobRepository.save(job2);
            jobRepository.save(job3);
            jobRepository.save(job4);

            System.out.println("Sample jobs inserted successfully!");
        };
    }
}
