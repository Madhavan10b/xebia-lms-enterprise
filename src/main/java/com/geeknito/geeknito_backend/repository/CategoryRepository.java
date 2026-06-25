package com.geeknito.geeknito_backend.repository;

import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
