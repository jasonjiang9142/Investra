package com.example.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.AbstractMap.SimpleEntry;
import java.util.List;
import java.util.Map;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.web.client.RestTemplate;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class CompanyInfoTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private CompanyInfoController companyInfoController;

    @Test
    void contextLoads() throws Exception {
        assertThat(companyInfoController).isNotNull();
    }

    @Test
    void testFetchNewsAPI() {

        // Mock the RestTemplate
        RestTemplate restTemplate = mock(RestTemplate.class);

        // Create the controller and inject the mocked RestTemplate
        CompanyInfoController companyInfoController = new CompanyInfoController(restTemplate);

        Dotenv dotenv = Dotenv.load();
        String finnhub_token = dotenv.get("finnhub_token");

        // Test data
        String symbol = "AAPL";
        String toDate = "2021-05-01";
        String fromDate = "2021-05-01";

        // Verify that the RestTemplate was called with the correct URL
        String url = "https://finnhub.io/api/v1/company-news?symbol=" + symbol
                + "&from=" + fromDate + "&to=" + toDate + "&token=" + finnhub_token;

        // Mock response
        List<Map<String, Object>> mockResponse = List.of(
                Map.of(
                        "category", "company",
                        "datetime", 1736165100,
                        "headline", "1 Wall Street Analyst Thinks Apple Is Going to $325. Is It a Buy Around $250?",
                        "id", 132285759,
                        "image", "https://g.foolcdn.com/editorial/images/802512/apple-60-1.jpg",
                        "related", "AAPL",
                        "source", "Yahoo",
                        "summary", "Apple (NASDAQ: AAPL) is back on top of the stock market...",
                        "url",
                        "https://finnhub.io/api/news?id=ae9782c872abaf47fa513ff9c2be5c18157fafca71f3660706b21c7dc44d8890"),
                Map.of(
                        "category", "company",
                        "datetime", 1736157315,
                        "headline", "The AI Bull Market Will Continue In 2025",
                        "id", 132286498,
                        "image",
                        "https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1455743464/image_1455743464.jpg?io=getty-c-w1536",
                        "related", "AAPL",
                        "source", "SeekingAlpha",
                        "summary", "AI and chip innovation create a virtuous cycle...",
                        "url",
                        "https://finnhub.io/api/news?id=35573cfe7fb223ebb0b4b4c7ebb0d784712a66b7dc11a7b67884d8935fd987b9"));

        // Mock behavior for RestTemplate
        when(restTemplate.exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class))).thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        // Mock the exchange method
        List<Map<String, Object>> result = companyInfoController.fetchNewsAPI(symbol, toDate, fromDate);
        System.out.println(result);

        // Assertions
        assertNotNull(result); // Result should not be null
        assertTrue(result.size() > 0, "Expected non-empty result");

        Map<String, Object> firstItem = result.get(0);
        assertThat(firstItem).isNotNull();
        assertThat(firstItem.get("category")).isEqualTo("company");
        assertThat(firstItem.get("headline"))
                .isEqualTo("1 Wall Street Analyst Thinks Apple Is Going to $325. Is It a Buy Around $250?");
        assertThat(firstItem.get("source")).isEqualTo("Yahoo");
        assertThat(firstItem.get("url")).asString().startsWith("https://finnhub.io/api/news");

        // Verify that RestTemplate was called once
        verify(restTemplate, times(1)).exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class));
    }

    @Test
    void testFetchProfileAPI() {
        // Mock the RestTemplate
        RestTemplate restTemplate = mock(RestTemplate.class);

        // Create the controller and inject the mocked RestTemplate
        CompanyInfoController companyInfoController = new CompanyInfoController(restTemplate);

        // Test data
        String symbol = "AAPL";

        // Mock the dotenv behavior (assuming dotenv.get() works fine here)
        Dotenv dotenv = Dotenv.load();
        String finnhub_token = dotenv.get("finnhub_token");

        // Build the expected URL dynamically
        String url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol +
                "&token=" + finnhub_token;

        // Mock response
        Map<String, Object> mockResponse = Map.ofEntries(
                new SimpleEntry<>("country", "US"),
                new SimpleEntry<>("currency", "USD"),
                new SimpleEntry<>("exchange", "NASDAQ"),
                new SimpleEntry<>("finnhubIndustry", "Technology"),
                new SimpleEntry<>("ipo", "1980-12-12"),
                new SimpleEntry<>("logo",
                        "https://static.finnhub.io/logo/2f4b36f8-7a0c-4d3f-8b3d-0b9b5b9b3b0d.png"),
                new SimpleEntry<>("marketCapitalization", 2000000000000.0),
                new SimpleEntry<>("name", "Apple Inc"),
                new SimpleEntry<>("phone", "14089961010"),
                new SimpleEntry<>("shareOutstanding", 10000000000.0),
                new SimpleEntry<>("ticker", "AAPL"),
                new SimpleEntry<>("weburl", "https://www.apple.com/"));

        // Mock behavior for RestTemplate
        when(restTemplate.exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        // Call the controller method
        Map<String, Object> result = companyInfoController.fetchProfileAPI(symbol);

        // Assertions
        assertThat(result).isNotNull();
        assertThat(result.get("country")).isEqualTo("US");
        assertThat(result.get("currency")).isEqualTo("USD");
        assertThat(result.get("exchange")).isEqualTo("NASDAQ");
        assertThat(result.get("finnhubIndustry")).isEqualTo("Technology");
        assertThat(result.get("ipo")).isEqualTo("1980-12-12");
        assertThat(result.get("logo"))
                .isEqualTo("https://static.finnhub.io/logo/2f4b36f8-7a0c-4d3f-8b3d-0b9b5b9b3b0d.png");
        assertThat(result.get("marketCapitalization")).isEqualTo(2000000000000.0);
        assertThat(result.get("name")).isEqualTo("Apple Inc");
        assertThat(result.get("phone")).isEqualTo("14089961010");
        assertThat(result.get("shareOutstanding")).isEqualTo(10000000000.0);
        assertThat(result.get("ticker")).isEqualTo("AAPL");
        assertThat(result.get("weburl")).isEqualTo("https://www.apple.com/");

        // Verify that the RestTemplate exchange method was called once with the correct
        // arguments
        verify(restTemplate, times(1)).exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class));

    }

    @Test
    void testFetchMetricsAPI() {
        // Mock the RestTemplate
        RestTemplate restTemplate = mock(RestTemplate.class);

        // Create the controller and inject the mocked RestTemplate
        CompanyInfoController companyInfoController = new CompanyInfoController(restTemplate);

        // Test data
        String symbol = "AAPL";

        // Mock the dotenv behavior (assuming dotenv.get() works fine here)
        Dotenv dotenv = Dotenv.load();
        String finnhub_token = dotenv.get("finnhub_token");

        // Build the expected URL dynamically
        String url = "https://finnhub.io/api/v1/stock/metric?symbol=" + symbol + "&metric=all&token="
                + finnhub_token;

        Map<String, Object> mockResponse = Map.ofEntries(
                new SimpleEntry<>("metrics", Map.of(
                        "10DayAverageTradingVolume", 2.20878,
                        "13WeekPriceReturnDaily", 1.3289,
                        "26WeekPriceReturnDaily", 27.1559,
                        "3MonthADReturnStd", 24.243816,
                        "3MonthAverageTradingVolume", 3.24114,
                        "52WeekHigh", 239.3,
                        "52WeekHighDate", "2024-12-09",
                        "52WeekLow", 157.885

                )));

        // Mock behavior for RestTemplate
        when(restTemplate.exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        // Call the controller method
        Map<String, Object> result = companyInfoController.fetchMetricsAPI(symbol);

        // Assertions
        assertThat(result).isNotNull();
        assertThat(result.get("metrics")).isNotNull();

        // Get metrics map
        Map<String, Object> metrics = (Map<String, Object>) result.get("metrics");

        // Assertions for specific metric values
        assertThat(metrics).containsKey("10DayAverageTradingVolume");
        assertThat(metrics.get("10DayAverageTradingVolume")).isEqualTo(2.20878);

        assertThat(metrics).containsKey("13WeekPriceReturnDaily");
        assertThat(metrics.get("13WeekPriceReturnDaily")).isEqualTo(1.3289);

        assertThat(metrics).containsKey("26WeekPriceReturnDaily");
        assertThat(metrics.get("26WeekPriceReturnDaily")).isEqualTo(27.1559);

        assertThat(metrics).containsKey("3MonthADReturnStd");
        assertThat(metrics.get("3MonthADReturnStd")).isEqualTo(24.243816);

        assertThat(metrics).containsKey("3MonthAverageTradingVolume");
        assertThat(metrics.get("3MonthAverageTradingVolume")).isEqualTo(3.24114);

        assertThat(metrics).containsKey("52WeekHigh");
        assertThat(metrics.get("52WeekHigh")).isEqualTo(239.3);

        assertThat(metrics).containsKey("52WeekHighDate");
        assertThat(metrics.get("52WeekHighDate")).isEqualTo("2024-12-09");

        assertThat(metrics).containsKey("52WeekLow");
        assertThat(metrics.get("52WeekLow")).isEqualTo(157.885);

        verify(restTemplate, times(1)).exchange(
                eq(url),
                eq(HttpMethod.GET),
                isNull(),
                any(ParameterizedTypeReference.class));

    }

}
