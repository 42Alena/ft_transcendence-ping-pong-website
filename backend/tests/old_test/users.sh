#!/bin/bash
# history | grep curl | uniq
# run in terminal: ./backend/tests/users.sh

echo "get users"
curl localhost:3000/users --silent

echo "register user with errors"
curl --silent localhost:3000/user/register -X POST -H "Content-type: application/json" -d '{}'


# echo "register without errors"
# curl localhost:3000/user/register -X POST -H "Content-type: application/json" -d '{"username": "123", "passwordPlain": "abc", "displayName": "name" }' 



# echo "something with auth"
# AUTH_TOKEN=123
# curl localhost:3000/something -H "Content-type: application/json" -H "Authorization: Bearer $AUTH_TOKEN"
