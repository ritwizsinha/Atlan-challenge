# ATLAN-TASK

![Atlan-Logo](static/atlan.png) 

Atlan is a data democratization company that helps teams collaborate frictionlessly on data projects. It is creating a home for data teams—allowing them to truly democratize both internal and external data, while automating repetitive tasks. 

This is a internship task for a Backend Developer Internship where the task given is to build a solution for enabling interrupts like pause and resume actions while uploading and exporting huge documents. Here a csv file with more than million docs is taken as a file example. The following features have been implemented.

## Features
- [x] Allow for pause action on upload
- [x] Allow for resume action on upload
- [x] Allow for stop action on upload
- [x] Allow for stop action on export 

## Things to do
- Find a better method to rollback changes in the database on stop upload process. Currently mongo transactions are not being used because of them being available only on replica sets. 

## Structure

- MongoDB used as a sample database for storing users. 
- Redis used to store the task state . A task is defined as initiation of an upload/export process and it ends when the upload/export is complete or is terminated.
- CSV is created and read using objects-to-csv and neat-csv