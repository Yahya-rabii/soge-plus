package com.sgma.contract.services;

import org.xhtmlrenderer.pdf.ITextRenderer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@Service
public class ContractCreatorService {

    private final TemplateEngine templateEngine;

    public ContractCreatorService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] createContractPdfWithHtmlTemplate(Context context , String signatureFile) throws IOException {
        String htmlContent = templateEngine.process("contract-template.html", context);

        // Log generated HTML content for debugging
        System.out.println("Generated HTML Content: " + htmlContent);

        // Prepare image resources
        ClassPathResource logoImageResource = new ClassPathResource("static/sg-black.png");
        ClassPathResource stampImageResource = new ClassPathResource("static/stamp.png");


        String logoBase64 = resizeAndEncodeImageToBase64(logoImageResource, 150, 150);
        String stampBase64 = resizeAndEncodeImageToBase64(stampImageResource, 150, 150);


        // Replace placeholders with actual base64 image data
        htmlContent = htmlContent.replace("cid:logo", "data:image/png;base64," + logoBase64);
        htmlContent = htmlContent.replace("cid:stamp", "data:image/png;base64," + stampBase64);
        htmlContent = htmlContent.replace("cid:signature", "data:image/png;base64," + signatureFile);

        // Create PDF from HTML
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to convert HTML to PDF", e);
        }

        return outputStream.toByteArray();
    }

    private String resizeAndEncodeImageToBase64(ClassPathResource resource, int maxWidth, int maxHeight) throws IOException {
        BufferedImage originalImage = ImageIO.read(resource.getFile());

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Calculate the scaling factor to fit the image within the max width and height
        double widthRatio = (double) maxWidth / originalWidth;
        double heightRatio = (double) maxHeight / originalHeight;
        double ratio = Math.min(widthRatio, heightRatio);

        // Calculate new dimensions
        int newWidth = (int) (originalWidth * ratio);
        int newHeight = (int) (originalHeight * ratio);

        // Resize the image
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g.dispose();

        // Convert to Base64
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
