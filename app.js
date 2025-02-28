require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index')
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            const findArtists = data.body.artists.items;
            console.log(findArtists)
            res.render('artist-search-results', { findArtists })
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            const findAlbum = data.body.items;
            console.log(findAlbum)
            res.render('albums', { findAlbum })
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err))
})

app.get('/track/:trackId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then((data) => {
            const findTrack = data.body.items
            console.log(findTrack)
            res.render('tracks', { findTrack })
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
