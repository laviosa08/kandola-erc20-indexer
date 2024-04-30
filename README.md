Steps to run the erc20 indexer:

1. Clone the repository
2. Open terminal and move to the project `cd kandola-erc20-indexer`
3. Execute `npm install`
4. Execute `node index.js`

The database is hosted on ElephantSQL. Once the above commands are executed, you can view the database table as follows -

 1. I have added you as team member on ElephantSQL. Once you accept the request (in mail) you can go to `erc20-indexer` instance.
 2. Then go to `Browser` tab and run query `SELECT * FROM "erc20_events"` to see the tables content.

OR
You may also download `tableplus` and connect using `postgres://lwvvbgjh:CEDZCblebcjaSUEeFRiBMvXG8fercs-A@rosie.db.elephantsql.com/lwvvbgjh` and go to `erc20-indexer`
