package com.thecandlelab.backend.service.impl;

import com.thecandlelab.backend.entity.Collection;
import com.thecandlelab.backend.repository.CollectionRepository;
import com.thecandlelab.backend.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;

    @Override
    public Page<Collection> getAllCollections(String search, Pageable pageable) {
        return collectionRepository.findAll(pageable);
    }

    @Override
    public List<Collection> getActiveCollections() {
        return collectionRepository.findByDeletedAtIsNull();
    }

    @Override
    public Collection getCollectionById(UUID id) {
        return collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + id));
    }

    @Override
    @Transactional
    public Collection createCollection(Collection collection) {
        if (collection.getSlug() == null || collection.getSlug().isEmpty()) {
            collection.setSlug(collection.getName().toLowerCase().replace(" ", "-"));
        }
        return collectionRepository.save(collection);
    }

    @Override
    @Transactional
    public Collection updateCollection(UUID id, Collection updated) {
        Collection existing = getCollectionById(id);
        existing.setName(updated.getName());
        existing.setSlug(updated.getSlug());
        existing.setDescription(updated.getDescription());
        existing.setImage(updated.getImage());
        existing.setSortOrder(updated.getSortOrder());
        existing.setStatus(updated.getStatus());
        return collectionRepository.save(existing);
    }

    @Override
    @Transactional
    public void updateStatus(UUID id, String status) {
        Collection existing = getCollectionById(id);
        existing.setStatus(status);
        collectionRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteCollection(UUID id) {
        Collection existing = getCollectionById(id);
        existing.setDeletedAt(LocalDateTime.now());
        existing.setStatus("INACTIVE");
        collectionRepository.save(existing);
    }
}
