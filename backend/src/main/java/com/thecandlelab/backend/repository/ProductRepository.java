package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Product;
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
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    @Query("""
        SELECT p FROM Product p WHERE p.deletedAt IS NULL
        AND (CAST(:search AS string) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        AND (:status IS NULL OR p.status = :status)
        AND (:subCategoryId IS NULL OR p.subCategory.id = :subCategoryId)
        ORDER BY p.createdAt DESC
    """)
    Page<Product> searchProducts(
        @Param("search") String search,
        @Param("status") String status,
        @Param("subCategoryId") UUID subCategoryId,
        Pageable pageable
    );

    List<Product> findByIsFeaturedTrueAndStatusAndDeletedAtIsNull(String status);

    List<Product> findByIsBestSellerTrueAndStatusAndDeletedAtIsNull(String status);

    List<Product> findByIsNewArrivalTrueAndStatusAndDeletedAtIsNull(String status);

    List<Product> findByIsTrendingTrueAndStatusAndDeletedAtIsNull(String status);

    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(String status);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.deletedAt IS NULL AND p.createdAt >= :from")
    long countCreatedSince(@Param("from") java.time.LocalDateTime from);
}
