package com.example.studentmanagement.controller;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/students")
public class StudentController {
 private final StudentService service;
 public StudentController(StudentService service){this.service=service;}
 @GetMapping public List<Student> getAll(){return service.getAll();}
 @GetMapping("/{id}") public Student getById(@PathVariable Long id){return service.getById(id);}
 @PostMapping public Student create(@RequestBody Student s){return service.create(s);}
 @PutMapping("/{id}") public Student update(@PathVariable Long id,@RequestBody Student s){return service.update(id,s);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}