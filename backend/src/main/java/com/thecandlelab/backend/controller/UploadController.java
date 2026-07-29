package com.thecandlelab.backend.controller;

import com.thecandlelab.backend.dto.response.ApiResponse;
import com.thecandlelab.backend.service.impl.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Upload", description = "Image upload to Cloudinary")
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    @Operation(summary = "Upload single image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam(defaultValue = "general") String folder
    ) {
        String url = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", Map.of("url", url)));
    }

    @PostMapping("/images")
    @Operation(summary = "Upload multiple images")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> uploadImages(
        @RequestParam("files") List<MultipartFile> files,
        @RequestParam(defaultValue = "products") String folder
    ) {
        List<String> urls = cloudinaryService.uploadMultipleImages(files, folder);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", Map.of("urls", urls)));
    }
}
