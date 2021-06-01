const baseURL = 'http://localhost:8888';


// invoke this function when the page loads:
const moodChoice = (mood) => {
    document.getElementById('save').value = mood;
}

const postMood = (ev) => {
    console.log(ev);
    if(document.getElementById('save').value){
        const newSnap = {
            userid: document.getElementById('userId').innerHTML,
            tracks: [document.getElementById('trackOne').innerHTML,
                document.getElementById('trackTwo').innerHTML,
                document.getElementById('trackThree').innerHTML,
                document.getElementById('trackFour').innerHTML,
                document.getElementById('trackFive').innerHTML
            ],
            artists: [document.getElementById('artOne').innerHTML],
            mood: document.getElementById('save').value
        };
    
    /* const newMood = {
        mood: document.getElementById('happy').value
    };
    console.log(document.getElementById('happy').value); */
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
