package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.entity.Collection;
import com.thecandlelab.backend.service.CollectionService;
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
@RequestMapping("/admin/collections")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Collections", description = "Curated collections management APIs")
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    @Operation(summary = "Get all collections with pagination")
    public ResponseEntity<ApiResponse<Page<Collection>>> getAllCollections(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Collection> pageResult = collectionService.getAllCollections(search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active collections for storefront menu")
    public ResponseEntity<ApiResponse<List<Collection>>> getActiveCollections() {
        return ResponseEntity.ok(ApiResponse.success(collectionService.getActiveCollections()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get collection details by ID")
    public ResponseEntity<ApiResponse<Collection>> getCollectionById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(collectionService.getCollectionById(id)));
    }

    @PostMapping
    @Operation(summary = "Create new curated collection")
    public ResponseEntity<ApiResponse<Collection>> createCollection(@RequestBody Collection collection) {
        Collection saved = collectionService.createCollection(collection);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Collection created successfully", saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update curated collection")
    public ResponseEntity<ApiResponse<Collection>> updateCollection(
            @PathVariable UUID id,
            @RequestBody Collection updated
    ) {
        Collection saved = collectionService.updateCollection(id, updated);
        return ResponseEntity.ok(ApiResponse.success("Collection updated successfully", saved));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle collection status (ACTIVE/INACTIVE)")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "INACTIVE");
        collectionService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Collection status updated to " + status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete collection")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(@PathVariable UUID id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.ok(ApiResponse.success("Collection deleted successfully"));
    }
}
