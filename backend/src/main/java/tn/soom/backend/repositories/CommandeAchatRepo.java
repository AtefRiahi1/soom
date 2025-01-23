package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Article;
import tn.soom.backend.entities.CommandeAchat;

import java.util.List;

public interface CommandeAchatRepo extends JpaRepository<CommandeAchat, Integer> {
    List<CommandeAchat> findByEntrepriseId(Integer ident);
}
