package tn.soom.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
@Table(name = "avoirs")
public class Avoir {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String type; // "argent" ou "quantite"
    private Double montant; // Pour les avoirs en argent
    private String produit; // Nom du produit pour les avoirs en quantité
    private Integer quantite; // Quantité concernée par l'avoir

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "facture_id", nullable = true)
    private Facture facture; // Avoir en argent lié à une facture

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "facture_achat_id", nullable = true)
    private FactureAchat factureAchat; // Avoir en argent lié à une facture d'achat

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reception_achat_id", nullable = true)
    private ReceptionAchat receptionAchat; // Avoir en quantité lié à une réception

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sortie_id", nullable = true)
    private Sortie sortie; // Avoir en quantité lié à une sortie

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entreprise_id", nullable = true)
    private Entreprise entreprise;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
