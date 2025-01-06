package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CacheController {

    @Autowired
    private CacheManager cacheManager;

    @GetMapping("/cache/view")
    public Map<Object, Object> viewCache() {
        Cache cache = cacheManager.getCache("dailyApi"); // Replace with your cache name
        if (cache != null) {
            Map<Object, Object> cacheContents = new HashMap<>();
            CaffeineCache caffeineCache = (CaffeineCache) cache;

            // Get the native Caffeine cache and map it
            caffeineCache.getNativeCache().asMap().forEach(cacheContents::put);

            return cacheContents;
        }
        return Map.of("error", "Cache not found");
    }
}
