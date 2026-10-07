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
                bat 'mvn clean package -DskipTests -U'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test -U'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t student-management:latest .'
            }
        }

        stage('Docker Deploy') {
            steps {
                script {
                    def status = bat(
                        script: 'docker rm -f student-management',
                        returnStatus: true
                    )
                    if (status != 0) {
                        echo 'No existing student-management container found.'
                    }
                }
                bat 'docker run -d --name student-management -p 8082:8080 student-management:latest'
            }
        }
        stage('Health Check') {
            steps {
                bat 'curl --fail http://localhost:8082/actuator/health'
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