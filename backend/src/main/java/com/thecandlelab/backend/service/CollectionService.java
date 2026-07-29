package com.thecandlelab.backend.service;

import com.thecandlelab.backend.entity.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CollectionService {
    Page<Collection> getAllCollections(String search, Pageable pageable);
    List<Collection> getActiveCollections();
    Collection getCollectionById(UUID id);
    Collection createCollection(Collection collection);
    Collection updateCollection(UUID id, Collection collection);
    void updateStatus(UUID id, String status);
    void deleteCollection(UUID id);
}
