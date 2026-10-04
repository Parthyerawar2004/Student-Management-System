# Student Management System - DevOps Mini Project

Developer -> GitHub -> Jenkins -> Build & Test -> Docker Image -> Deployment -> Monitoring

## Stack
Java 17, Spring Boot, Maven, H2, JUnit, Git/GitHub, Jenkins, Docker, Docker Compose, Ansible, Actuator.

## Local run
mvn clean test
mvn spring-boot:run

Open http://localhost:8080

## API
GET /api/students
GET /api/students/{id}
POST /api/students
PUT /api/students/{id}
DELETE /api/students/{id}

## Monitoring
http://localhost:8080/actuator/health
http://localhost:8080/actuator/metrics

## Docker
docker build -t student-management:latest .
docker run -d --name student-management -p 8080:8080 student-management:latest

Or:
docker compose up --build -d
