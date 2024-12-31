package com.example.server;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@RestController
@CrossOrigin(origins = "*")
public class Controller {

    @Cacheable(value = "dailyApi", key = "#symbol", unless = "#result == null or !#result.containsKey('Meta Data')")
    public Map<String, Object> fetchDailyApi(String symbol) {
        try {
            Dotenv dotenv = Dotenv.load();
            String alpha_advantage_key = dotenv.get("alpha_advantage_key");

            // String url =
            // "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
            // symbol + "&outputsize=full&apikey=" + alpha_advantage_key;
            System.out.println(symbol);
            String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo";

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            System.out.println("after");

            return result;
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error stack trace
            return Collections.singletonMap("error", "Failed to fetch data: " + e.getMessage());
        }
    }

    // api to get the current price
    @GetMapping("/api/currentprice")
    private String[] getCurrentPrice(String symbol) {
        try {
            String[] result_array = new String[2];

            Map<String, Object> response = fetchDailyApi(symbol);

            // get the price of the current day
            Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (Daily)");
            String date = (String) timeSeries.keySet().toArray()[0];
            System.out.println("current Day " + date);

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
    @GetMapping("/api/datedprice")
    private String[] getDatedPrice(String symbol, String date) {
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

            // String symbol = "IBM";
            // String input_date = "1990-03-06";
            // double amountInvested = 1000.0;

            System.out.println(symbol);

            String[] datedArray = getDatedPrice(symbol, date);
            String[] currentArray = getCurrentPrice(symbol);

            // Parse the price strings into doubles for further calculation (if needed)
            double previousPriceValue = Double.parseDouble(datedArray[0]);
            double currentPriceValue = Double.parseDouble(currentArray[0]);

            String previousDate = datedArray[1];
            String currentDate = currentArray[1];

            System.out.println("Previous price: " + previousPriceValue + " on " + previousDate);
            System.out.println("Current price: " + currentPriceValue + " on " + currentDate);

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
            // String startDate = "1999-11-01";
            // String endDate = "2024-12-27";
            // double amountInvested = 1000.0;
            // String symbol = "IBM";

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
            System.out.println("dates: " + dates);
            System.out.println("rois: " + rois);

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

    // ----------------- API to get company information-----------------

    // api to get most recent news about the company
    @GetMapping("/api/info/news")
    public ResponseEntity<?> getNews(
            @RequestParam String symbol) {
        try {
            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Get the current date and 3 months ago date
            LocalDate currentDate = LocalDate.now();
            LocalDate oneWeekAgo = currentDate.minusWeeks(2);

            // Format the dates to the required format (yyyy-MM-dd)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String fromDate = oneWeekAgo.format(formatter);
            String toDate = currentDate.format(formatter);

            System.out.println(finnhub_token);

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/company-news?symbol=" + symbol
                    + "&from=" + fromDate + "&to=" + toDate + "&token=" + finnhub_token;

            System.out.println(url);

            // Create RestTemplate instance to make the API request

            RestTemplate restTemplate = new RestTemplate();
            List<Map<String, Object>> newsData = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    }).getBody();

            return ResponseEntity.ok(newsData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

    // api to get company profile
    @GetMapping("/api/info/profile")
    private ResponseEntity<?> getProfile(
            @RequestParam String symbol) {
        try {
            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + symbol + "&token=" + finnhub_token;

            System.out.println(url);

            // Create RestTemplate instance to make the API request
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> profileData = restTemplate.getForObject(url, Map.class);

            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

    // api to get company metrics
    @GetMapping("/api/info/metrics")
    private ResponseEntity<?> getMetrics(
            @RequestParam String symbol) {
        try {
            Dotenv dotenv = Dotenv.load();
            String finnhub_token = dotenv.get("finnhub_token");

            // Build the URL dynamically with the from and to dates
            String url = "https://finnhub.io/api/v1/stock/metric?symbol=" + symbol + "&metric=all&token="
                    + finnhub_token;

            System.out.println(url);

            // Create RestTemplate instance to make the API request
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> metricsData = restTemplate.getForObject(url, Map.class);

            return ResponseEntity.ok(metricsData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }

}
