package tn.soom.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
@Table(name = "receptionAchats")
public class ReceptionAchat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String numReception;
    @ElementCollection
    @CollectionTable(name = "reception_achat_produits", joinColumns = @JoinColumn(name = "reception_achat_id"))
    private List<ReceptionAchat.ProductItem> produits;
    private Double priceHt;
    private Double tva;
    private Double taxe;
    private Double netApayer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Embeddable
    @Data
    public static class ProductItem {
        private String nom;
        private int quantite;
        private double prixUnitaire;
        private double prix_total;
    }
}
