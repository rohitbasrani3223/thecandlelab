package com.thecandlelab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MainCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 200, message = "Category name must be between 2 and 200 characters")
    private String name;

    private String image;
    private String icon;
    private String bannerDesktop;
    private String bannerMobile;
    private String metaTitle;
    private String metaDescription;
    private Integer sortOrder = 0;
    private String status = "ACTIVE";
}
