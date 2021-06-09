const baseURL = 'http://localhost:8888';

var artists = [];
var tracks = [];
var artist;
var track;

const moodChoice = (mood) => {
    document.getElementById('save').value = mood;
}

const postMood = (ev) => {
    console.log(ev);
    if(document.getElementById('save').value){
/*         console.log(document.getElementById('userId').innerHTML);
 */        const newSnap = {
            userid: document.getElementById('userId').innerHTML,
            /* test: [{track: document.getElementById('trackOne').innerHTML, 
                id: document.getElementById('trId1').innerHTML}], */
            tracks: [ 
                {track: document.getElementById('trackOne').innerHTML, id: document.getElementById('trId1').innerHTML},
                {track: document.getElementById('trackTwo').innerHTML, id: document.getElementById('trId2').innerHTML},
                {track: document.getElementById('trackThree').innerHTML, id: document.getElementById('trId3').innerHTML},
                {track: document.getElementById('trackFour').innerHTML, id: document.getElementById('trId4').innerHTML},
                {track: document.getElementById('trackFive').innerHTML, id: document.getElementById('trId5').innerHTML}
            ],
            artists: [
                    {artist: document.getElementById('artOne').innerHTML, id: document.getElementById('arId1').innerHTML},
                    {artist: document.getElementById('artTwo').innerHTML, id: document.getElementById('arId2').innerHTML},
                    {artist: document.getElementById('artThree').innerHTML, id: document.getElementById('arId3').innerHTML},
                    {artist: document.getElementById('artFour').innerHTML, id: document.getElementById('arId4').innerHTML},
                    {artist: document.getElementById('artFive').innerHTML, id: document.getElementById('arId5').innerHTML},
                ],
            mood: document.getElementById('save').value
        };
    
        fetch(`${baseURL}/savesnapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSnap)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        return false
    }
    //ev.preventDefault()
    return false
}

const doFilter = (ev) => {
    const userid = document.getElementById('userId').innerHTML;
    ev.preventDefault();
    fetch(`${baseURL}/user/${userid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            artists = data[0];
            tracks = data[1];
        })
        .then( () => {
            return fetch(`${baseURL}/user/${userid}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({searchTerm : document.getElementById('search').value})

                })
            })
        .then(response => response.json())
        .then(data => {
            const searchTerm = data.searchTerm
            console.log(searchTerm)
            if(artists.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())) {
                artist = artists.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())
                console.log('Artist: ' + artist[0]);
                document.getElementById('searchResult').innerHTML = `
                    <h1>Mood for the artist ${artist[0]}</h1>`
                //console.log(artist)
                moodScoreCalc(artist[1],'artist');
            } else if (tracks.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())){
                track = tracks.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())
                console.log('Track: ' + track[0])
                document.getElementById('searchResult').innerHTML = `
                    <h1>Mood for the song ${track[0]}</h1>`
                moodScoreCalc(track[1],'track');
            } else {
                console.log('Not found');
                document.getElementById('searchResult').innerHTML = `
                    <h1>Mood for ${searchTerm} does not exist :(</h1>`
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const moodScoreCalc = (search, artTrack) => {
    if(artTrack === 'artist'){
        fetch(`${baseURL}/artist/${search}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                var score = 0
                for(var i=0; i < data.length; i++){
                    if(data[i].mood === "happy"){
                        score += 1
                    } else if(data[i].mood === "sad"){
                        score -= 1
                    }
                }
                console.log(score);
            });
    } else {
        fetch(`${baseURL}/track/${search}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                var score = 0
                for(var i=0; i < data.length; i++){
                    if(data[i].mood === "happy"){
                        score += 1
                    } else if(data[i].mood === "sad"){
                        score -= 1
                    }
                }
                console.log(score)
            });
        }
    }
document.querySelector('#filter').onclick = doFilter;
