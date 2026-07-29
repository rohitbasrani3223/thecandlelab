package com.thecandlelab.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "popup_banners")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PopupBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 255)
    private String title;

    @Column(nullable = false, length = 500)
    private String image;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "show_on_pages", length = 100)
    private String showOnPages = "HOME";

    @Column(name = "show_after_seconds")
    private Integer showAfterSeconds = 3;

    @Column(name = "show_once_per_session")
    private Boolean showOncePerSession = true;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
