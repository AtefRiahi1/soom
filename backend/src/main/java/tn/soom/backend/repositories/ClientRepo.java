package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Client;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Fournisseur;

import java.util.List;

public interface ClientRepo extends JpaRepository<Client, Integer> {
    List<Client> findByEntrepriseId(Integer ident);
}
