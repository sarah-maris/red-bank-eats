# Red Bank Eats

---

## Project Purpose:

This app provides a listing of Restaurants in Red Bank, New Jersey. The project was built for the Udacity Front End Nanodegree Program. The purpose of the project is to demonstrate understanding of the basic structure and operation of a React-based app.

The map is generated by the Google Maps API. The list of restaurants is generated by a call to the Foursquare API Search endpoint. A second API request is made when a location is clicked to get details about the restaurant, including address, phone, price point, user tip and an image. A link to the restaurant's Foursquare page is provided for more information.

## How to Load the App in Development Mode

The project uses Node.js and the Create-React-App starter. If you do not have Node >= 6.x installed, you can download it here: [Node.js](https://nodejs.org/en/)

Once Node is installed, navigate to the directory where you want to store the app

```
git clone https://github.com/sarah-maris/reactnd-project-myreads.git
npm install
```

Once all of the dependencies have been installed you can launch the app with

```
npm start
```

A new browser window should automatically open displaying the app. If it doesn't, navigate to [http://localhost:3000/](http://localhost:3000/) in your browser

**_NOTE:_** _The service workers for this app will only cache the site when it is in production mode._

## How to Load the App in Production Mode

You can run a hosted version of the app at **[redbankeats.surge.sh](https://redbankeats.surge.sh/)**

![Red Bank Eats screenshot](src/images/red-bank-eats-screenshot.jpg?raw=true)

To run the app in production mode locally run:

```
npm run build
```

Navigate to the `build` directory and run a localhost server. If you have Python 2.x installed you can run the Python Simple Server like this.

```
python -m SimpleHTTPServer 8080
```

For Python 3.x, the command is:

```
-m http.server 8080
```

In either case navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Or if you prefer you can use Node [serve](https://github.com/zeit/serve). If you do not have it installed you can install it with:

```
npm install -g serve
```

and then navigate into the build directory and run

```
serve -s
```

In this case the site will be hosted at [http://localhost:5000](http://localhost:5000)

You can confirm that the service worker is registered with this message in the console

![Service worker message](https://github.com/sarah-maris/react-neighborhood-map/raw/master/src/images/confirm-service-worker.png)

react-neighborhood-map/src/images/foursquare-button.png

or in the Applications tab of Dev Tools:

![Service worker in Applications tab](https://github.com/sarah-maris/react-neighborhood-map/raw/master/src/images/confirm-service-worker2.png)

## Adding required Foursquare and Google Maps credentials

The app will not run until you add Foursquare and Google Map keys to the project. They should be stored in the `credentials.js` file in the `data` folder. See sample at `data.credentials-sample.js.

### Foursquare

You can get the Foursquare API keys by signing up for a free personal account here: **[Foursquare Developers Sign-up](https://foursquare.com/developers/signup)**

Log-in and click "Create a new app". Paste the _Client ID_ and _Client Secret_ keys in `credentials.js`

### Google Maps

To get a Google Maps API key follow the directions here: **[Google Maps:
Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)**.

Choose the Maps platform and enable "Google Maps Platform". To protect your API from unwanted usage make sure you add an Allowed Referred (e.g. `localhost`) in the API console.

## How to Use the App

- The app will load displaying a map of Red Bank with markers for each restaurant and a list of restaurants in the sidebar
- Click on a map marker or name on the restaurant list to get details about each restaurant

### Resources and Documentation:

- [Create-react-app Documentation](https://github.com/facebookincubator/create-react-app)
- [React API](https://facebook.github.io/react/docs/react-api.html)
- [stackoverflow: How to load the Google Maps API script in my React app](https://stackoverflow.com/questions/41709765/how-to-load-the-google-maps-api-script-in-my-react-app-only-when-it-is-require)
- [React-script-loader](https://www.npmjs.com/package/react-async-script-loader)
- [SVG-Loaders by Sam Herber](https://github.com/SamHerbert/SVG-Loaders)
- [CSS Tricks: Styling Texty Inputs](https://css-tricks.com/styling-texty-inputs-only/)
- [CSS Tricks: Custom Scrollbars in WebKit](https://css-tricks.com/custom-scrollbars-in-webkit/)
- [Foursquare API - Venue Search](https://developer.foursquare.com/docs/api/venues/search)
- [Foursquare API - Venue Details](https://developer.foursquare.com/docs/api/venues/details)
- [Restaurant Icon](http://www.pvhc.net/Food-Restaurant-Icon20rrectdjo/)
- [Map styling](http://www.mapstylr.com/map-style-editor/)

### Udacity Resources:

- [Project Rubric](https://review.udacity.com/#!/rubrics/1351/view)
- [Udacity CSS Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/css.html)
- [Udacity HTML Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/index.html)
- [Udacity JavaScript Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)
- [Udacity Responsive Web Design Fundamentals Course > Pattern - Off Canvas lesson](https://classroom.udacity.com/courses/ud893/lessons/3561069759/concepts/35307193050923)

_This project is licensed under the terms of the MIT license._
