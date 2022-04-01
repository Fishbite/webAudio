/* assets.js */
/*
The `assets` object is the central storehouse for 
all the games assets: images, sounds, fonts, 
ordinary JSON data and JSON data that represents
 a texture atlas.

 The `assets` object has a `load()` method that
 accepts one argument: an array of filename strings.

 List all the names of the files you want to load,
 with their complete path in the array.

 The load method returns a `Promise  when all assets
 have loaded, so we can the call a setup function to
 initialise the game whne everything is ready.

 Here's how we might use the `load` method:

 assets.load([
     "./images/cat.png",
     "./fonts/puzzler.otf",
     "./json/data.json"
 ]).then(() => setup() {
     // intitialise the game
 })

 The `setup` function will only run after all the
 assets have loaded. We can then access any asset
 anywhere in the main program using this syntax:

    let catImage = assets["./images/cat.png"]

*/

// We need to import the makeSound function
// for the loadSound() file loader to work
import { makeSound } from "../lib/sound.js";

// ****** the assets object ******

export let assets = {
  // props to help track the assets being loaded
  toLoad: 0,
  loaded: 0,

  // file extensions for different types of assets
  imageExtensions: ["png", "jpg", "gif", "svg"],
  fontExtensions: ["ttf", "otf", "ttc", "woff"],
  jsonExtensions: ["json"],
  audioExtensions: ["mp3", "ogg", "wav", "webm"],

  // the `load` method creates and loads all assets
  load(sources) {
    // return a Promise when everrything is loaded
    return new Promise((resolve) => {
      // the `loadHandler` resolves the Promise
      // when everything has been loaded
      let loadHandler = () => {
        this.loaded += 1;
        console.log(this.loaded);

        // check if everything has loaded
        if (this.toLoad == this.loaded) {
          // reset vars loaded & toLoad
          this.toLoad = 0;
          this.loaded = 0;
          console.log("Assets finished loading");

          // Resolve the Promise
          resolve();
        }
      };

      // message to confirm assets are being loaded
      console.log("Loading assets...");

      // find number of files that need to be loaded
      this.toLoad = sources.length;

      // loop through all the source filenames and
      // find out how they should be interpreted
      sources.forEach((source) => {
        // find the file extension of the asset
        let extension = source.split(".").pop();

        // load images that have matching extensions
        // in the imageExtensions array
        if (this.imageExtensions.indexOf(extension) !== -1) {
          this.loadImage(source, loadHandler);

          // load fonts
        } else if (this.fontExtensions.indexOf(extension) !== -1) {
          this.loadFont(source, loadHandler);

          // load JSON files
        } else if (this.jsonExtensions.indexOf(extension) !== -1) {
          this.loadJson(source, loadHandler);

          // load audio
        } else if (this.audioExtensions.indexOf(extension) !== -1) {
          this.loadSound(source, loadHandler);
        } else {
          // display Arse!
          console.log(`File type not recognized: ${source}`);
        }
      });
    });
  },

  // file loaders

  // load images
  loadImage(source, loadHandler) {
    // create a new image and call the loadHandler
    // when the file has loaded
    let image = new Image();
    image.addEventListener("load", loadHandler, false);

    // assign the image as a property of the
    // `assets` object so we can access it like:
    // `assets[./images/image.png]`
    this[source] = image;
    console.log("image =", image);

    //Set the image's `src` prop' to start loading
    //the image
    image.src = source;
  },

  // Load fonts
  loadFont(source, loadHandler) {
    //Use the font's filename as the `fontfamily` name
    let fontfamily = source.split("/").pop().split(".")[0];
    console.log("fontFamily:", fontfamily);

    // Append an `@font-face` style rule to the head
    // of the HTML document
    let newStyle = document.createElement("style");

    /* use this if the re-write below fails
    let fontFace =
      "@font-face {font-family: '" +
      fontFamily +
      "'; src: url('" +
      source +
      "');}";
      */

    let fontFace = `@font-face {font-family: ${fontfamily}; src: url("${source}")}`;
    newStyle.appendChild(document.createTextNode(fontFace));
    document.head.appendChild(newStyle);
    console.log("fontFace:", fontFace);

    // tell the loadHandler we're loading a font
    loadHandler();
  },

  // load json files
  loadJson(source, loadHandler) {
    // create a new `xhr` object and an object
    // to store the file
    let xhr = new XMLHttpRequest();

    // uses xhr to load the JSON file
    xhr.open("GET", source, true);

    // tell xhr it's a text file
    xhr.responseType = "text";

    // create an `onload` callback that will handle
    // the file loading

    xhr.onload = (event) => {
      // check status to make sure the file has
      // loaded correctly
      if (xhr.status === 200) {
        // convert the JSON data file into an ordinary object
        let file = JSON.parse(xhr.responseText);

        // get the filename
        file.name = source;
        console.log("file.name:", source);
        console.log(file);

        // texture atlas support
        // if the JSON file has a `frames` property then
        // it's in Texture Packer format
        if (file.frames) {
          // create the tileset frames
          this.createTilesetFrames(file, source, loadHandler);
        } else {
          // alert the load handler that the file has loaded
          loadHandler();
        }
      }
    };

    // send the request to load the file
    xhr.send();
  },
  createTilesetFrames(file, source, loadHandler) {
    // get the tileset image's file path
    let baseUrl = source.replace(/[^\/]*$/, "");
    console.log("baseUrl", baseUrl);

    // use the `baseUrl` and the `image` name property
    // from the JSON file's `meta` object to construct
    // the full image source path
    let imageSource = baseUrl + file.meta.image;
    console.log("imageSource:", imageSource);

    // the image's load handler
    let imageLoadHandler = () => {
      // assign the image as a property of the assets
      // object so we can access it using:
      // `this[./images/imageName.png]`
      this[imageSource] = image;

      // loop through all the frames
      Object.keys(file.frames).forEach((frame) => {
        console.log("frame:", frame);
        // the `frame` object contains all the size
        // and position data for each sub-image.
        // Add the frame data to the asset object
        // so that we can access it like this:
        // `assets[frameName.png]`
        this[frame] = file.frames[frame];

        // get a reference to the source so that it
        // will be easy for us to access it later
        this[frame].source = image;
      });

      // alert the load handler that the file has loaded
      loadHandler();
    };

    // load the tileset image
    let image = new Image();
    image.addEventListener("load", imageLoadHandler, false);
    image.src = imageSource;
  },

  // load audio
  loadSound(source, loadHandler) {
    console.log("loadSound called - see Chapter 10 for details :->");

    // create a sound object and alert theh loadHandler
    // when the sound file has loaded
    let sound = makeSound(source, loadHandler);

    // get the sound file name
    sound.name = source;

    // assign the sound as a prop of the assets object so
    // we can access it in this way `assets["../audio/sound.wav"]
    this[sound.name] = sound;
  },
};
