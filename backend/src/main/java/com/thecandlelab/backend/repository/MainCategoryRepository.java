package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.MainCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MainCategoryRepository extends JpaRepository<MainCategory, UUID> {

    Optional<MainCategory> findBySlugAndDeletedAtIsNull(String slug);

    boolean existsByNameAndDeletedAtIsNull(String name);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    @Query("""
        SELECT c FROM MainCategory c WHERE c.deletedAt IS NULL
        AND (CAST(:search AS string) IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        ORDER BY c.sortOrder ASC, c.createdAt DESC
    """)
    Page<MainCategory> searchCategories(@Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM MainCategory c WHERE c.deletedAt IS NULL AND c.status = 'ACTIVE' ORDER BY c.sortOrder ASC")
    List<MainCategory> findAllActiveOrderBySortOrder();

    List<MainCategory> findAllByDeletedAtIsNullOrderBySortOrderAsc();

    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(String status);
}
