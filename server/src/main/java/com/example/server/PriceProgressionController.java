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

@RestController
@CrossOrigin(origins = "*")
@Service
public class PriceProgressionController {

    private final RestTemplate restTemplate;

    public PriceProgressionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> fetchDailyApi(String symbol) {
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

                // String url =
                // "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
                // symbol + "&outputsize=full&apikey=" + alpha_advantage_key;

                String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo";

                // RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> result = restTemplate.getForObject(url, Map.class);

                System.out.println("Finished fetching api call for " + (attempts + 1));
                System.out.println(result);

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

    // api to get the current price
    public String[] getCurrentPrice(String symbol) {
        try {
            String[] result_array = new String[2];

            Map<String, Object> response = fetchDailyApi(symbol);

            // get the price of the current day
            Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (Daily)");
            String date = (String) timeSeries.keySet().toArray()[0];

            Map<String, Object> currentDayData = (Map<String, Object>) timeSeries.get(date);
            String price = (String) currentDayData.get("4. close");

            result_array[0] = price;
            result_array[1] = date;

            return result_array;

        } catch (Exception e) {
            e.printStackTrace(); // Log the full error stack trace
            return new String[] { "Failed to fetch data: " + e.getMessage() };
        }
    }

    // api to get the price given the specified date
    public String[] getDatedPrice(String symbol, String date) {
        try {
            String[] result_array = new String[2];

            Map<String, Object> result = fetchDailyApi(symbol);

            // get the price of the current day
            Map<String, Object> timeSeries = (Map<String, Object>) result.get("Time Series (Daily)");

            // if the key is not in the map
            if (!timeSeries.containsKey(date)) {
                // get the date closest to the specified date first by flooring
                TreeMap<String, Object> sortedTimeSeries = new TreeMap<>(timeSeries);
                String newDate = sortedTimeSeries.floorKey(date);

                // if flooring doesn't work try ceiling it
                if (newDate == null) {
                    newDate = sortedTimeSeries.ceilingKey(date);
                }
                date = newDate;
            }

            Map<String, Object> currentDayData = (Map<String, Object>) timeSeries.get(date);
            String price = (String) currentDayData.get("4. close");

            result_array[0] = price;
            result_array[1] = date;

            return result_array;

        } catch (Exception e) {
            e.printStackTrace(); // Log the full error stack trace
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

            String[] datedArray = getDatedPrice(symbol, date);
            String[] currentArray = getCurrentPrice(symbol);

            // Parse the price strings into doubles for further calculation (if needed)
            double previousPriceValue = Double.parseDouble(datedArray[0]);
            double currentPriceValue = Double.parseDouble(currentArray[0]);

            String previousDate = datedArray[1];
            String currentDate = currentArray[1];

            // Calculate the return on investment based on the prices
            double returnOnInvestment = (currentPriceValue - previousPriceValue)
                    * (amount / previousPriceValue);

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
            Double startPrice = Double.parseDouble(getDatedPrice(symbol, startDate)[0]);
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
