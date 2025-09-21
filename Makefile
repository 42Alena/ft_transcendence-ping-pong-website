.PHONY: setup frontend backend

setup:
	cd frontend; npm install
	cd backend; npm install

backend:
	cd backend; npm run start

frontend:
	cd frontend; npm run compile; npm run serve


backend-test:
	cd backend; npm run backend-test

