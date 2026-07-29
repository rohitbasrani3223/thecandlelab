package com.thecandlelab.backend.service.impl;

import com.thecandlelab.backend.dto.request.MainCategoryRequest;
import com.thecandlelab.backend.dto.response.MainCategoryResponse;
import com.thecandlelab.backend.entity.MainCategory;
import com.thecandlelab.backend.exception.ResourceNotFoundException;
import com.thecandlelab.backend.repository.MainCategoryRepository;
import com.thecandlelab.backend.repository.SubCategoryRepository;
import com.thecandlelab.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainCategoryServiceImpl {

    private final MainCategoryRepository mainCategoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Transactional(readOnly = true)
    public Page<MainCategoryResponse> getAllCategories(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return mainCategoryRepository.searchCategories(search, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public MainCategoryResponse getCategoryById(UUID id) {
        MainCategory category = findByIdOrThrow(id);
        return toResponse(category);
    }

    @Transactional
    public MainCategoryResponse createCategory(MainCategoryRequest request, UUID adminId) {
        String slug = SlugUtil.generateUniqueSlug(
            request.getName(),
            mainCategoryRepository::existsBySlugAndDeletedAtIsNull
        );

        MainCategory category = MainCategory.builder()
            .name(request.getName())
            .slug(slug)
            .image(request.getImage())
            .icon(request.getIcon())
            .bannerDesktop(request.getBannerDesktop())
            .bannerMobile(request.getBannerMobile())
            .metaTitle(request.getMetaTitle())
            .metaDescription(request.getMetaDescription())
            .sortOrder(request.getSortOrder())
            .status(request.getStatus())
            .createdBy(adminId)
            .updatedBy(adminId)
            .build();

        MainCategory saved = mainCategoryRepository.save(category);
        log.info("Main category created: {} by admin: {}", saved.getName(), adminId);
        return toResponse(saved);
    }

    @Transactional
    public MainCategoryResponse updateCategory(UUID id, MainCategoryRequest request, UUID adminId) {
        MainCategory category = findByIdOrThrow(id);

        // Regenerate slug only if name changed
        if (!category.getName().equals(request.getName())) {
            String newSlug = SlugUtil.generateUniqueSlug(
                request.getName(),
                s -> mainCategoryRepository.existsBySlugAndDeletedAtIsNull(s) &&
                     !s.equals(category.getSlug())
            );
            category.setSlug(newSlug);
        }

        category.setName(request.getName());
        category.setImage(request.getImage());
        category.setIcon(request.getIcon());
        category.setBannerDesktop(request.getBannerDesktop());
        category.setBannerMobile(request.getBannerMobile());
        category.setMetaTitle(request.getMetaTitle());
        category.setMetaDescription(request.getMetaDescription());
        category.setSortOrder(request.getSortOrder());
        category.setStatus(request.getStatus());
        category.setUpdatedBy(adminId);

        MainCategory saved = mainCategoryRepository.save(category);
        log.info("Main category updated: {} by admin: {}", saved.getName(), adminId);
        return toResponse(saved);
    }

    @Transactional
    public void updateStatus(UUID id, String status, UUID adminId) {
        MainCategory category = findByIdOrThrow(id);
        category.setStatus(status);
        category.setUpdatedBy(adminId);
        mainCategoryRepository.save(category);
        log.info("Main category status updated to {} for: {}", status, id);
    }

    @Transactional
    public void deleteCategory(UUID id, UUID adminId) {
        MainCategory category = findByIdOrThrow(id);
        category.setDeletedAt(LocalDateTime.now());
        category.setUpdatedBy(adminId);
        mainCategoryRepository.save(category);
        log.info("Main category soft deleted: {} by admin: {}", id, adminId);
    }

    @Transactional(readOnly = true)
    public List<MainCategoryResponse> getAllActiveCategories() {
        return mainCategoryRepository.findAllActiveOrderBySortOrder()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MainCategory> getAllForExport() {
        return mainCategoryRepository.findAllByDeletedAtIsNullOrderBySortOrderAsc();
    }

    private MainCategory findByIdOrThrow(UUID id) {
        return mainCategoryRepository.findById(id)
            .filter(c -> c.getDeletedAt() == null)
            .orElseThrow(() -> new ResourceNotFoundException("Main Category", "id", id));
    }

    private MainCategoryResponse toResponse(MainCategory category) {
        long subCount = subCategoryRepository.countByMainCategory_IdAndDeletedAtIsNull(category.getId());
        return MainCategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .image(category.getImage())
            .icon(category.getIcon())
            .bannerDesktop(category.getBannerDesktop())
            .bannerMobile(category.getBannerMobile())
            .metaTitle(category.getMetaTitle())
            .metaDescription(category.getMetaDescription())
            .sortOrder(category.getSortOrder())
            .status(category.getStatus())
            .subCategoryCount(subCount)
            .createdAt(category.getCreatedAt())
            .updatedAt(category.getUpdatedAt())
            .build();
    }
}
