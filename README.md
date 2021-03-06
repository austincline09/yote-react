Yote
======

Find Your Road.

# Formatted README below

_NOTE: Grant needs to review and bring in some other things regarding https_

======

RECENT UPDATES (9/10)
Going forward, we will design Yote to work with Node v4. Up until now we haven't really standardized on a node version.
1. Install nvm (node version manager)
```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash```
2. Active it
```. ~/.nvm/nvm.sh```
3. Install node packages.
```nvm install 4.0.0```

If this works, 'node -v' should return v4.0.0. To get yote to run, I had to manually npm re-install "node-sass-middleware", but just a npm install should work.

The .nvmrc file specifies which version of node the project wants to run.

======

A simple client agnostic API framework for NodeJS.

## Dependencies
- [NodeJS version >= 4.0.0](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [MongoDB](http://www.mongodb.org/)
- [ExpressJS 4](http://expressjs.com/)
- [ReactJS](https://reactjs.com/)  -- (default web client)
- [Redux](https://redux.js.org/)  -- (client store)
- [React Router](https://github.com/reactjs/react-router)  -- (routing)
- [Webpack](http://webpack.github.io/) -- (Bundling JS)
- [Babel](https://babeljs.io/) -- (JS compiler)
- [Docker](https://www.docker.com/) -- Deployment containers

## Running Locally

To run the application locally:

1. Install all dependencies and run mongo.
2. Clone the github repo and cd into the directory.
3. Run ``` $ npm install``` to install the application's node dependencies (npm is installed alongside node).
4. Locate and copy the **secrets.js** file into the top level directory for the project.
  * This file contains the randomized session keys as well the application API keys, and is not tracked by Github.


Your folder structure should look something like this:
```
  my-project/
     |_ client/
     |_ node_modules/
     |_ public/
     |_ server/
     |_ ssl/
     .dockerignore
     .gitignore
     .nvmrc
     Dockerfile
     logger.js
     nodemon.json
     package.json
     README.md
     secrets-sample.js
     secrets.js
     webpack.config.js
     yote.js

```

Finally, to run the application you'll need to open two separate terminals. (_NOTE: this will eventually change to a single command_)

In the first terminal, run ``` $ npm run watch ```  This runs webpack in watch mode to look for and recompile any changes to the bundle.js.

In the second terminal, run ``` $ nodemon ```. This runs the node server and watches for changes.

The server will be listening on [http://localhost:3030/](http://localhost:3030/) in your browser of choice.

## Database Access
#### Local access
In your terminal simply run ``` $ mongo ``` to use the built in mongo console.

#### Remote access
On the remote instance, you can access the database by running a new mongo container and connecting to the already running database container. In the current deployment, this command would be:
```
$ (sudo) docker run -it --rm --link mongodb:mongodb library/mongo bash -c 'mongo --host mongodb'

```


## TO RUN WITH SSL IN PRODUCTION INSTANCE
```
$ (sudo) docker run -p 80:80 -p 443:443 -t -i --link mongodb:mongodb --name gsk-registry -rm -e NODE_ENV=production fugitivelabs/gsk-registry

```


## DEVELOPMENT vs PRODUCTION Environments
#### Development
**Development** is the default environment. It listens on port 3030 and ```console.log()``` logs to the console. It can be run locally with the command ```$ nodemon``` or ```$ node yote.js``` from the top level directory.

To run development environment remotely use the following command:
```
 $ (sudo) docker run -p 80:3030 -t -i  --link mongodb:mongodb --name PROJECT_NAME --rm ORG_NAME/PROJECT_NAME
```

#### Production
A **production** environment can be enabled by running ```NODE_ENV=production PORT=xxxx node yote.js```, where _xxxx_ is your desired port (like 80 on a production server). The _PORT=xxxx_ call is not necessary; it will default to 80, but this will break if that port is already in use. Running production will disable all console.log calls on the front end.

To run a production environment remotely use the following command:
```
$ (sudo) docker run -p 80:3030 -p 443:443 -t -i  --link mongodb:mongodb --name PROJECT_NAME -rm -e NODE_ENV=production ORG_NAME/PROJECT_NAME
```

## Remote Deployment
Deployment to a remote instance is easy. It requires running docker containers for Redis and MongoDB. See [docker docs](https://www.docker.com/) for more info on setting up your local docker environment.

First we need to build and push our local application to your docker instance.
#### Build and Push new instance from local machine
On your local machine, run:
```
$ docker built -t ORG_NAME/PROJECT_NAME
```
Then:
```
$ docker push ORG_NAME/PROJECT_NAME
```
Then, we need to initialize our remote instance.

#### Initialize Remote Instance

On the remote server, run the following images and link them. 

1. Pull the Mongo repository from Docker itself:
  * ``` $ (sudo) docker pull library/mongo ```
2. Start mongod with flags for smallfiles and local storage
  * ``` $ (sudo) docker run -d -v ~/data:/data/db --name mongodb library/mongo mongod --smallfiles ```
3. Start yote and link with other containers
  * ``` $ (sudo) docker run -p 80:3030 -t -i  --link mongodb:mongodb --name PROJECT_NAME --rm ORG_NAME/PROJECT_NAME ```

_Note that **PROJECT_NAME** above should be replaced with the project name_

#### New Deployments

Repeat steps above to build and push changes to docker from your local machine.

#### Update instance from remote server
On the remote instance we need to pull in the new build, stop and remove the running docker application instance, and then rerun the new build.

Run:
```
$ (sudo) docker ps
```
Note the **CONTAINER ID** of the container running the application

Next run:

```
$ (sudo) docker pull ORG_NAME/PROJECT_NAME
```

Then _stop_ the running application container:

```
$ (sudo) docker stop [CONTAINER ID]

```
Next _remove_ the running application container:

```
$ (sudo) docker rm [CONTAINER ID]
```

Now, simply rerun the application and Docker will use the most recently pulled in container instance.

```
$ (sudo) docker run -p 80:3030 -t -i --link mongodb:mongodb --name yote --rm ORG_NAME/PROJECT_NAME
```


## Extras

#### View free space on instance

``` $ df -h ```

#### Remove all unused images from docker
Docker instances will build up, taking up memory on the server.  To clear run:
```
$ (sudo) docker rmi $(sudo docker images -q -f dangling=true)
```

#Grant's notes:

TO RUN:
(in separate terminal window) 'mongod'
'npm install'
'nodemon'


DEVELOPMENT vs PRODUCTION
development is the default environment. it listens on port 3030 and console.log logs to the console. it can be run with the command "nodemon" from the top level directory.
production environment can be enabled by running "NODE_ENV=production PORT=xxxx node yote.js", where xxxx is your desired port (like 80 on a production server). The PORT=xxxx call is not necessary; it will default to 80, but this will break if that port is already in use. Running production will disable all console.log calls on the front end, which is really f-ing cool.

DOCKER DEPLOYMENT
deployment to a remote instance is easy. it requires running containers for  mongodb. on your local machine, run "docker build -t ORG_NAME/PROJECT_NAME .", then "docker push ORG_NAME/PROJECT_NAME". on the remote instance, run "docker pull ORG_NAME/PROJECT_NAME", then:

"docker run -p 80:3030 -t -i  --link mongodb:mongodb --name yote --rm ORG_NAME/PROJECT_NAME"

to run the image and link it. more details later.



1) pull library/mongo
2)  start mongod with flags for smallfiles and local storage
"docker run -d -v ~/data:/data/db --name mongodb library/mongo mongod --smallfiles"
//in future, change "~/data" to "~/mongo/data". for time being, changing this will cause loss of old data.
3) start yote and link with other containers
"docker run -p 80:3030 -t -i --link mongodb:mongodb --name yote --rm fugitivelabs/yote"

extras:
run mongo console on mongo image
"docker run -it --rm --link mongodb:mongodb library/mongo bash -c 'mongo --host mongodb'"


USING HTTPS WITH YOTE
Yote comes out of the box with support for SSL. To use, do the following:
1) generate the necessary files on your local machine. there are plenty of guides online on how to do this. you will need three files, a .key and 2 .crt.
2) create a "ssl" folder in your yote directory and copy these files there.
3) in yote.js, change the 3 lines "key: fs.readFileSync('../projectName/ssl/yourSsl.key')" near the bottom so that "projectName" matches your project folder name and "yourSsl" is the name of your key files.
4) change te "useHttps" variable to true.
Now, once you run Yote in production mode, it will allow users to connect with https. If you want to force users to ONLY connect with https, change the "httpsOptional" variable to false. (todo: put these vars in the config file)
(important note: update your docker file when you create a new project that uses https. you will need to change the folder from "/yote/*" to your project name)

TO RUN WITH HTTPS IN PRODUCTION INSTANCE
docker run -p 80:80 -p 443:443 -t -i --link mongodb:mongodb --name NAME -e NODE_ENV=production fugitive
bs/NAME

SENDING EMAILS
to send emails, use the "utilities" controller. an example of its use is users controller "requestPasswordReset" method. if you do not have a mandrill api key, the call will still return but will not send an email.

+
+more new notes (add these to yote at some point):
+view free space on instance
+"df -h"
+remove all unused images from docker (cleared ~3 gigs of disk space, related to problem with daves)
+"sudo docker rmi $(sudo docker images -q -f dangling=true)"



BACKING UP THE DATABASE
(notes for later, from Grant to Grant)

1. CREATE AND SAVE BACKUP FILES
a. on remote, create backup files
docker run -v ~/backup/:/backup/ -it --rm --link mongodb:mongodb library/mongo bash -c 'mongodump -d propatient -o /backup/ --host mongodb'

b. on local, retrieve backup files from instance
gcloud compute copy-files grantfowler@propatient:/home/grant_fugitivelabs_com/backup/propatient ./ --zone us-central1-a

2. RESTORE BACKUP FILES TO REMOTE INSTANCE
a. on remote, make sure target folder has correct permissions
b. on local, copy backup files to remote instance
gcloud compute copy-files ~/Desktop/backup/propatient grantfowler@propatient:/home/grant_fugitivelabs_com/backup/ --zone us-central1-a

c. on remote, drop database
d. on remote, restore db from backup files
docker run -v ~/backup:/backup/ -it --rm --link mongodb:mongodb library/mongo bash -c 'mongorestore -d propatient /backup/propatient/ --host mongodb'


USING THE LOGGER
the basic "console.log" functionality has been mostly replaced with winston. the new functionality is:
```
logger.debug("debug message");
logger.info("info message");
logger.warn("warn message");
logger.error("error message");
```

<!--
each will log to the console normally on dev. when env="production", though, any messages labeled "info" or "error" will also log to the file stored in "/logs/all-logs.log". you may need to create this folder yourself, as with the /ssl folder. in addition, info about each http request express receives will log into this file.
 -->


 logging to a file doesn't like working on the docker instances. in theory, we should be able to link the ~/logs volume from the host and write our logs there. in practice, i can't get this to work. so, for the time being, in production mode, any messages labeled "info" or "error" will also be saved into the mongo database with the collection name "logs". we can browse through these on the server using the standard mongo command line, or copy them all using the database backup method. while not quite as useful as a big text file, it will still work for our purposed.

using the regular "console.log" is perfectly fine for debugging stuff. for anything that we might want to keep track of, use "logger.info".
