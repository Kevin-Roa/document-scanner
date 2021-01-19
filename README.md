# **Document Scanner**

## Description

> A web app to scan documents and save/view them as a pdf in the cloud.

## Purpose

1. Develop a cross-platform web application to store/view documents easily. 
2. Use a phone to take pictures of documents and save them to the cloud as pdf files.
3. Use a computer/phone to view the saved documents in a user friendly manner
3. Scan the pdf files using OCR and generate a list of tags
4. Use the scanned data to make search querys on the documents

## What I Learned

- Creating a cross-platform SPA 
	- Using Ionic to develop applications that look appropriate for the given device
		- Camera plugin to take photos from the device
	- Different functionality for desktop website vs ios website
- Firebase
	- Firestore
		- Creating nested document collections
		- Adding/Updating/Removing documents from nested collections
		- Custom access rules to increase security and limit access
	- Storage
		- Upload/download files to/from storage buckets
		- Using the cloud storage file scheme to create nested containers for users
		- Custom storage rules to increase security and limit access
	- Functions
		- Running functions when a file is uploaded to cloud storage
		- Ensuring safe execution to negate unnecessary costs (short run-time, no infinite loops, etc...)
	- Auth
		- Creating signin/signup flow using Google Auth
		- Limiting application access to authenticated users (on both frontend and backend)
- Google Vision OCR
	- Calling the Vision Client from a cloud function
	- Scanning a PDF file and reading its the output
		- Read/write from/to cloud storage bucket
- Generating PDF files

## Technologies Used

- Vue
- Ionic
	- Structural Components
	- Camera Plugin
- Firebase
	- Firestore
	- Cloud Storage
	- Cloud Functions
	- Firebase Auth
- Google Vision Client
	- Google Vision OCR on PDF files
- jsPDF