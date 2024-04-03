pipeline {
  environment {
    MY_GITLAB_CRED = credentials('ahsan-gitlab')
    GIT_CHECKOUT_URL_CONFIG="http://192.168.0.70/npd-dev/mock_bot_web.git" 
  }

  agent {
    node {
      label 'Jenkins-212'
    }
  }

  stages { 

    stage('Git Checkout staging') {
          when {
            branch 'staging'
           }
         steps {
          git branch: 'staging',
             credentialsId: 'ahsan-gitlab',
             url: "$GIT_CHECKOUT_URL_CONFIG"
         }
       }

     
      stage('Copy Build Files in VM staging '){
        when {
            branch 'staging'
        }
        steps{
            script{
          sh ' ssh billy-240 mkdir -p /var/www/pb.mock-bot-web-v2.com/html/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' scp build_staging.zip billy-240:/home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 unzip /home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build_staging.zip -d /home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 rm -rf /var/www/pb.mock-bot-web-v2.com/html/*'
          sh ' sleep 30'
          sh ' ssh billy-240 cp -r /home/serveradmin/backup/mock-bot-web-v2/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build/* /var/www/pb.mock-bot-web-v2.com/html/'
          
           }
        }
      }


      stage('Git Checkout Main') {
        when {
          branch 'main'
        }
      steps {
        git branch: 'main',
            credentialsId: 'ahsan-gitlab',
            url: "$GIT_CHECKOUT_URL_CONFIG"
        }
      }
 
      stage('Checking Connection') {
              when {
                  branch 'main'
              }
            steps {
                script {
                    def ipAddress = '172.172.1.42'
                    def pingAttempts = 3
                    def attempt = 1
                    while (attempt <= pingAttempts) {
                        def pingResult = sh(script: "ping -c 3 ${ipAddress}", returnStatus: true)
                        if (pingResult == 0) {
                            echo "IP address ${ipAddress} is reachable. Proceeding with the deployment."
                            break // If ping is successful, exit the loop
                        } else {
                            echo "Attempt ${attempt}: IP address ${ipAddress} is unreachable."
                            if (attempt == pingAttempts) {
                                error "Reached maximum ping attempts. Exiting."
                            }
                            sleep 10 // Adjust the sleep time if needed between attempts
                        }
                        attempt++
                    }
                }
            }
        }

      stage('Copy Build Files in VM Main '){
        when {
            branch 'main'
        }
        steps{
            script{
          sh ' ssh teepee mkdir -p /var/www/pb.mock-bot-web-v2-production.com/html/'
          sh ' ssh teepee mkdir -p /home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/'
          sh ' ssh teepee mkdir -p /home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' scp build_prod.zip teepee:/home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh teepee unzip /home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build_prod.zip -d /home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh teepee rm -rf /var/www/pb.mock-bot-web-v2-production.com/html/*'
          sh ' sleep 30'
          sh ' ssh teepee cp -r /home/serveradmin/backup/mock-bot-web-v2-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build/* /var/www/pb.mock-bot-web-v2-production.com/html/'
           }
        }
      } 
}

post {
    always {
      emailext(subject: 'Jenkins Build $BUILD_STATUS : Job $PROJECT_NAME', body: '''Deployment to $BRANCH_NAME is $BUILD_STATUS 
      Job Name : $PROJECT_NAME 
      Build number : $BUILD_NUMBER 
 
      More info at: $BUILD_URL''', to: 'ahsan.ali@planetbeyond.co.uk, ahmed@highersummit.com')
    }
  }
}
