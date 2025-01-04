package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.soom.backend.entities.FacturePay;
@Repository
public interface FacturePayRepo extends JpaRepository<FacturePay, Integer> {
}
