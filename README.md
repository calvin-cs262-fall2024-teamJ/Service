# Service
This is the data service application for the CS 262 Fall 2024 Software Engineering Project for Team J, the [Journeysmith App](https://github.com/calvin-cs262-fall2024-teamJ/Project). 

The Mobile Client can be found in the [Client Repository](https://github.com/calvin-cs262-fall2024-teamJ/Client)

This system stores information for users including login information, map uploads, and notes, so that dungeon masters can save their maps and notes from previous sessions. This allows for users to run long-term campaigns, since the application won't reset their data each time they run the application.

The database is relational and is hosted on Azure PostgreSQL, which can be found at https://azure.microsoft.com/en-us/products/postgresql/. The database server, user and password are stored as Azure application settings so that they are hidden from this repo.

It has the following read data route URLs:journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/dungeonmaster/:id, journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/maps, journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/mapdata, journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/notes/:id, journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/notes/map/:id, journeysmithwebbapp-f5azf8edebaqarcc.canadacentral-01.azurewebsites.net/pins/:id

//dungeon masters
router.get('/', readHelloMessage);
router.get('/dungeonmasters', readDMs);
router.get('/dungeonmasters/:id', readDM);
router.put('/dungeonmasters/:id', updateDM);
router.post('/dungeonmasters', createDM);

//maps
router.get('/maps', readMaps);
router.get('/mapdata/:id', readDMMaps);
router.get('/maps/image/:id', readMapImage);
router.post('/maps', createMap);
router.delete('/maps/:id', deleteMap);

//notes
router.get('/notes', readNotes);
router.get('/notes/:id', readNote);
router.put('/notes/:id', updateNote);
router.post('/notes', createNote);
router.delete('/notes/:id', deleteNote);
router.get('/notes/map/:id', readMapNotes);

//pins
router.get('/pins/:id', readPins);
router.put('/pins/:id', updatePin);
router.post('/pins', createPin);
router.delete('/pins/:id', deletePin);
router.post('/pins/images', createPinImage);

The web service is based on the standard Azure App Service tutorial for Node.js. The tutorial can be found here.

This system stores information for users including login information, map uploads, and notes, so that dungeon masters can save their maps and notes from previous sessions. This allows for users to run long-term campaigns, since the application won't reset their data each time they run the application.

The database is relational and is hosted on Azure PostgreSQL, which can be found at https://azure.microsoft.com/en-us/products/postgresql/. The database server, user and password are stored as Azure application settings so that they are hidden from this repo.

We are including this repo in our project separately from the client repo as it provides an easier auto-deployment to Azure.
