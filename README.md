### To start the project
Run "npm install"
Add these in .env file:
EMITTER_PORT, LISTENER_PORT, HOST, Mongo: USER_NAME, Mongo: USER_PASSWORD,MONGO_DB,SECRET_KEY
Run "node listener.js" in one terminal
Open http://localhost:3000/ to get valid objects from listener service
Run "node emitter.js"
