import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", (request, response) => {
    let { image_url } = request.query;
    if( !image_url ){
      return response.status(400).send("Request is not proper, image_url is missing")
    }
    filterImageFromURL(image_url)
            .then(function(output){
              response.status(200).sendFile(output)
              response.on('finish', () => deleteLocalFiles([output]));
            }).catch(function(exception){
              response.status(exception.status).send(exception.message)
            });

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();