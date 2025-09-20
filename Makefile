.PHONY: setup frontend backend

setup:
	cd frontend; npm install
	cd backend; npm install

backend:
	cd backend; npm run start

frontend:
	cd frontend; npm run compile; npm run serve



chat-test:
	cd backend; npm run chat-test

