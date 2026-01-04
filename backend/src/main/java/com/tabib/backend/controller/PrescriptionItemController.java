package com.tabib.backend.controller;

import com.tabib.backend.entity.PrescriptionItem;
import com.tabib.backend.repository.PrescriptionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescription_items")
@CrossOrigin(origins = "*")
public class PrescriptionItemController {

    @Autowired
    private PrescriptionItemRepository itemRepository;

    // 1. GET ALL ITEMS (Global list)
    @GetMapping
    public List<PrescriptionItem> getAllItems() {
        return itemRepository.findAll();
    }

    // 2. GET ITEMS BY PRESCRIPTION ID (Useful for viewing a full prescription)
    @GetMapping("/prescription/{prescriptionId}")
    public List<PrescriptionItem> getByPrescriptionId(@PathVariable Long prescriptionId) {
        return itemRepository.findByPrescriptionId(prescriptionId);
    }

    // 3. GET SINGLE ITEM BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionItem> getItemById(@PathVariable Long id) {
        Optional<PrescriptionItem> item = itemRepository.findById(id);
        if (item.isPresent()) {
            return ResponseEntity.ok(item.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. CREATE ITEM (Add medicine to prescription)
    @PostMapping
    public PrescriptionItem createItem(@RequestBody PrescriptionItem item) {
        return itemRepository.save(item);
    }

    // 5. UPDATE ITEM
    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionItem> updateItem(@PathVariable Long id, @RequestBody PrescriptionItem details) {
        Optional<PrescriptionItem> optional = itemRepository.findById(id);

        if (optional.isPresent()) {
            PrescriptionItem existing = optional.get();
            existing.setDosage(details.getDosage());
            existing.setFrequency(details.getFrequency());
            existing.setDuration(details.getDuration());
            existing.setInstructions(details.getInstructions());
            // Usually we don't change the drug_id or prescription_id here, but you can if needed

            return ResponseEntity.ok(itemRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. DELETE ITEM (Remove medicine from prescription)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return ResponseEntity.ok("Item deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}