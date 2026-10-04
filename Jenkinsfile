pipeline {

    agent any

    tools {
        maven 'maven3'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'mvn clean package -DskipTests'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t student-management:latest .'
            }
        }

        stage('Docker Deploy') {
            steps {
                bat 'docker rm -f student-management || exit 0'
                bat 'docker run -d --name student-management -p 8082:8080 student-management:latest'
            }
        }
    }

    post {

        success {
            echo 'Build, tests, Docker image creation and deployment completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}