package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.entity.Inventory;
import com.thecandlelab.backend.repository.InventoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/inventory")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Inventory", description = "Stock control and inventory management APIs")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @GetMapping
    @Operation(summary = "Get all inventory items with pagination")
    public ResponseEntity<ApiResponse<Page<Inventory>>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Inventory> pageResult = inventoryRepository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update inventory available stock")
    public ResponseEntity<ApiResponse<Void>> updateStock(
            @PathVariable UUID id,
            @RequestBody Map<String, Integer> body
    ) {
        Integer newStock = body.getOrDefault("quantity", 0);
        inventoryRepository.findById(id).ifPresent(inv -> {
            inv.setCurrentStock(newStock);
            inventoryRepository.save(inv);
        });
        return ResponseEntity.ok(ApiResponse.success("Stock updated to " + newStock));
    }
}
