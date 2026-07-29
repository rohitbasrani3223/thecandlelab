package com.thecandlelab.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder}")
    private String baseFolder;

    public String uploadImage(MultipartFile file, String subfolder) {
        try {
            String publicId = baseFolder + "/" + subfolder + "/" + UUID.randomUUID();
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", publicId,
                "overwrite", false,
                "resource_type", "image",
                "quality", "auto",
                "fetch_format", "auto"
            ));
            String url = (String) result.get("secure_url");
            log.info("Image uploaded to Cloudinary: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    public List<String> uploadMultipleImages(List<MultipartFile> files, String subfolder) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadImage(file, subfolder));
        }
        return urls;
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Image deleted from Cloudinary: {}", publicId);
            }
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", imageUrl, e);
        }
    }

    private String extractPublicId(String url) {
        if (url == null || url.isBlank()) return null;
        try {
            int uploadIdx = url.indexOf("/upload/");
            if (uploadIdx != -1) {
                String afterUpload = url.substring(uploadIdx + 8);
                // Remove version if present (e.g. v1234567890/)
                if (afterUpload.startsWith("v") && afterUpload.indexOf("/") > 1) {
                    afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
                }
                // Remove extension
                int dotIdx = afterUpload.lastIndexOf(".");
                return dotIdx != -1 ? afterUpload.substring(0, dotIdx) : afterUpload;
            }
        } catch (Exception e) {
            log.error("Could not extract public ID from URL: {}", url);
        }
        return null;
    }
}
