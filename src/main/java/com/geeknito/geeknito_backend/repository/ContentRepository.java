package com.geeknito.geeknito_backend.repository;

import com.geeknito.geeknito_backend.entity.learning.ContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<ContentEntity, Long> {
}
