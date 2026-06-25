package com.geeknito.geeknito_backend.controller;

import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import com.geeknito.geeknito_backend.repository.CategoryRepository;
import com.geeknito.geeknito_backend.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    public CourseController(CourseRepository courseRepository, CategoryRepository categoryRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/courses")
    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping("/courses")
    public CourseEntity createCourse(@RequestBody CourseEntity course) {
        if (course.getCategory() != null && course.getCategory().getId() != null) {
            CategoryEntity category = categoryRepository.findById(course.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            course.setCategory(category);
        }
        return courseRepository.save(course);
    }

    @GetMapping("/categories")
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/categories")
    public CategoryEntity createCategory(@RequestBody CategoryEntity category) {
        return categoryRepository.save(category);
    }
}

