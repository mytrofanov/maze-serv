## Description
## Multiplayer game on React, Node, Nest-Js, Postgress, WebSockets

To start server locally:
1. Create new DB on pgAdmin (for example named "mazes")
2. Add .env file in root of the project, with next vars:

PORT=5000

POSTGRES_HOST=localhost

POSTGRES_USER=postgres   - or your name in PG

POSTGRES_DP=mazes        - name of created DB

POSTGRES_PASSWORD=root   - or your password for PG (root is default)

POSTGRES_PORT=5432       - or your port (5432 is default) 

CORS_URL=http://localhost:5173

WEB_SOCKET_PORT=5000      


3. use command:
```shell
npm run start:dev
```

![image](https://github.com/mytrofanov/maze-serv/assets/78136441/5d7779e8-5e9b-4e90-b294-801cdb989756)
