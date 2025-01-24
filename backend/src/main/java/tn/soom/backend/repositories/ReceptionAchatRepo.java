package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.ReceptionAchat;

import java.util.List;

public interface ReceptionAchatRepo extends JpaRepository<ReceptionAchat, Integer> {
    List<ReceptionAchat> findByEntrepriseId(Integer ident);
}
