pipeline {
 agent any
 stages {
  stage('Checkout'){steps{checkout scm}}
  stage('Build'){steps{sh 'mvn clean package -DskipTests'}}
  stage('Test'){steps{sh 'mvn test'}}
  stage('Docker Build'){steps{sh 'docker build -t student-management:${BUILD_NUMBER} . && docker tag student-management:${BUILD_NUMBER} student-management:latest'}}
  stage('Deploy'){steps{sh 'docker rm -f student-management || true; docker run -d --name student-management -p 8080:8080 student-management:latest'}}
 }
 post {success{echo 'Pipeline completed successfully.'} failure{echo 'Pipeline failed.'}}
}