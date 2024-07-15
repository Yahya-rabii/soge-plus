package com.sgma.contract.services;

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
            ClassPathResource LogoSogeImageResource = new ClassPathResource("static/logoSoge.png");
            ClassPathResource bgImageResource = new ClassPathResource("static/bgLayers.png");
            ClassPathResource signature = new ClassPathResource("static/signature.png");
            ClassPathResource instagramResource = new ClassPathResource("static/instagram.png");
            ClassPathResource linkedinResource = new ClassPathResource("static/linkedin.png");
            ClassPathResource twitterResource = new ClassPathResource("static/twitter.png");
            ClassPathResource webResource = new ClassPathResource("static/web.png");
            byte[] logoBytes = Files.readAllBytes(LogoImageResource.getFile().toPath());
            byte[] logoSogeBytes = Files.readAllBytes(LogoSogeImageResource.getFile().toPath());
            byte[] bgImageBytes = Files.readAllBytes(bgImageResource.getFile().toPath());
            byte[] signatureBytes = Files.readAllBytes(signature.getFile().toPath());
            byte[] instagramBytes = Files.readAllBytes(instagramResource.getFile().toPath());
            byte[] linkedinBytes = Files.readAllBytes(linkedinResource.getFile().toPath());
            byte[] twitterBytes = Files.readAllBytes(twitterResource.getFile().toPath());
            byte[] webBytes = Files.readAllBytes(webResource.getFile().toPath());
            // Convert image to Base64
            String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
            String logoSogeBase64 = Base64.getEncoder().encodeToString(logoSogeBytes);
            String bgImageBase64 = Base64.getEncoder().encodeToString(bgImageBytes);
            String signatureBase64 = Base64.getEncoder().encodeToString(signatureBytes);
            String instagramBase64 = Base64.getEncoder().encodeToString(instagramBytes);
            String linkedinBase64 = Base64.getEncoder().encodeToString(linkedinBytes);
            String twitterBase64 = Base64.getEncoder().encodeToString(twitterBytes);
            String webBase64 = Base64.getEncoder().encodeToString(webBytes);
            // Clean up base64 string
            String cleanLogoBase64 = logoBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanLogoSogeBase64 = logoSogeBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanbgImageBase64 = bgImageBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleansignatureBase64 = signatureBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanInstagramBase64 = instagramBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanLinkedinBase64 = linkedinBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanTwitterBase64 = twitterBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            String cleanWebBase64 = webBase64.replaceAll("\\s", "").replaceAll("\n", "").replaceAll("\r", "");
            // Add the image as an attachment
            helper.addInline("logo", new ByteArrayResource(Base64.getDecoder().decode(cleanLogoBase64)), IMAGE_TYPE);
            helper.addInline("logoSoge", new ByteArrayResource(Base64.getDecoder().decode(cleanLogoSogeBase64)), IMAGE_TYPE);
            helper.addInline("bgImage", new ByteArrayResource(Base64.getDecoder().decode(cleanbgImageBase64)), IMAGE_TYPE);
            helper.addInline("signature", new ByteArrayResource(Base64.getDecoder().decode(cleansignatureBase64)), IMAGE_TYPE);
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
