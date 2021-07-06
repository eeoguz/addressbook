

#### mongodb ve mongo-express i baslatmak icin

    docker-compose -f docker-compose.yaml up
    
database takip icin: http://localhost:8080
 
#### server i baslatmak icin
    npm install
    node server.js
    
UI icin: http://localhost:3000


#### uygulamadan docker image olustumak icin

    docker build -t my-app:1.0 .       

#### heruko ile servis icin;

    heroku container:login
    heroku container:push web
    heroku container:release web