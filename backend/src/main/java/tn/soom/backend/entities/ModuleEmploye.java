package tn.soom.backend.entities;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;

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
