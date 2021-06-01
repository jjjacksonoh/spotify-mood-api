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
        /* console.log(req.body);
        res.status(200).send(
            req.body);
        }); */

module.exports = router;