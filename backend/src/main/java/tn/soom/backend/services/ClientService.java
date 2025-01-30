package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.ClientRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.FournisseurRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;
import java.util.Optional;
@Service
public class ClientService {
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepository;

    public Client addClient(Client client, Integer entrepriseId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        client.setEntreprise(entreprise);


        Client savedClient = clientRepo.save(client);

        if (entreprise != null) {
            Notification notification = new Notification();
            notification.setTitle("Nouvel client ajouté");
            notification.setMessage("Un nouvel client, " + savedClient.getNom() + ", a été ajouté à l'entreprise " + entreprise.getName() + ".");
            notification.setCreatedBy(empEmail);
            notification.setEntreprise(entreprise);
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return savedClient;
    }

    public Client findOne(Integer id) {
        return clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'ID : " + id));
    }

    public List<Client> getClientByEntrepriseId(Integer entrepriseId) {
        return clientRepo.findByEntrepriseId(entrepriseId);
    }

    public Client updateClient(Integer id, Client updatedClient) {
        Optional<Client> existingClient = clientRepo.findById(id);
        if (existingClient.isPresent()) {
            Client client = existingClient.get();
            client.setNom(updatedClient.getNom());
            client.setAdresse(updatedClient.getAdresse());
            client.setLabel(updatedClient.getLabel());
            client.setEmail(updatedClient.getEmail());
            client.setTel(updatedClient.getTel());
            return clientRepo.save(client);
        } else {
            throw new IllegalArgumentException("Client non trouvé avec l'ID : " + id);
        }
    }

    public void deleteClient(Integer id) {
        if (clientRepo.existsById(id)) {
            clientRepo.deleteById(id);
        } else {
            throw new IllegalArgumentException("Client non trouvé avec l'ID : " + id);
        }
    }
}
