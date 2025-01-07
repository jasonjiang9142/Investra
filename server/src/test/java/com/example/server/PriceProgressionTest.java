package com.example.server;

import org.junit.jupiter.api.Test;

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
import java.util.Collections;
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
public class PriceProgressionTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private PriceProgressionController PriceProgressionController;

    @Test
    void contextLoads() throws Exception {
        assertThat(PriceProgressionController).isNotNull();
    }

    @Test
    void testFetchDailyApi() {
        // Mock the Dotenv class
        Dotenv dotenv = mock(Dotenv.class);
        when(dotenv.get("alpha_advantage_key")).thenReturn("demo");

        // Mock the RestTemplate
        Map<String, Object> mockResponse = Map.ofEntries(
                Map.entry("Meta Data", Map.of(
                        "1. Information", "Daily Prices (open, high, low, close) and Volumes",
                        "2. Symbol", "IBM",
                        "3. Last Refreshed", "2025-01-03",
                        "4. Output Size", "Full size",
                        "5. Time Zone", "US/Eastern")),
                Map.entry("Time Series (Daily)", Map.of(
                        "2025-01-03", Map.of(
                                "1. open", "220.5500",
                                "2. high", "223.6600",
                                "3. low", "220.5500",
                                "4. close", "222.6500",
                                "5. volume", "3873578"),
                        "2025-01-02", Map.of(
                                "1. open", "221.8200",
                                "2. high", "222.4900",
                                "3. low", "217.6000",
                                "4. close", "219.9400",
                                "5. volume", "2579498"))));

        // String url =
        // "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
        // symbol + "&outputsize=full&apikey=" + alpha_advantage_key;

        String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo";

        when(restTemplate.getForObject(eq(
                url),
                eq(Map.class)))
                .thenReturn(mockResponse);

        // Create the controller and inject the mocked RestTemplate
        PriceProgressionController priceProgressionController = new PriceProgressionController(restTemplate);

        Map<String, Object> result = priceProgressionController.fetchDailyApi("IBM");

        // Assertions
        assertThat(result).isNotNull();
        assertThat(result).containsKey("Meta Data");
        assertThat(result).containsKey("Time Series (Daily)");

        Map<String, Object> metaData = (Map<String, Object>) result.get("Meta Data");
        assertThat(metaData.get("2. Symbol")).isEqualTo("IBM");

        Map<String, Object> timeSeries = (Map<String, Object>) result.get("Time Series (Daily)");
        assertThat(timeSeries).containsKey("2025-01-03");

        Map<String, String> dailyData = (Map<String, String>) timeSeries.get("2025-01-03");
        assertThat(dailyData.get("1. open")).isEqualTo("220.5500");
        assertThat(dailyData.get("4. close")).isEqualTo("222.6500");

        verify(restTemplate, times(1)).getForObject(eq(
                "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo"),
                eq(Map.class));
    }
