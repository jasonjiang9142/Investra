package com.example.server;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
@Service
public class PriceProgressionController {

    private final RestTemplate restTemplate;
    private final CacheService cacheService;

    @Autowired
    public PriceProgressionController(RestTemplate restTemplate, CacheService cacheService) {
        this.restTemplate = restTemplate;
        this.cacheService = cacheService;
    }

    public Map<String, Object> fetchDailyApi(String symbol) {
        Map<String, Object> cachedData = cacheService.getCache(symbol);
        if (cachedData != null) {
            System.out.println("Using cached data for " + symbol);
            return cachedData; // Return cached data if available
        }

        int maxRetries = 3;
        int attempts = 0;

        while (attempts < maxRetries) {
            try {
                System.out.println("Attempt #" + (attempts + 1) + " to fetch Daily API");

                Dotenv dotenv = Dotenv.load();
                String alpha_advantage_key = dotenv.get("alpha_advantage_key");
                if (alpha_advantage_key == null) {
                    throw new IllegalStateException("API key is missing in environment variables.");
                }

                String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
                        symbol + "&outputsize=full&apikey=" + alpha_advantage_key;

                // String url =
                // "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo";

                // RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> result = restTemplate.getForObject(url, Map.class);

                cacheService.updateCache(symbol, result);

                System.out.println("Finished fetching api call for " + (attempts + 1));

                return result;

            } catch (Exception e) {
                attempts++;
                if (attempts >= maxRetries) {
                    e.printStackTrace(); // Log final error
                    return Collections.singletonMap("error", "Failed to fetch data: " + e.getMessage());
                }
            }
        }

        return Collections.singletonMap("error", "Unexpected error occurred.");
    }

    public String[] getPrice(String symbol, String date) {
        try {
            // Fetch data
            Map<String, Object> response = fetchDailyApi(symbol);
            Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (Daily)");

            // Use latest date if input date is null
            if (date == null) {
                date = (String) timeSeries.keySet().toArray()[0]; // Get the latest date

            } else if (!timeSeries.containsKey(date)) { // Find closest date if specified date not available
                TreeMap<String, Object> sortedTimeSeries = new TreeMap<>(timeSeries);
                date = sortedTimeSeries.floorKey(date); // Try to find the closest date before
                if (date == null) {
                    date = sortedTimeSeries.ceilingKey(date); // Try to find the closest date after
                }
            }

            // Extract price for the date
            Map<String, Object> dayData = (Map<String, Object>) timeSeries.get(date);
            String price = (String) dayData.get("4. close");

            return new String[] { price, date };

        } catch (Exception e) {
            e.printStackTrace();
            return new String[] { "Failed to fetch data: " + e.getMessage() };
        }
    }

    // api to get the price now given that specific date. Input the specific date
    // and the money invested into that date
    @GetMapping("/api/pricenow")
    public ResponseEntity<Map<String, Object>> getPriceNow(
            @RequestParam String symbol, // Extract 'symbol' from query params
            @RequestParam String date, // Extract 'input_date' from query params
            @RequestParam double amount // Extract 'amountInvested' from query params

    ) {
        try {

            String[] datedArray = getPrice(symbol, date);
            String[] currentArray = getPrice(symbol, null);

            System.out.println("datedArray: " + datedArray[0]);
            System.out.println("currentArray: " + currentArray[0]);

            // Parse the price strings into doubles for further calculation (if needed)
            double previousPriceValue = Double.parseDouble(datedArray[0]);
            double currentPriceValue = Double.parseDouble(currentArray[0]);

            System.out.println("here");

            String previousDate = datedArray[1];
            String currentDate = currentArray[1];

            // Calculate the return on investment based on the prices
            double returnOnInvestment = (currentPriceValue - previousPriceValue)
                    * (amount / previousPriceValue);

            System.out.println("returnOnInvestment: " + returnOnInvestment);
            System.out.println("previousPriceValue: " + previousPriceValue);
            System.out.println("currentPriceValue: " + currentPriceValue);
            System.out.println("previousDate: " + previousDate);
            System.out.println("currentDate: " + currentDate);

            return ResponseEntity.ok(Map.of(
                    "returnOnInvestment", returnOnInvestment,
                    "previousPrice", previousPriceValue,
                    "currentPrice", currentPriceValue,
                    "previousDate", previousDate,
                    "currentDate", currentDate));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private boolean isWithinDateRange(String date, String startDate, String endDate) {
        try {
            LocalDate currentDate = LocalDate.parse(date);
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            return !currentDate.isBefore(start) && !currentDate.isAfter(end);
        } catch (DateTimeParseException e) {
            e.printStackTrace();
            return false;
        }
    }

    // api to get 2 list of the progression of prices over the years
    @GetMapping("/api/priceprogression")
    public ResponseEntity<Map<String, Object>> getPriceProgression(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam double amountInvested,
            @RequestParam String symbol) {
        try {

            List<String> dates = new ArrayList<>();
            List<Double> rois = new ArrayList<>();

            Map<String, Object> response = fetchDailyApi(symbol);

            Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (Daily)");

            // Get the start price for the start date
            Double startPrice = Double.parseDouble(getPrice(symbol, startDate)[0]);
            Double numStock = amountInvested / startPrice; // Number of shares purchased with the invested amount

            // Iterate through the time series and calculate ROI for each date
            for (Map.Entry<String, Object> entry : timeSeries.entrySet()) {
                String date = entry.getKey();

                // Check if the date is within the desired range
                if (isWithinDateRange(date, startDate, endDate)) {
                    Map<String, Object> priceData = (Map<String, Object>) entry.getValue();
                    String closePrice = (String) priceData.get("4. close");

                    // Calculate the return on investment based on the current closing price
                    double returnOnInvestment = (Double.parseDouble(closePrice) - startPrice) * numStock;

                    // Add the date and the calculated ROI to the lists
                    dates.add(date);
                    rois.add(returnOnInvestment);

                }
            }
            // Create a response map containing dates and calculated ROIs

            Map<String, Object> result = new HashMap<>();
            result.put("dates", dates);
            result.put("rois", rois);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();

            // Create error response with 500 status
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch data: " + e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

}
