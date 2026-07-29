package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Admin dashboard analytics")
public class DashboardController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final InventoryRepository inventoryRepository;
    private final CouponRepository couponRepository;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard KPI summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();

        // Revenue
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        summary.put("totalRevenue", totalRevenue);

        // Today's orders
        LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime todayEnd = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        long todayOrders = orderRepository.countOrdersBetween(todayStart, todayEnd);
        summary.put("todayOrders", todayOrders);

        // Total orders
        long totalOrders = orderRepository.countByDeletedAtIsNull();
        summary.put("totalOrders", totalOrders);

        // Products
        long totalProducts = productRepository.countByDeletedAtIsNull();
        long activeProducts = productRepository.countByStatusAndDeletedAtIsNull("ACTIVE");
        summary.put("totalProducts", totalProducts);
        summary.put("activeProducts", activeProducts);

        // Customers
        long totalCustomers = customerRepository.count();
        long activeCustomers = customerRepository.countByStatus("ACTIVE");
        summary.put("totalCustomers", totalCustomers);
        summary.put("activeCustomers", activeCustomers);

        // Shipping charges
        BigDecimal totalShipping = orderRepository.getTotalShippingCharges();
        summary.put("totalShippingCharges", totalShipping);

        // Inventory alerts
        long lowStock = inventoryRepository.countLowStock();
        long soldOut = inventoryRepository.countSoldOut();
        summary.put("lowStockCount", lowStock);
        summary.put("soldOutCount", soldOut);

        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/order-status")
    @Operation(summary = "Orders count by status (for donut chart)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrdersByStatus() {
        List<Object[]> results = orderRepository.getOrderCountByStatus();
        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("status", row[0]);
            entry.put("count", row[1]);
            data.add(entry);
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/revenue-last7days")
    @Operation(summary = "Daily revenue for last 7 days (line chart)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRevenueLast7Days() {
        List<Map<String, Object>> data = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).toLocalDate().atStartOfDay();
            LocalDateTime dayEnd = LocalDateTime.now().minusDays(i).toLocalDate().atTime(23, 59, 59);

            BigDecimal revenue = orderRepository.getRevenueBetween(dayStart, dayEnd);
            long orders = orderRepository.countOrdersBetween(dayStart, dayEnd);

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", dayStart.toLocalDate().toString());
            entry.put("revenue", revenue);
            entry.put("orders", orders);
            data.add(entry);
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/orders-last7days")
    @Operation(summary = "Daily order counts for last 7 days (line chart)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrdersLast7Days() {
        List<Map<String, Object>> data = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).toLocalDate().atStartOfDay();
            LocalDateTime dayEnd = LocalDateTime.now().minusDays(i).toLocalDate().atTime(23, 59, 59);

            long orders = orderRepository.countOrdersBetween(dayStart, dayEnd);

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", dayStart.toLocalDate().toString());
            entry.put("orders", orders);
            data.add(entry);
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/product-status")
    @Operation(summary = "Products count by status (pie chart)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductStatus() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("active", productRepository.countByStatusAndDeletedAtIsNull("ACTIVE"));
        data.put("inactive", productRepository.countByStatusAndDeletedAtIsNull("INACTIVE"));
        data.put("total", productRepository.countByDeletedAtIsNull());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/stock-levels")
    @Operation(summary = "Stock level summary (bar chart)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStockLevels() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("soldOut", inventoryRepository.countSoldOut());
        data.put("lowStock", inventoryRepository.countLowStock());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/period-comparison")
    @Operation(summary = "Revenue comparison: today vs week vs month")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPeriodComparison() {
        Map<String, Object> data = new LinkedHashMap<>();

        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime todayEnd = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7).toLocalDate().atStartOfDay();
        LocalDateTime monthStart = LocalDateTime.now().minusDays(30).toLocalDate().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        data.put("todayRevenue", orderRepository.getRevenueBetween(today, todayEnd));
        data.put("weekRevenue", orderRepository.getRevenueBetween(weekStart, now));
        data.put("monthRevenue", orderRepository.getRevenueBetween(monthStart, now));

        data.put("todayOrders", orderRepository.countOrdersBetween(today, todayEnd));
        data.put("weekOrders", orderRepository.countOrdersBetween(weekStart, now));
        data.put("monthOrders", orderRepository.countOrdersBetween(monthStart, now));

        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
