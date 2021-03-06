The task given is to build a solution for enabling interrupts like pause and resume actions while uploading and exporting huge documents. Here a csv file with more than million docs is taken as a file example. The following features have been implemented.

## Features
- [x] Allow for start action on upload/export
- [x] Allow for pause action on upload
- [x] Allow for resume action on upload
- [x] Allow for stop action on upload
- [x] Allow for stop action on export

## Things to do
- Find a better method to rollback changes in the database on stop upload process. Currently mongo transactions are not being used because of them being available only on replica sets. 
- Provide multiple uploads and exports at the same time.

## Structure

- MongoDB used as a sample database for storing users. 
- Redis used to store the task state . A task is defined as initiation of an upload/export process and it ends when the upload/export is complete or is terminated.
- CSV is created and read using objects-to-csv and neat-csv

## Technologies used
- Node for backend code in express framework
- MongoDB for Database using mongoose package
- Redis for task management using redis package
- Neat-csv , objects-to-csv for csv read and create

## Architecture

- A task is defined as the starting of an upload/export and is said to be ended when it is either terminated or is completed.
- The task has 3 states RUNNING, PAUSED AND ENDED.
- When we start the upload/export the task goes to RUNNING state (represented as 0, implemented kind of like enums)
- When the task is paused it goes to paused state (represented  as 1, implemented kind of like enums)
- When the task is ended (represented as absence of that task)
- Everytime we upload a document to the database we check the state of task. If it is RUNNING, we continue the process, if it is paused then it exits. 
- When the task is resumed it goes from PAUSED to RUNNING state and the document upload starts again. 
- If the task is terminated then the document uploads of current task have to be rolled back. 

## Implementation
- As the task variable is accessed multiple times it was better to store it in cache than in the database. Thus redis was used for storing the task. Along with task RowCount and Action variable are also stored in cache which is further used to rollback changes to the database whenever the uploads are terminated and identify the kind of task running upload/export respectively.  
- For uploading of csv each row of CSV is taken one by one and uploaded to database. 
- For exporting each row is taken from database and added to a csv which is sent to the user.
- For rolling back changes if X operations are made we have to delete the last X entries from the database. Here X is the rowCount stored in cache. A transaction might be a better solution to this but was not supported in mongoose without replica sets. 

## API

- As this is only a test for uploads resume/pause/stop etc, the upload is currently specified as a get request and doing a request starts uploading the file 'test.csv' present on server to the database. This way its easier to test on the browser itself. 
- For time lag a while loop is run with  some big number for some syncronous delay
- There is a continous data log to the console which is sent to the database
- An expected error "No running task found" error is thrown when task is paused or stoped as no running task exist 
- GET 
  - /upload/start : Starts the upload of the 'test.csv' to the database
  - /upload/pause : Pauses the upload of 'test.csv'
  - /upload/resume: Resumes the upload of 'test.csv'
  - /upload/stop  : Stops the upload of 'test.csv'
  - /export/start : Starts export from the database and starts saving data.csv on the server
  - /export/stop  : Stops the export from the database and deletes data.csv on the server. 

## Running

To run this locally 
docker and docker-compose is required
1. docker-compose up
