package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.entity.Coupon;
import com.thecandlelab.backend.repository.CouponRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/coupons")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Coupons", description = "Coupon codes & promotions management APIs")
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping
    @Operation(summary = "Get all coupons with pagination")
    public ResponseEntity<ApiResponse<Page<Coupon>>> getAllCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Coupon> pageResult = couponRepository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(pageResult));
    }

    @PostMapping
    @Operation(summary = "Create new coupon code")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete coupon code")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable UUID id) {
        couponRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully"));
    }
}
