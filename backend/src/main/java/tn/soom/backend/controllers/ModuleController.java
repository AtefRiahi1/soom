package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Module;
import tn.soom.backend.services.ModuleService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/module")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @PostMapping
    public ResponseEntity<Module> addModule(@RequestBody Module module) {
        return ResponseEntity.ok(moduleService.addModule(module));
    }

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Module>> getModuleById(@PathVariable Integer id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable Integer id, @RequestBody Module module) {
        return ResponseEntity.ok(moduleService.updateModule(id, module));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Integer id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}
