package com.relief.disasterrelief.service;

import java.util.*;
import java.util.regex.*;

public class AadhaarOcrParser {

    public static Map<String, String> parseFields(String ocrText) {
        Map<String, String> fields = new HashMap<>();

        String[] lines = ocrText.split("\\r?\\n");
        List<String> cleanedLines = new ArrayList<>();
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty()) cleanedLines.add(line);
        }
        lines = cleanedLines.toArray(new String[0]);

        // Aadhaar number: 12 digits precisely
        for (String line : lines) {
            String digitsOnly = line.replaceAll("[^0-9]", "");
            if (digitsOnly.length() == 12) {
                fields.put("aadhaarNumber", digitsOnly);
                break;
            }
        }

        // Date of Birth with pattern DD/MM/YYYY
        Pattern dobPattern = Pattern.compile("\\b\\d{2}/\\d{2}/\\d{4}\\b");
        Matcher dobMatcher = dobPattern.matcher(ocrText);
        if (dobMatcher.find()) {
            fields.put("dob", dobMatcher.group());
        }

        // Extract name: Look for a valid name line after line 10
        String name = "";
        for (int i = 10; i < Math.min(lines.length, 15); i++) {
            String line = lines[i].replaceAll("[^a-zA-Z ]", "").trim();
            if (line.split(" ").length >= 2 && line.length() > 3) {
                name = line;
                break;
            }
        }
        if (!name.isEmpty()) {
            fields.put("name", name);
        }

        // Fallback: if name not found above, use previous logic
        if (!fields.containsKey("name")) {
            for (int i = 0; i < lines.length; i++) {
                if (lines[i].contains("D/O:") || lines[i].contains("S/O:")) {
                    if (i > 0) {
                        String candidate = lines[i - 1].replaceAll("[^a-zA-Z ]", "").trim();
                        if (candidate.split(" ").length >= 2) {
                            fields.put("name", candidate);
                            break;
                        }
                    }
                }
            }
        }

        // Extract address: Start from line after name, go until pincode or Maharashtra
        if (fields.containsKey("name")) {
            StringBuilder addressBuilder = new StringBuilder();
            boolean capture = false;
            for (String line : lines) {
                if (line.contains(fields.get("name"))) {
                    capture = true;
                    continue;
                }
                if (capture) {
                    if (line.matches(".*\\d{6}.*") || line.toLowerCase().contains("maharashtra")) {
                        addressBuilder.append(line.trim());
                        break;
                    }
                    addressBuilder.append(line.trim()).append(", ");
                }
            }
            if (addressBuilder.length() > 0) {
                fields.put("address", addressBuilder.toString().replaceAll(", $", ""));
            }
        }

        // Organization name for NGO
        for (String line : lines) {
            if (line.toLowerCase().contains("organization") || line.toLowerCase().contains("ngo")) {
                fields.put("orgName", line.replaceAll("[^a-zA-Z0-9 .]", "").trim());
                break;
            }
        }

        // Final cleanup
        fields.replaceAll((k, v) -> v.replaceAll("^[^a-zA-Z0-9]+", "")
                                     .replaceAll("[^a-zA-Z0-9 ,.-]+$", "")
                                     .trim());

        return fields;
    }
}
