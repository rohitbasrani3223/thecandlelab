package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

    Optional<Coupon> findByCodeIgnoreCaseAndDeletedAtIsNull(String code);

    boolean existsByCodeIgnoreCaseAndDeletedAtIsNull(String code);

    @Query("""
        SELECT c FROM Coupon c WHERE c.deletedAt IS NULL
        AND (:search IS NULL OR
             LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR c.status = :status)
        ORDER BY c.createdAt DESC
    """)
    Page<Coupon> searchCoupons(
        @Param("search") String search,
        @Param("status") String status,
        Pageable pageable
    );

    long countByStatusAndDeletedAtIsNull(String status);
}
