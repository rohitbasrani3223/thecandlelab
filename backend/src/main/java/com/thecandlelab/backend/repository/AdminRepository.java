package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {

    Optional<Admin> findByEmailAndDeletedAtIsNull(String email);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    boolean existsByPhoneAndDeletedAtIsNull(String phone);

    @Query("""
        SELECT a FROM Admin a WHERE a.deletedAt IS NULL
        AND (:search IS NULL OR
             LOWER(a.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
             a.phone LIKE CONCAT('%', :search, '%'))
        ORDER BY a.createdAt DESC
    """)
    Page<Admin> searchAdmins(@Param("search") String search, Pageable pageable);

    long countByStatus(String status);

    long countByDeletedAtIsNull();
}
