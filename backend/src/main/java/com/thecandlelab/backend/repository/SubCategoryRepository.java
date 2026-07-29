package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.SubCategory;
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
public interface SubCategoryRepository extends JpaRepository<SubCategory, UUID> {

    Optional<SubCategory> findBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    @Query("""
        SELECT s FROM SubCategory s WHERE s.deletedAt IS NULL
        AND (CAST(:search AS string) IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        AND (:mainCategoryId IS NULL OR s.mainCategory.id = :mainCategoryId)
        ORDER BY s.sortOrder ASC, s.createdAt DESC
    """)
    Page<SubCategory> searchSubCategories(
        @Param("search") String search,
        @Param("mainCategoryId") UUID mainCategoryId,
        Pageable pageable
    );

    @Query("SELECT s FROM SubCategory s WHERE s.mainCategory.id = :mainCategoryId AND s.deletedAt IS NULL AND s.status = 'ACTIVE' ORDER BY s.sortOrder ASC")
    List<SubCategory> findActiveByMainCategory(@Param("mainCategoryId") UUID mainCategoryId);

    long countByMainCategory_IdAndDeletedAtIsNull(UUID mainCategoryId);
}
