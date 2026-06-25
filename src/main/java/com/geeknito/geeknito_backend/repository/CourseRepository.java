package com.geeknito.geeknito_backend.repository;

import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
}
