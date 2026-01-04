package com.tabib.backend.controller;

import com.tabib.backend.entity.Test;
import com.tabib.backend.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private TestRepository testRepository;

    // 1. GET ALL TESTS
    @GetMapping
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    // 2. GET TEST BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable Long id) {
        Optional<Test> test = testRepository.findById(id);
        if (test.isPresent()) {
            return ResponseEntity.ok(test.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CREATE TEST
    @PostMapping
    public Test createTest(@RequestBody Test test) {
        return testRepository.save(test);
    }

    // 4. UPDATE TEST
    @PutMapping("/{id}")
    public ResponseEntity<Test> updateTest(@PathVariable Long id, @RequestBody Test details) {
        Optional<Test> optional = testRepository.findById(id);

        if (optional.isPresent()) {
            Test existing = optional.get();
            existing.setTestName(details.getTestName());
            existing.setCategory(details.getCategory());
            existing.setDescription(details.getDescription());

            return ResponseEntity.ok(testRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE TEST
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTest(@PathVariable Long id) {
        if (testRepository.existsById(id)) {
            testRepository.deleteById(id);
            return ResponseEntity.ok("Test deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}