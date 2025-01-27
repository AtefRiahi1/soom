package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.AvoirRepo;

import java.util.List;

@Service
public class AvoirService {

    @Autowired
    private AvoirRepo avoirRepository;

    public Avoir creerAvoirEnArgent(Facture facture, double montantEcart) {
        Avoir avoir = new Avoir();
        avoir.setType("argent");
        avoir.setMontant(montantEcart);
        avoir.setFacture(facture);
        avoir.setEntreprise(facture.getEntreprise());
        return avoirRepository.save(avoir);
    }

    public Avoir creerAvoirEnArgent(FactureAchat facture, double montantEcart) {
        Avoir avoir = new Avoir();
        avoir.setType("argent");
        avoir.setMontant(montantEcart);
        avoir.setFactureAchat(facture);
        avoir.setEntreprise(facture.getEntreprise());
        return avoirRepository.save(avoir);
    }

    public Avoir creerAvoirEnQuantite(ReceptionAchat reception, String produit, int quantiteEcart) {
        Avoir avoir = new Avoir();
        avoir.setType("quantite");
        avoir.setProduit(produit);
        avoir.setQuantite(quantiteEcart);
        avoir.setReceptionAchat(reception);
        avoir.setEntreprise(reception.getEntreprise());
        return avoirRepository.save(avoir);
    }

    public Avoir creerAvoirEnQuantite(Sortie sortie, String produit, int quantiteEcart) {
        Avoir avoir = new Avoir();
        avoir.setType("quantite");
        avoir.setProduit(produit);
        avoir.setQuantite(quantiteEcart);
        avoir.setSortie(sortie);
        avoir.setEntreprise(sortie.getEntreprise());
        return avoirRepository.save(avoir);
    }

    public List<Avoir> getAvoirByEntrepriseId(Integer entrepriseId) {
        return avoirRepository.findByEntrepriseId(entrepriseId);
    }
}

