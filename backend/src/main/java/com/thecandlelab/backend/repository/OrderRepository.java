package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderNumberAndDeletedAtIsNull(String orderNumber);

    @Query("""
        SELECT o FROM Order o WHERE o.deletedAt IS NULL
        AND (:search IS NULL OR
             LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             o.customerPhone LIKE CONCAT('%', :search, '%'))
        AND (:status IS NULL OR o.orderStatus = :status)
        AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus)
        AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
        ORDER BY o.createdAt DESC
    """)
    Page<Order> searchOrders(
        @Param("search") String search,
        @Param("status") String status,
        @Param("paymentStatus") String paymentStatus,
        @Param("paymentMethod") String paymentMethod,
        Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.deletedAt IS NULL AND o.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.deletedAt IS NULL AND o.paymentStatus = 'PAID' AND o.createdAt >= :from AND o.createdAt <= :to")
    BigDecimal getRevenueBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(o.shippingCharges), 0) FROM Order o WHERE o.deletedAt IS NULL")
    BigDecimal getTotalShippingCharges();

    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o WHERE o.deletedAt IS NULL GROUP BY o.orderStatus")
    List<Object[]> getOrderCountByStatus();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.deletedAt IS NULL AND o.createdAt >= :from AND o.createdAt <= :to")
    long countOrdersBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    long countByDeletedAtIsNull();

    long countByOrderStatusAndDeletedAtIsNull(String status);
}
