# Service
This is the data service application for the CS 262 Fall 2024 Software Engineering Project for Team J, the [Journeysmith App](https://github.com/calvin-cs262-fall2024-teamJ/Project). 

The Mobile Client can be found in the [Client Repository](https://github.com/calvin-cs262-fall2024-teamJ/Client)

This system stores information for users including login information, map uploads, and notes, so that dungeon masters can save their maps and notes from previous sessions. This allows for users to run long-term campaigns, since the application won't reset their data each time they run the application.

The database is relational and is hosted on Azure PostgreSQL, which can be found at https://azure.microsoft.com/en-us/products/postgresql/. The database server, user and password are stored as Azure application settings so that they are hidden from this repo.

We are including this repo in our project separately from the client repo as it provides an easier auto-deployment to Azure. 

