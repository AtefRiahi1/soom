package tn.soom.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
@Entity
@Table(name = "employes")
public class Employe implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private String email;
    private String password;
    private Boolean isverified=false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;

    @OneToMany(mappedBy = "employe")
    @ToString.Exclude
    private List<EmployeSession> employeSessions;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModuleEmploye> modules;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return modules.stream()
                .map(moduleEmploye -> new SimpleGrantedAuthority(moduleEmploye.getModule().getNom().toUpperCase()))
                .collect(Collectors.toList());
    }


    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

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
