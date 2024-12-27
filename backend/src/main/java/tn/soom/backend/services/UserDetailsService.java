package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.EntrepriseRepo;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService{
    @Autowired
    private AdminERPRepo adminERPRepo;
    @Autowired
    private EmployeRepo employeRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var admin = adminERPRepo.findByEmail(username);
        if (admin.isPresent()) {
            return admin.get();
        } else {
            var employe = employeRepo.findByEmail(username);
            if (employe.isPresent()) {
                return employe.get();
            } else {
                var entreprise = entrepriseRepo.findByEmail(username);
                if (entreprise.isPresent()) {
                    return entreprise.get();
                } else {
                    throw new UsernameNotFoundException("User not found");
                }
            }
        }
    }
}
