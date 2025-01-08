package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.entities.ModuleEmploye;
import tn.soom.backend.services.ModuleEmployeService;
import tn.soom.backend.services.ModuleService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/permission")
public class ModuleEmployeController {
    @Autowired
    private ModuleEmployeService moduleEmployeService;

    @GetMapping("/employe/{empId}")
    public ResponseEntity<List<ModuleEmploye>> getModuleEmpByEmpId(@PathVariable Integer empId) {
        List<ModuleEmploye> moduleEmployeList = moduleEmployeService.getModuleEmployeByEmployeId(empId);
        return ResponseEntity.ok(moduleEmployeList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateModuleEmployePermissions(
            @PathVariable Integer id,
            @RequestParam boolean consulter,
            @RequestParam boolean modifier,
            @RequestParam boolean ajouter,
            @RequestParam boolean supprimer) {
        Optional<?> updatedModuleEmploye = moduleEmployeService.updateModuleEmployePermissions(id, consulter, modifier, ajouter, supprimer);

        if (updatedModuleEmploye.isPresent()) {
            return ResponseEntity.ok(updatedModuleEmploye.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/payment/{moduleemployeId}")
    public ResponseEntity<ModuleEmploye> updateModuleEmployePaye(@PathVariable Integer moduleemployeId) {
        ModuleEmploye updatedModuleEmploye = moduleEmployeService.updateModuleEmployePaye(moduleemployeId);
        return ResponseEntity.ok(updatedModuleEmploye);
    }

    @GetMapping
    public ResponseEntity<List<ModuleEmploye>> getModuleByEntrepriseId(@RequestParam Integer entrId) {
        List<ModuleEmploye> moduleEmployeList = moduleEmployeService.getModuleByEntrepriseId(entrId);
        return new ResponseEntity<>(moduleEmployeList, HttpStatus.OK);
    }

    @PutMapping("/responsable/{moduleemployeId}/{empId}")
    public ResponseEntity<ModuleEmploye> updateModuleEmployeResponsable(@PathVariable Integer moduleemployeId,@PathVariable Integer empId) {
        ModuleEmploye updatedModuleEmploye = moduleEmployeService.updateModuleEmployeResponsable(moduleemployeId,empId);
        return ResponseEntity.ok(updatedModuleEmploye);
    }

}
