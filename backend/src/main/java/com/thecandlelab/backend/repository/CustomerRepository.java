package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Query("""
        SELECT c FROM Customer c WHERE
        (:search IS NULL OR
         LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
         c.phone LIKE CONCAT('%', :search, '%'))
        AND (:status IS NULL OR c.status = :status)
        ORDER BY c.createdAt DESC
    """)
    Page<Customer> searchCustomers(
        @Param("search") String search,
        @Param("status") String status,
        Pageable pageable
    );

    long countByStatus(String status);
}
