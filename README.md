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

## UI Screenshots

### Main

![main](https://github.com/Cyrille09/todo-list/assets/25312073/bfdef5d0-6e70-42f7-9b1a-6fe6dc04c3da)

### Update todo

![update](https://github.com/Cyrille09/todo-list/assets/25312073/bec4ff12-96d9-41b0-ab5d-a7c35bc6b844)

### Delete todo

![delete](https://github.com/Cyrille09/todo-list/assets/25312073/d93aa461-e2cd-4993-9782-2b14c9f3b95e)

### Delete all todos

![delete-all](https://github.com/Cyrille09/todo-list/assets/25312073/892f7f9a-333c-4b9b-8fc2-ccdd7defcd26)

### Delete selected todo (s)

![delete-selected](https://github.com/Cyrille09/todo-list/assets/25312073/31b25ebd-523e-4600-ae1a-8521b9f67bc0)
