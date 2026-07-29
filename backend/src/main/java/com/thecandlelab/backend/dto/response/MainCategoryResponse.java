package com.thecandlelab.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MainCategoryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String image;
    private String icon;
    private String bannerDesktop;
    private String bannerMobile;
    private String metaTitle;
    private String metaDescription;
    private Integer sortOrder;
    private String status;
    private Long subCategoryCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
