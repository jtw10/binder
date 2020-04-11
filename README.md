# ![binder logo](assets/logo.jpg)

### Find a study mate nearby!

## What is Binder?

Binder is a Tinder-like app that allows users to meet people for the purpose of studying. Users are able to upload a picture and write a short description that represents themselves. Binder uses location settings to determine nearby users to match with. Matched users will be given a list of suggested meeting locations based on the midpoint between their last known locations and Google Places API, and will be encouraged to arrange a time and location using the e-mail that they registered with. Users will be able to filter their search results based on current location and other preferences. 

## Usage

Create a file called .env at the root folder of the project. Replace Xs with the Firebase config values.
<br>
API_KEY=xxxx<br>
AUTH_DOMAIN=xxxx<br>
DATABASE_URL=xxxx<br>
PROJECT_ID=xxxx<br>
MESSAGE_SENDER_ID=xxxx<br>
APP_ID=xxxx<br>
STORAGE_BUCKET=xxxx<br>

Replace [YOUR GOOGLE PLACES API KEY] with your actual API key in components/SuggestionScreen.js

Run `npm install` in your command line to install dependencies in the local node_modules folder.

Run `expo start` in your command line to start the app.

## Contributers

- [Jun Cai](https://github.com/JIAJUNATBCIT "Jun's Github")
- [Josh Wong](https://github.com/jtw10 "Josh's Github")
- [Niku You](https://github.com/NikuYou "Niku's Github")
