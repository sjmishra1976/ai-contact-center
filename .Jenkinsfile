pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "gcr.io/${env.GCP_PROJECT_ID}/ai-contact-center:${env.BUILD_NUMBER}"
        GCP_PROJECT_ID = credentials('GCP_PROJECT_ID')     // GCP Project ID from Jenkins credentials
        GCP_SA_KEY = credentials('GCP_SA_KEY')             // GCP Service Account Key JSON
        K8S_CLUSTER_NAME = "ai-contact-cluster"            // GKE Cluster name
        K8S_CLUSTER_ZONE = "us-central1-c"                  // GKE Cluster zone
    }

    stages {
        
        stage('Checkout') {
            steps {
                echo 'Checking out repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Lint and Test') {
            steps {
                echo 'Running lint and tests...'
                sh 'npx eslint . || true'   // Linting
                sh 'npm test'               // Unit tests
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${DOCKER_IMAGE}"
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Authenticating with Google Container Registry (GCR)..."
                sh """
                echo ${GCP_SA_KEY} | docker login -u _json_key --password-stdin https://gcr.io
                docker tag ${DOCKER_IMAGE} ${DOCKER_IMAGE}
                docker push ${DOCKER_IMAGE}
                """
            }
        }

        stage('Deploy to GKE') {
            steps {
                echo "Deploying to GKE..."

                // Authenticate with GKE
                sh """
                echo ${GCP_SA_KEY} > gcp-key.json
                gcloud auth activate-service-account --key-file=gcp-key.json
                gcloud container clusters get-credentials ${K8S_CLUSTER_NAME} --zone ${K8S_CLUSTER_ZONE} --project ${GCP_PROJECT_ID}
                """

                // Apply Kubernetes manifests
                sh """
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                kubectl rollout status deployment/ai-contact-center
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment to GKE successful!"
            mail to: 'your-email@example.com',
                 subject: "Deployment Successful: AI Contact Center",
                 body: "The deployment of AI Contact Center to GKE was successful. Version: ${env.BUILD_NUMBER}"
        }
        failure {
            echo "❌ Deployment failed!"
            mail to: 'your-email@example.com',
                 subject: "Deployment Failed: AI Contact Center",
                 body: "The deployment of AI Contact Center to GKE failed. Please check the Jenkins logs."
        }
    }
}
