package com.example.server;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;
import io.github.cdimascio.dotenv.Dotenv;

@RestController
public class Controller {
    Dotenv dotenv = Dotenv.load();
    String alpha_advantage_key = dotenv.get("alpha_advantage_key");

    private Map<String, Object> fetchDailyApi(String symbol) {
        try {
            String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol
                    + "&outputsize=full&apikey=" +
                    alpha_advantage_key;
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);

            return result;
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error stack trace
            return Collections.singletonMap("error", "Failed to fetch data: " + e.getMessage());
        }
    }

    @GetMapping("/api")
    public String index() {
        System.out.println(alpha_advantage_key);
        return "Greetings from Spring Boot! hello asdsaasda";
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
            String symbol = "NVDA";
            String date = "1990-03-06";
            double amountInvested = 1000.0;

            String[] datedPrice = getDatedPrice(symbol, date);
            String[] currentPrice = getCurrentPrice(symbol);

            // Parse the price strings into doubles for further calculation (if needed)
            double datedPriceValue = Double.parseDouble(datedPrice[0]); // Assuming

            double currentPriceValue = Double.parseDouble(currentPrice[0]); // Assuming

            // Calculate the return on investment based on the prices
            double returnOnInvestment = (currentPriceValue - datedPriceValue) * (amountInvested / datedPriceValue);

            return "The return on investment is: " + returnOnInvestment;
        } catch (Exception e) {
            return "Failed to fetch data: " + e.getMessage();
        }
    }

}
