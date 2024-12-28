package com.example.server;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;

@RestController
public class Controller {

    @GetMapping("/api")
    public String index() {
        return "Greetings from Spring Boot! hello asdsaasda";
    }

    @GetMapping("/api/test")
    private Map<String, Object> testCall() {
        String url = "https://api.genderize.io?name=mary";
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> result = restTemplate.getForObject(url, Map.class);
        return result;
    }

}
