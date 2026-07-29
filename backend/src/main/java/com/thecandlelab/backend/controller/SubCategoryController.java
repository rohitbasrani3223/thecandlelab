package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.entity.MainCategory;
import com.thecandlelab.backend.entity.SubCategory;
import com.thecandlelab.backend.repository.MainCategoryRepository;
import com.thecandlelab.backend.repository.SubCategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/sub-categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Sub Categories", description = "Sub category management APIs")
public class SubCategoryController {

    private final SubCategoryRepository subCategoryRepository;
    private final MainCategoryRepository mainCategoryRepository;

    @GetMapping
    @Operation(summary = "Get all sub categories with pagination")
    public ResponseEntity<ApiResponse<Page<SubCategory>>> getAllSubCategories(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<SubCategory> pageResult = subCategoryRepository.searchSubCategories(search, null, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active sub categories list")
    public ResponseEntity<ApiResponse<List<SubCategory>>> getActiveSubCategories() {
        return ResponseEntity.ok(ApiResponse.success(subCategoryRepository.searchSubCategories(null, null, PageRequest.of(0, 100)).getContent()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sub category details by ID")
    public ResponseEntity<ApiResponse<SubCategory>> getSubCategoryById(@PathVariable UUID id) {
        return subCategoryRepository.findById(id)
                .map(sc -> ResponseEntity.ok(ApiResponse.success(sc)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new sub category")
    public ResponseEntity<ApiResponse<SubCategory>> createSubCategory(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String slug = (String) body.get("slug");
        if (slug == null || slug.trim().isEmpty()) {
            if (name != null) {
                slug = name.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");
            } else {
                slug = "sub-category";
            }
        }
        String baseSlug = slug;
        int counter = 1;
        while (subCategoryRepository.existsBySlugAndDeletedAtIsNull(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        String mainCatIdStr = body.get("mainCategoryId") != null ? body.get("mainCategoryId").toString() : null;
        if (mainCatIdStr == null && body.get("mainCategory") instanceof Map) {
            Map<?, ?> mc = (Map<?, ?>) body.get("mainCategory");
            if (mc.get("id") != null) mainCatIdStr = mc.get("id").toString();
        }

        MainCategory mainCategory = null;
        if (mainCatIdStr != null && !mainCatIdStr.isEmpty()) {
            mainCategory = mainCategoryRepository.findById(UUID.fromString(mainCatIdStr)).orElse(null);
        }

        Integer sortOrder = body.get("sortOrder") != null ? Integer.parseInt(body.get("sortOrder").toString()) : 1;
        String status = body.get("status") != null ? body.get("status").toString() : "ACTIVE";

        SubCategory subCategory = SubCategory.builder()
                .name(name)
                .slug(slug)
                .mainCategory(mainCategory)
                .sortOrder(sortOrder)
                .status(status)
                .build();

        SubCategory saved = subCategoryRepository.save(subCategory);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sub category created successfully", saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update sub category")
    public ResponseEntity<ApiResponse<SubCategory>> updateSubCategory(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body
    ) {
        return subCategoryRepository.findById(id)
                .map(existing -> {
                    if (body.containsKey("name")) existing.setName((String) body.get("name"));
                    String slug = (String) body.get("slug");
                    if (slug == null || slug.trim().isEmpty()) {
                        if (existing.getName() != null) {
                            slug = existing.getName().toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");
                        }
                    }
                    existing.setSlug(slug);

                    String mainCatIdStr = body.get("mainCategoryId") != null ? body.get("mainCategoryId").toString() : null;
                    if (mainCatIdStr == null && body.get("mainCategory") instanceof Map) {
                        Map<?, ?> mc = (Map<?, ?>) body.get("mainCategory");
                        if (mc.get("id") != null) mainCatIdStr = mc.get("id").toString();
                    }
                    if (mainCatIdStr != null && !mainCatIdStr.isEmpty()) {
                        mainCategoryRepository.findById(UUID.fromString(mainCatIdStr)).ifPresent(existing::setMainCategory);
                    }

                    if (body.containsKey("sortOrder")) existing.setSortOrder(Integer.parseInt(body.get("sortOrder").toString()));
                    if (body.containsKey("status")) existing.setStatus((String) body.get("status"));

                    SubCategory saved = subCategoryRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.success("Sub category updated successfully", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle sub category status (ACTIVE/INACTIVE)")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "INACTIVE");
        subCategoryRepository.findById(id).ifPresent(sc -> {
            sc.setStatus(status);
            subCategoryRepository.save(sc);
        });
        return ResponseEntity.ok(ApiResponse.success("Sub category status updated to " + status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete sub category")
    public ResponseEntity<ApiResponse<Void>> deleteSubCategory(@PathVariable UUID id) {
        subCategoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Sub category deleted successfully"));
    }
}
