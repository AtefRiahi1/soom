package tn.soom.backend.services;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
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
import com.itextpdf.io.image.ImageDataFactory;
import tn.soom.backend.entities.ModuleEmploye;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;

import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    public static final String logo = System.getProperty("user.home") + "/Downloads/uploads/images.png";

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
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            document.setMargins(20, 20, 20, 20);

            String logoPath = logo;
            Image logo = new Image(ImageDataFactory.create(logoPath));
            logo.setWidth(120);
            logo.setHeight(60);
            logo.setHorizontalAlignment(HorizontalAlignment.LEFT);
            document.add(logo);

            Paragraph companyInfo = new Paragraph("HorizonData\nE-mail : horizondata@gmail.com\nTéléphone : 12345678")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontSize(10)
                    .setMarginBottom(20);
            document.add(companyInfo);

            LineSeparator separator = new LineSeparator(new SolidLine());
            document.add(separator);

            Paragraph invoiceTitle = new Paragraph("Facture #" + facture.getId())
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10);
            document.add(invoiceTitle);

            Paragraph employeeInfo = new Paragraph("Employé : " + facture.getEmploye().getEmail() + "\n" +
                    "Date de création : " + facture.getDateCreation().toLocalDate())
                    .setTextAlignment(TextAlignment.LEFT)
                    .setMarginBottom(20);
            document.add(employeeInfo);

            float[] columnWidths = {1, 5, 2};
            Table table = new Table(columnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            table.addHeaderCell(new Cell().add(new Paragraph("N°").setBold().setTextAlignment(TextAlignment.CENTER)));
            table.addHeaderCell(new Cell().add(new Paragraph("Nom du Module").setBold().setTextAlignment(TextAlignment.LEFT)));
            table.addHeaderCell(new Cell().add(new Paragraph("Prix").setBold().setTextAlignment(TextAlignment.RIGHT)));

            int index = 1;
            for (ModuleEmploye module : facture.getModules()) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(index++)).setTextAlignment(TextAlignment.CENTER)));
                table.addCell(new Cell().add(new Paragraph(module.getModule().getNom()).setTextAlignment(TextAlignment.LEFT)));
                table.addCell(new Cell().add(new Paragraph(String.format("%.2f dt", module.getModule().getPrix()))
                        .setTextAlignment(TextAlignment.RIGHT)));
            }


            table.addCell(new Cell(1, 2).add(new Paragraph("Total").setBold().setTextAlignment(TextAlignment.RIGHT)));
            table.addCell(new Cell().add(new Paragraph(String.format("%.2f dt", facture.getMontantTotal()))
                    .setBold().setTextAlignment(TextAlignment.RIGHT)));

            document.add(table);

            document.add(new Paragraph("\n\nTermes de paiement :").setBold().setFontSize(12));
            document.add(new Paragraph("Veuillez régler la facture sous 30 jours. En cas de questions, contactez-nous à horizondata@gmail.com.")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.LEFT)
                    .setMarginTop(10));

            document.close();
            return outputStream;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}

