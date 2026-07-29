package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.request.MainCategoryRequest;
import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.dto.response.MainCategoryResponse;
import com.thecandlelab.backend.service.impl.MainCategoryServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/main-categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Main Categories", description = "Main category management")
public class MainCategoryController {

    private final MainCategoryServiceImpl mainCategoryService;

    @GetMapping
    @Operation(summary = "Get all main categories with search and pagination")
    public ResponseEntity<ApiResponse<Page<MainCategoryResponse>>> getAllCategories(
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            mainCategoryService.getAllCategories(search, page, size)
        ));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active categories (for frontend dropdown)")
    public ResponseEntity<ApiResponse<List<MainCategoryResponse>>> getActiveCategories() {
        return ResponseEntity.ok(ApiResponse.success(
            mainCategoryService.getAllActiveCategories()
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<MainCategoryResponse>> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
            mainCategoryService.getCategoryById(id)
        ));
    }

    @PostMapping
    @Operation(summary = "Create new main category")
    public ResponseEntity<ApiResponse<MainCategoryResponse>> createCategory(
        @Valid @RequestBody MainCategoryRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        // In production: get adminId from JWT context
        UUID adminId = UUID.randomUUID(); // TODO: extract from security context
        MainCategoryResponse response = mainCategoryService.createCategory(request, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Main category created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update main category")
    public ResponseEntity<ApiResponse<MainCategoryResponse>> updateCategory(
        @PathVariable UUID id,
        @Valid @RequestBody MainCategoryRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        UUID adminId = UUID.randomUUID(); // TODO: extract from security context
        MainCategoryResponse response = mainCategoryService.updateCategory(id, request, adminId);
        return ResponseEntity.ok(ApiResponse.success("Main category updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle category status (ACTIVE/INACTIVE)")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
        @PathVariable UUID id,
        @RequestBody Map<String, String> body,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        String status = body.getOrDefault("status", "INACTIVE");
        UUID adminId = UUID.randomUUID();
        mainCategoryService.updateStatus(id, status, adminId);
        return ResponseEntity.ok(ApiResponse.success("Category status updated to " + status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (soft delete) main category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
        @PathVariable UUID id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        UUID adminId = UUID.randomUUID();
        mainCategoryService.deleteCategory(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Main category deleted successfully"));
    }
}
