package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.FactureAchat;

import java.util.List;

public interface FactureAchatRepo extends JpaRepository<FactureAchat, Integer> {
    List<FactureAchat> findByEntrepriseId(Integer ident);
}
