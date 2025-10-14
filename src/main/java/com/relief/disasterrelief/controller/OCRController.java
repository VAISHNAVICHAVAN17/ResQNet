package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.service.AadhaarOcrParser;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
public class OCRController {

    private final Tesseract tesseract;

    public OCRController() {
        this.tesseract = new Tesseract();
        tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
        tesseract.setLanguage("eng");
    }

    @PostMapping("/extract")
    public Map<String, String> extractDataFromImage(@RequestParam("file") MultipartFile file) throws IOException, TesseractException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new RuntimeException("Unsupported image format or invalid image");
        }
        BufferedImage img = new BufferedImage(originalImage.getWidth(), originalImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = img.createGraphics();
        g2d.drawImage(originalImage, 0, 0, null);
        g2d.dispose();

        String textResult = tesseract.doOCR(img);
        System.out.println("OCR Result:\n" + textResult);

        Map<String, String> fields = AadhaarOcrParser.parseFields(textResult);

        Map<String, String> response = new HashMap<>();
        response.putAll(fields);
        response.put("text", textResult);
        return response;
    }
}
