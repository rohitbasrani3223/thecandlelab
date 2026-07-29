package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, UUID> {
    List<Collection> findByDeletedAtIsNull();
    Optional<Collection> findBySlug(String slug);
}
