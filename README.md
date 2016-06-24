<center>
## Retail Commissioning UI ![alt text](https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_tablet_mac_black_24px.svg)
</center>


The Retail Commissioning UI project is the frontend build used commission and manage Ssbts. It's built with React, Immutable.js and webpack.

<center>
### Setup
<hr />
</center>

- `git clone git@gitlab.williamhill-dev.local:retail/retail-commissioning-ui.git`
- `cd retail-commissioning-ui`
- `npm i`
- `npm start`

The project uses webpack to transpile all React components and es6 modules. By running `npm start` a development server will deploy the project to `http://localhost:8080`. Webpack will live reload the browser when ever your code changes.

To create a build of Helios, run `npm run build`. This will deploy your assets to the `/dist` directory.

By default `npm start` attempts to reverse proxy API requests by assuming you're running RCS as a docker container locally on port 9888. If you wish to point to RSD at a different location you will need to set the `REMOTE_API_URI` environment variable:

```
REMOTE_API_URI=http://api:8888 npm run start
```

<center>
### Docker
<hr />
</center>

The project comes with a docker-compose.yml file that will create the full stack needed for the UI to work. It copies from the `dist/` directory so you will need to build the project before running compose.

```
npm run build
docker-compose build
docker-compose up
```

<center>
### npm scripts
<hr />
</center>

- `npm test` - Runs Karma tests
- `npm start` - Runs the local development server, automatically rebuilds scss on change.
- `npm run lint` - runs eslint
- `npm run build` - Build deployable files
- `npm run deploy` - Build, create and push docker image
- `npm run test:watch` - Runs Karma tests and watches for changes