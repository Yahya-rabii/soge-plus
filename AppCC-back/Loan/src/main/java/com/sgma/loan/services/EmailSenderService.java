package com.sgma.loan.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
@Service
public class EmailSenderService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    public static Logger logger = LoggerFactory.getLogger(EmailSenderService.class);
    public static final String IMAGE_TYPE = "image/png";
    @Autowired
    public EmailSenderService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    public void sendEmailWithHtmlTemplate(String to, String subject, String templateName, Context context) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);
            // Load image from resources/static directory
            ClassPathResource LogoImageResource = new ClassPathResource("static/logo.png");
            ClassPathResource bgImageResource = new ClassPathResource("static/bg.png");
            ClassPathResource SignatureImageResource = new ClassPathResource("static/signature.png");
            ClassPathResource card1Resource = new ClassPathResource("static/card1.png");
            ClassPathResource card2Resource = new ClassPathResource("static/card2.png");
            ClassPathResource card3Resource = new ClassPathResource("static/card3.png");
            ClassPathResource instagramResource = new ClassPathResource("static/instagram.png");
            ClassPathResource linkedinResource = new ClassPathResource("static/linkedin.png");
            ClassPathResource twitterResource = new ClassPathResource("static/twitter.png");
            ClassPathResource webResource = new ClassPathResource("static/web.png");
            byte[] logoBytes = Files.readAllBytes(LogoImageResource.getFile().toPath());
            byte[] bgImageBytes = Files.readAllBytes(bgImageResource.getFile().toPath());
            byte[] signatureBytes = Files.readAllBytes(SignatureImageResource.getFile().toPath());
            byte[] card1Bytes = Files.readAllBytes(card1Resource.getFile().toPath());
            byte[] card2Bytes = Files.readAllBytes(card2Resource.getFile().toPath());
            byte[] card3Bytes = Files.readAllBytes(card3Resource.getFile().toPath());
            byte[] instagramBytes = Files.readAllBytes(instagramResource.getFile().toPath());
            byte[] linkedinBytes = Files.readAllBytes(linkedinResource.getFile().toPath());
            byte[] twitterBytes = Files.readAllBytes(twitterResource.getFile().toPath());
            byte[] webBytes = Files.readAllBytes(webResource.getFile().toPath());
            // Convert image to Base64
            String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
            String bgImageBase64 = Base64.getEncoder().encodeToString(bgImageBytes);
            String signatureBase64 = Base64.getEncoder().encodeToString(signatureBytes);
            String card1Base64 = Base64.getEncoder().encodeToString(card1Bytes);
            String card2Base64 = Base64.getEncoder().encodeToString(card2Bytes);
            String card3Base64 = Base64.getEncoder().encodeToString(card3Bytes);
            String instagramBase64 = Base64.getEncoder().encodeToString(instagramBytes);
            String linkedinBase64 = Base64.getEncoder().encodeToString(linkedinBytes);
            String twitterBase64 = Base64.getEncoder().encodeToString(twitterBytes);
            String webBase64 = Base64.getEncoder().encodeToString(webBytes);
            // Clean up base64 string
            String cleanLogoBase64 = logoBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanbgImageBase64 = bgImageBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanSignatureBase64 = signatureBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanCard1Base64 = card1Base64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanCard2Base64 = card2Base64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanCard3Base64 = card3Base64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanInstagramBase64 = instagramBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanLinkedinBase64 = linkedinBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanTwitterBase64 = twitterBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanWebBase64 = webBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            // Add the image as an attachment
            helper.addInline("logo", new ByteArrayResource(Base64.getDecoder().decode(cleanLogoBase64)), IMAGE_TYPE);
            helper.addInline("bgImage", new ByteArrayResource(Base64.getDecoder().decode(cleanbgImageBase64)), IMAGE_TYPE);
            helper.addInline("signature", new ByteArrayResource(Base64.getDecoder().decode(cleanSignatureBase64)), IMAGE_TYPE);
            helper.addInline("card1", new ByteArrayResource(Base64.getDecoder().decode(cleanCard1Base64)), IMAGE_TYPE);
            helper.addInline("card2", new ByteArrayResource(Base64.getDecoder().decode(cleanCard2Base64)), IMAGE_TYPE);
            helper.addInline("card3", new ByteArrayResource(Base64.getDecoder().decode(cleanCard3Base64)), IMAGE_TYPE);
            helper.addInline("instagram", new ByteArrayResource(Base64.getDecoder().decode(cleanInstagramBase64)), IMAGE_TYPE);
            helper.addInline("linkedin", new ByteArrayResource(Base64.getDecoder().decode(cleanLinkedinBase64)), IMAGE_TYPE);
            helper.addInline("twitter", new ByteArrayResource(Base64.getDecoder().decode(cleanTwitterBase64)), IMAGE_TYPE);
            helper.addInline("web", new ByteArrayResource(Base64.getDecoder().decode(cleanWebBase64)), IMAGE_TYPE);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Error sending email with HTML template: {}", e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
