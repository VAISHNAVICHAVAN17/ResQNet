package com.relief.disasterrelief.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {

    private final ITesseract tesseract;

    public OCRService() {
        tesseract = new Tesseract();
        // Path to tessdata folder, adjust if needed
        tesseract.setDatapath("src/main/resources/tessdata");
        // Set language to English, can add others if needed
        tesseract.setLanguage("eng");
    }

    public String extractText(File imageFile) throws TesseractException {
        return tesseract.doOCR(imageFile);
    }
}
