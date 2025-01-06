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

import java.util.List;
import java.util.Map;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

        System.out.println("Expected URL: " + url);

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

}
