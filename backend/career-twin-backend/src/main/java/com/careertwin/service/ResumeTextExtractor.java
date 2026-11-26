
package com.careertwin.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

@Service
public class ResumeTextExtractor {

    public String extractText(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is empty");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = fileName.substring(
                fileName.lastIndexOf('.') + 1
        ).toLowerCase(Locale.ROOT);

        String extractedText;

        if (extension.equals("pdf")) {
            extractedText = extractPdf(file);

        } else if (extension.equals("docx")) {
            extractedText = extractDocx(file);

        } else {
            throw new IllegalArgumentException(
                    "Only PDF and DOCX files are supported"
            );
        }

        if (extractedText == null || extractedText.isBlank()) {
            throw new IllegalArgumentException(
                    "No readable text found in the resume"
            );
        }

        return extractedText.trim();
    }

    private String extractPdf(MultipartFile file) throws IOException {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
    }

    private String extractDocx(MultipartFile file) throws IOException {

        try (InputStream inputStream = file.getInputStream();
             XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor =
                     new XWPFWordExtractor(document)) {

            return extractor.getText();
        }
    }
}
