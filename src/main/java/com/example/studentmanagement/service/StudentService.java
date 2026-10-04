package com.example.studentmanagement.service;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class StudentService {
 private final StudentRepository repository;
 public StudentService(StudentRepository repository){this.repository=repository;}
 public List<Student> getAll(){return repository.findAll();}
 public Student getById(Long id){return repository.findById(id).orElseThrow(()->new RuntimeException("Student not found"));}
 public Student create(Student s){return repository.save(s);}
 public Student update(Long id,Student s){Student e=getById(id);e.setName(s.getName());e.setEmail(s.getEmail());e.setCourse(s.getCourse());return repository.save(e);}
 public void delete(Long id){repository.deleteById(id);}
}