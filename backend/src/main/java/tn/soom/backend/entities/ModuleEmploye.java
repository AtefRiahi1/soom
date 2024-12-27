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

    private boolean read;
    private boolean write;
    private boolean create;
    private boolean delete;

    public ModuleEmploye(Employe employe, Module module) {
        this.employe = employe;
        this.module = module;
        this.read = true;
        this.write = false;
        this.create = false;
        this.delete = false;
    }
}
