"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SnapshotSchema = new Schema({
    userid: {
        type: Schema.Types.String,
        required: false
    },
    tracks: {
        type: [Schema.Types.String],
        required: true
    },
    artists: {
        type: [Schema.Types.String],
        required: true
    },
    mood: {
        type: Schema.Types.String,
        required: true
    },
    timeStamp: { type: Date, default: Date.now }
});

SnapshotSchema.statics.create = function(obj) {
    const Snapshot = mongoose.model("Snapshot", SnapshotSchema);
    const snapshot = new Snapshot();
    snapshot.userid = obj.userid;
    snapshot.tracks = obj.tracks;
    snapshot.artists = obj.artists;
    snapshot.mood = obj.mood;
    return snapshot;
}

module.exports = mongoose.model("Snapshot", SnapshotSchema);
