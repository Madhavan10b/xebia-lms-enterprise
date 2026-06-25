package com.geeknito.geeknito_backend;

import com.geeknito.geeknito_backend.entity.learning.*;
import com.geeknito.geeknito_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final SubmoduleRepository submoduleRepository;
    private final ContentRepository contentRepository;

    public DataLoader(CategoryRepository categoryRepository,
                      CourseRepository courseRepository,
                      ModuleRepository moduleRepository,
                      SubmoduleRepository submoduleRepository,
                      ContentRepository contentRepository) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.submoduleRepository = submoduleRepository;
        this.contentRepository = contentRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Data Initialization ---");

        // 1. Create Category
        CategoryEntity category = CategoryEntity.builder()
                .name("Software Development")
                .icon("dev-icon-url")
                .description("Courses related to web, mobile, and backend software engineering.")
                .color("#007bff")
                .isActive(true)
                .build();
        category = categoryRepository.save(category);

        // 2. Create Course
        CourseEntity course = CourseEntity.builder()
                .title("Introduction to Spring Boot")
                .slug("intro-to-spring-boot")
                .description("Learn Spring Boot from scratch.")
                .shortDescription("Spring Boot basics.")
                .level("Beginner")
                .language("English")
                .duration("10 Hours")
                .isActive(true)
                .category(category)
                .build();
        course = courseRepository.save(course);

        // 3. Create Module
        ModuleEntity module = ModuleEntity.builder()
                .title("Getting Started with JPA")
                .description("Understanding Hibernate and database persistence.")
                .moduleOrder(1)
                .isActive(true)
                .course(course)
                .build();
        module = moduleRepository.save(module);

        // 4. Create Submodule
        SubmoduleEntity submodule = SubmoduleEntity.builder()
                .title("Creating Entities")
                .description("How to map Java classes to database tables.")
                .submoduleOrder(1)
                .isActive(true)
                .slug("creating-entities")
                .module(module)
                .build();
        submodule = submoduleRepository.save(submodule);

        // 5. Create Content
        ContentEntity content = ContentEntity.builder()
                .type("text")
                .text("In this lesson, we will cover how to use Jakarta Persistence annotations.")
                .contentOrder(1)
                .isActive(true)
                .submodule(submodule)
                .build();
        contentRepository.save(content);

        System.out.println("--- Data Initialization Completed Successfully ---");
    }
}
