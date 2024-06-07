```bash
### Clone the repo

git clone https://github.com/Cyrille09/todo-list.git

########### NODE.JS INSTALLATION ###########

### redirect to the node.js task folder with the below command

cd nodejs-todo-app

### Install the dependencies

npm install

# Create .env file and add the following info

PORT=5003
host=http://localhost

# initialise database with some data (optional)

node initializeDatabase.js

# run the task

npn run run:dev

########## REACT.JS INSTALLATION ##########

### redirect to the react.js task folder with the below command

cd react-todo-app

### Install the dependencies

npm install

# Create .env file and add the following info

PORT=3005
REACT_APP_BASE_URL=http://localhost:5003/api

# run the task

npm start

```
