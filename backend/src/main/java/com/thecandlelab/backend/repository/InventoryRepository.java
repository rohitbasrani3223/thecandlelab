package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    List<Inventory> findByProduct_Id(UUID productId);

    @Query("""
        SELECT i FROM Inventory i
        JOIN i.product p
        WHERE p.deletedAt IS NULL
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:subCategoryId IS NULL OR p.subCategory.id = :subCategoryId)
        ORDER BY p.name ASC
    """)
    Page<Inventory> searchInventory(
        @Param("search") String search,
        @Param("subCategoryId") UUID subCategoryId,
        Pageable pageable
    );

    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.lowStockThreshold AND i.currentStock > 0")
    List<Inventory> findLowStockInventory();

    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0")
    List<Inventory> findSoldOutInventory();

    long countByCurrentStockEquals(int stock);

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= i.lowStockThreshold AND i.currentStock > 0")
    long countLowStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock = 0")
    long countSoldOut();
}
