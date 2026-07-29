package com.thecandlelab.backend.repository;

import com.thecandlelab.backend.entity.HeroBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HeroBannerRepository extends JpaRepository<HeroBanner, UUID> {

    @Query("SELECT h FROM HeroBanner h WHERE h.deletedAt IS NULL ORDER BY h.sortOrder ASC, h.createdAt DESC")
    List<HeroBanner> findAllActiveBanners();

    @Query("SELECT h FROM HeroBanner h WHERE h.deletedAt IS NULL AND h.status = 'ACTIVE' ORDER BY h.sortOrder ASC")
    List<HeroBanner> findPublishedBanners();
}
