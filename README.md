# Web Push Notifications using React, Fastify, GraphQL and Firebase Cloud Messaging

This example represents a nice illustration of sending and receiving web push notifications using Firebase Cloud Messaging.

## Composition of this project

This example consists of 3 parts which are as follows:

1.  A GraphQL API send web push notifications to profiles using the Firebase Admin SDK
2.  A small front-end application that allows you to customize your user profile in which you will receive web push notifications afterwards
    ![Front-end App](/readme.front.png)

3.  A small front-end application that allows user profiles to be notified via web push notifications
    ![Admin Notifier App](/readme.front.png)

## First for all

This example requires prior creation of a Firebase project and the activation of the [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) service by creating a new web application on your dashboard console.

## Getting Started

Firstly you will need to install the dependencies on the project by running the command below on the root [directory](/), the [front](/front) folder and the [admin](/admin) folder.

```
    npm i
```

Secondly you must ensure that the three files containing the environment variables have been correctly filled:

1.  .env file of the [API](/.env)
2.  .env.local file of the [front](/front/.env.local) application
3.  .env.local file of the [admin](/admin/.env.local) application

> **Important**: please look at the `VARIABLES.md` files for each part of this example to be able to fill the environment variables with appropriate values.

Third, you must configure the [service worker](/front/public/firebase-messaging-sw.js) responsible for managing web push notifications in background mode.

> **For information**: the firebase configuration on the worker must be hardcoded (please don't use React environment variables like `process.env.REACT_APP_*`)

Finally, to be able to launch the stack in this example, simply run the command below on the 3 parts of this project:

```
npm start
```

## Start the stack using the Docker Compose

If you are familiar with Docker, you can also run this example using docker compose.

You must ensure that the three files containing the environment variables have been correctly filled:

1.  .env.prod file of the [API](/.env.prod)
2.  .env.prod file of the [front](/front/.env.prod) application
3.  .env.prod file of the [admin](/admin/.env.prod) application

You will need to run this command to start the example locally with Docker Compose:

```
    npm run compose:start
```

To stop the containers you just have to run the command below:

```
    npm run compose:stop
```
