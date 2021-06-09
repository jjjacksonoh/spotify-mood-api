"use strict";

const express = require("express");
const router = express.Router();
const Snapshot = require("./snapshot")

router.route("/savesnapshot")
    .post((req, res) => {
        const newSnap = req.body;
        Snapshot.create(newSnap).save()
            .then(snap => {
                res.status(201).send(snap)
            })
        });

router.route("/user/:userid")
        .get((req,res) => {
            console.log(`GET /user/${req.params.userid}`);
            const user = req.params["userid"];
            var artists = []
            var tracks = []
            var arTrack = []
            Snapshot.find({"userid": user})
                .then(snapshot => {
                    for(var i=0;i<snapshot.length;i++){
                        for(var j=0; j<5; j++){
                            artists.push([snapshot[i].artists[j].artist,snapshot[i].artists[j].id])
                            tracks.push([snapshot[i].tracks[j].track,snapshot[i].tracks[j].id])
                        }
                    }
                    /* artists = artists.flat()
                    artists = [...new Set(artists)]
                    tracks = tracks.flat()
                    tracks = [...new Set(tracks)] */
                    const artTrack = [artists,tracks]
                    console.log(artTrack);
                    res.status(201).send(artTrack)
                })
        })

        .post((req,res) => {
            console.log(`POST /user/${req.params.userid}`);
            const searchTerm = req.body.searchTerm;
            console.log('working')
            //res.status(200).send(req.body);
            const user = req.params["userid"];
            var artists = []
            var tracks = []
            Snapshot.find({"userid": user})
                .then(snapshot => {
                    for(var i=0;i<snapshot.length;i++){
                        for(var j=0; j<5; j++){
                            artists.push(snapshot[i].artists[j].artist)
                            tracks.push(snapshot[i].tracks[j].track)
                        }
                    }
                    /* console.log(artists)
                    console.log(tracks) */
                   /*  artists = artists.flat()
                    artists = [...new Set(artists)]
                    tracks = tracks.flat()
                    tracks = [...new Set(tracks)] */
                    //var artTrack;

                    //if(artists.includes(searchTerm)){
                    if(artists.find(element => element.toLowerCase() === searchTerm.toLowerCase())) {
                        console.log('Artist: ' + searchTerm);
                        /* document.getElementById('searchResult').innerHTML = `
                            <h1>Mood for the artist ${searchTerm}</h1>` */
                    } else if (tracks.find(element => element.toLowerCase() === searchTerm.toLowerCase())){
                        console.log('Track: ' + searchTerm)
                        /* document.getElementById('searchResult').innerHTML = `
                            <h1>Mood for the song ${searchTerm}</h1>` */
                    } else {
                        console.log('Not found');
                        /* document.getElementById('searchResult').innerHTML = `
                            <h1>Mood for ${searchTerm} does not exist :(</h1>` */
                    }
                    res.status(200).send(req.body) 
                })
                .catch(err => {
                    console.log(err);
                })
        })

router.route("/artist/:artistid")
    .get((req,res) => {
        console.log(`GET /artist/${req.params.artistid}`)
        const artistid = req.params["artistid"];
        console.log(artistid)
        Snapshot.find({"artists.id": artistid})
            .then(snapshot => {
                console.log(snapshot)
                res.status(201).send(snapshot)
            })
            .catch(err => {
                console.log(err)
            })
    })

router.route("/track/:trackid")
    .get((req,res) => {
        console.log(`GET /track/${req.params.trackid}`)
        const trackid = req.params["trackid"];
        Snapshot.find({"track.id": trackid})
            .then(snapshot => {
                console.log(snapshot)
                res.status(201).send(snapshot)
            })
            .catch(err => {
                console.log(err)
            })
    })
module.exports = router;