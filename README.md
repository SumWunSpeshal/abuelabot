# abuelabot
A general purpose Discord bot. Abuela's main features revolve around displaying data from various REST APIs, 
scheduled messages with cron, manipulating text input from the user in a hopefully entertaining manner 
and even some basic audio capabilities. The main instance is currently being hosted on a Heroku dyno.

Just as a heads up: I am most likely going to rewrite the commands to use Discord's `slash command` instead, 
as soon as `discord.ts` releases the new decorators on master.

---

Setup
-
- Duplicate the `.example.env` file and rename the duplicate to `.env`. Assign a valid value to every one of the environment variables. 
  These are mostly bot settings and API keys. All variables are required.
  - `.env` requires you to specify two bot tokens. This is for switching between the main instance of Abuela and a dev instance for development.
    Toggle between the two by specifying either `ENV=DEV` or `ENV=PROD`. Make sure that your production environment only uses `ENV=PROD`.
    

- Run `npm install` to install all the necessary dependencies
  - TypeScript and ts-node will be your bread and butter for this project and will get installed locally with the previously mentioned `npm install`. 
    I still recommend installing these two globally with `npm install -g typescript ts-node` if you haven't already.
    

- Run `npm run watch` for TypeScript compilation with live reloading.

---

Gotchas 
-
- Don't get fooled by the `/dist` directory. It is only being used for TypeScript pre-compilation with `tsc`. 
  However, this is neither required for production, nor for local development. 
  Feel free to find a use case for pre-compilation if you really need to.
- The property `commandName` in the `CommandMessage` object passed by the `@Command()` decorator does not reliably return the current `commandName`. 
  There seems to be an issue with the library.
  
---

Special credits go out to https://github.com/OwenCalvin/discord.ts for this nifty discord.js wrapper.


*A project by YourTeaGuy, SumWunSpeshal and Monsieur-Monet.*
