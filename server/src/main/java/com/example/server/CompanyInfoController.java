package com.example.server;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.stereotype.Service;

@RestController
@CrossOrigin(origins = "*")
@Service
public class CompanyInfoController {
    private final RestTemplate restTemplate;

    // Constructor to inject RestTemplate (for testing purposes)
    public CompanyInfoController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> fetchNewsAPI(String symbol, String toDate, String fromDate) {
        try {

            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/company-news?symbol=" + symbol
                    + "&from=" + fromDate + "&to=" + toDate + "&token=" + finnhub_token;

            // Create RestTemplate instance to make the API request
            List<Map<String, Object>> newsData = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    }).getBody();

            return newsData;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // api to get most recent news about the company
    @GetMapping("/api/info/news")
    public ResponseEntity<?> getNews(
            @RequestParam String symbol) {
        try {
            LocalDate currentDate = LocalDate.now();
            LocalDate oneWeekAgo = currentDate.minusWeeks(2);

            // Format the dates to the required format (yyyy-MM-dd)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String fromDate = oneWeekAgo.format(formatter);
            String toDate = currentDate.format(formatter);

            List<Map<String, Object>> newsData2 = fetchNewsAPI(symbol, toDate, fromDate);

            return ResponseEntity.ok(newsData2);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

    public Map<String, Object> fetchProfileAPI(String symbol) {
        try {

            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol + "&token=" + finnhub_token;

            // Create RestTemplate instance to make the API request
            Map<String, Object> profileData = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();

            return profileData;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // api to get company profile
    @GetMapping("/api/info/profile")
    private ResponseEntity<?> getProfile(
            @RequestParam String symbol) {
        try {
            Map<String, Object> profileData = fetchProfileAPI(symbol);

            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

    public Map<String, Object> fetchMetricsAPI(String symbol) {
        try {

            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/stock/metric?symbol=" + symbol + "&metric=all&token="
                    + finnhub_token;

            // Create RestTemplate instance to make the API request
            Map<String, Object> metricsData = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();

            return metricsData;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // api to get company metrics
    @GetMapping("/api/info/metrics")
    private ResponseEntity<?> getMetrics(
            @RequestParam String symbol) {
        try {
            // Dotenv dotenv = Dotenv.load();
            // String finnhub_token = dotenv.get("finnhub_token");

            // // Build the URL dynamically with the from and to dates
            // String url = "https://finnhub.io/api/v1/stock/metric?symbol=" + symbol +
            // "&metric=all&token="
            // + finnhub_token;

            // // Create RestTemplate instance to make the API request
            // RestTemplate restTemplate = new RestTemplate();
            // Map<String, Object> metricsData = restTemplate.getForObject(url, Map.class);

            Map<String, Object> metricsData = fetchMetricsAPI(symbol);

            return ResponseEntity.ok(metricsData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }
}
