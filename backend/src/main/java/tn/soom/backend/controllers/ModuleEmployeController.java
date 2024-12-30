package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

}
