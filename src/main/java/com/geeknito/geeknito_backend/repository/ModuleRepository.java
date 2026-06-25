package com.geeknito.geeknito_backend.repository;

import com.geeknito.geeknito_backend.entity.learning.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {
}
