package com.example.server;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.cache.annotation.Cacheable;
import java.text.SimpleDateFormat;
import java.text.ParseException;

@RestController
public class Controller {
    Dotenv dotenv = Dotenv.load();
    String alpha_advantage_key = dotenv.get("alpha_advantage_key");

    @Cacheable(value = "dailyApi", key = "#symbol", unless = "#result == null or !#result.containsKey('Meta Data')")
    public Map<String, Object> fetchDailyApi(String symbol) {
        try {
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
    private String getPriceNow() {
        try {
            String symbol = "IBM";
            String input_date = "1990-03-06";
            double amountInvested = 1000.0;

            String[] datedArray = getDatedPrice(symbol, input_date);
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
                    * (amountInvested / previousPriceValue);

            return "The return on investment is: " + returnOnInvestment;
        } catch (Exception e) {
            return "Failed to fetch data: " + e.getMessage();
        }
    }

    // Helper method to check if a date is within the specified range
    private boolean isWithinDateRange(String date, String startDate, String endDate) {
        try {
            // Convert the string dates into Date objects for comparison
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date currentDate = sdf.parse(date);
            Date start = sdf.parse(startDate);
            Date end = sdf.parse(endDate);

            // Return true if the current date is within the range
            return !currentDate.before(start) && !currentDate.after(end);
        } catch (ParseException e) {
            e.printStackTrace();
            return false;
        }
    }

    // api to get 2 list of the progression of prices over the years
    @GetMapping("/api/priceprogression")
    private Map<String, Object> getPriceProgression() {
        try {
            String startDate = "1999-11-01";
            String endDate = "2024-12-27";
            double amountInvested = 1000.0;
            String symbol = "IBM";

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
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("dates", dates);
            responseMap.put("rois", rois);

            return responseMap;

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch data: " + e.getMessage());
            return errorResponse;
        }
    }

}
