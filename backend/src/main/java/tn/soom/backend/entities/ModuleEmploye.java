package tn.soom.backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "moduleemployes")
public class ModuleEmploye {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Boolean paye=false;
    private Boolean status=true;
    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    @JsonIgnore
    private Employe employe;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    @JsonIgnore
    private FacturePay facture;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    private boolean consulter;
    private boolean modifier;
    private boolean ajouter;
    private boolean supprimer;

    public ModuleEmploye(Employe employe, Module module) {
        this.employe = employe;
        this.module = module;
        this.consulter = true;
        this.modifier = false;
        this.ajouter = false;
        this.supprimer = false;
    }
}
