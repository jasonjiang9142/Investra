package com.example.server;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CacheService {

    private Map<String, Object> cache = new HashMap<>();

    public Map<String, Object> getCache(String symbol) {
        return (Map<String, Object>) cache.get(symbol);
    }

    public void updateCache(String symbol, Map<String, Object> data) {
        cache.put(symbol, data);
    }

    // Scheduled task to clear the cache every day at midnight
    @Scheduled(cron = "0 0 0 * * *") // Runs at midnight every day
    public void clearCache() {
        cache.clear();
        System.out.println("Cache cleared at midnight.");
    }
}