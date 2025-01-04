package tn.soom.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.FacturePay;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;
import tn.soom.backend.entities.ModuleEmploye;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;

import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    public static final String logo = System.getProperty("user.home") + "/Downloads/uploads/image.png";

    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }

    public void envoyerFactureParEmail(FacturePay facture,String to) {
        try {
            ByteArrayOutputStream pdfStream = genererFacturePdf(facture);
            if (pdfStream == null) {
                throw new IllegalArgumentException("Échec de la génération du PDF.");
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Facture #" + facture.getId());
            helper.setText("Bonjour,\n\nVeuillez trouver ci-joint la facture #" + facture.getId() + ".");

            helper.addAttachment("Facture_" + facture.getId() + ".pdf", new ByteArrayDataSource(pdfStream.toByteArray(), "application/pdf"));

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de l'envoi de l'e-mail.");
        }
    }

    public ByteArrayOutputStream genererFacturePdf(FacturePay facture) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            Document document = new Document(new com.itextpdf.kernel.pdf.PdfDocument(writer));

            String logoPath = logo;
            Image logo = new Image(ImageDataFactory.create(logoPath));
            logo.setWidth(100);
            document.add(logo);

            document.add(new Paragraph("HorizonData"));
            document.add(new Paragraph("E-mail : horizondata@gmail.com"));
            document.add(new Paragraph("Téléphone : 12345678"));

            document.add(new Paragraph("\nFacture #" + facture.getId())
                    .setBold().setFontSize(18).setMarginBottom(20));

            document.add(new Paragraph("Employé : " + facture.getEmploye().getEmail()));
            document.add(new Paragraph("Date : " + facture.getDateCreation().toString()));

            float[] columnWidths = {1, 5, 2};
            Table table = new Table(columnWidths);
            table.addHeaderCell("N°");
            table.addHeaderCell("Nom du Module");
            table.addHeaderCell("Prix");

            int index = 1;
            for (ModuleEmploye module : facture.getModules()) {
                table.addCell(String.valueOf(index++));
                table.addCell(module.getModule().getNom());
                table.addCell(String.valueOf(module.getModule().getPrix()));
            }

            table.addCell("");
            table.addCell("Total");
            table.addCell(String.valueOf(facture.getMontantTotal()));

            document.add(table);
            document.close();

            return outputStream;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    }

