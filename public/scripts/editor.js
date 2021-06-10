const baseURL = '';

var artists = [];
var tracks = [];
var artist;
var track;
var artTrack;
var userMood;
var dbMood = 0;

const moodChoice = (mood) => {
    document.getElementById('save').value = mood;
}

const postMood = (ev) => {
    console.log(ev);
    //if(document.getElementById('save').value){
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
            mood: inputRange.value//document.getElementById('save').value
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
    /* }
    //ev.preventDefault()
    return false */
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
                artTrack = 'artist';
                console.log('Artist: ' + artist[0]);
/*                 moodScoreCalc(artist[1],'artist');
 */             document.getElementById('searchResult').style.display = 'block';
                document.getElementById('userInfo').style.display = 'none';
                document.getElementById('searchResult').innerHTML = `
                    <h1>Mood for the artist ${artist[0]}</h1>`

                //console.log(artist)
            } else if (tracks.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())){
                track = tracks.find(element => element[0].toLowerCase() === searchTerm.toLowerCase())
                console.log('Track: ' + track[0])
                artTrack = 'track'
/*                 userMood = moodScoreCalc(track[1],'track');
 */             document.getElementById('searchResult').style.display = 'block';
                document.getElementById('userInfo').style.display = 'none';
                document.getElementById('searchResult').innerHTML = `
                    <h1>Data for the song ${track[0]}</h1>`
                
            } else {
                console.log('Not found');
                document.getElementById('searchResult').innerHTML = `
                    <h1>Data for ${searchTerm} does not exist :(</h1>`
            }
        })
        .then( () => {
            if(artTrack === 'artist'){
                console.log('yes')
                moodScoreCalc(artist[1],'artist')
            } else {
                moodScoreCalc(track[1],'track')
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
                    score += data[i].mood
                }
                score /= data.length;
                userMood = score
            })
            .then( () => {
                var rainbow = new Rainbow();
                rainbow.setSpectrum('blue','purple','red')
                document.getElementById('searchResult').innerHTML += `
                    <div class="square" style="background-color: #${rainbow.colorAt(userMood)};"></div>`
            });
    } else {
        fetch(`${baseURL}/track/${search}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                var score = 0
                for(var i=0; i < data.length; i++){
                    score += data[i].mood
                }
                score /= data.length;
                userMood = score
            })
            .then( () => {
                var rainbow = new Rainbow();
                rainbow.setSpectrum('blue','purple','red')
                document.getElementById('searchResult').innerHTML += `
                    <div class="square" style="background-color: #${rainbow.colorAt(userMood)};"></div>`
            });
        }
    }
document.querySelector('#filter').onclick = doFilter;

var inputRange = document.getElementsByClassName('range')[0],
    maxValue = 100, // the higher the smoother when dragging
    speed = 5,
    currValue, rafID;

// set min/max value
inputRange.min = 0;
inputRange.max = maxValue;

// listen for unlock
function unlockStartHandler() {
    // clear raf if trying again
    //window.cancelAnimationFrame(rafID);
    
    // set to desired value
    currValue = +this.value;
}

/* function unlockEndHandler() {
    
    // store current value
    currValue = +this.value;
    
    // determine if we have reached success or not
    if(currValue >= maxValue) {
        successHandler();
    }
    else {
        rafID = window.requestAnimationFrame(animateHandler);
    }
} */

// handle range animation
function animateHandler() {

    // calculate gradient transition
    var transX = currValue - maxValue;
    
    // update input range
    inputRange.value = currValue;

    //Change slide thumb color on mouse up
    if (currValue < 20) {
        inputRange.classList.remove('ltpurple');
    }
    if (currValue < 40) {
        inputRange.classList.remove('purple');
    }
    if (currValue < 60) {
        inputRange.classList.remove('pink');
    }
    
    // determine if we need to continue
    if(currValue > -1) {
      window.requestAnimationFrame(animateHandler);   
    }
    
    // decrement value
    currValue = currValue - speed;
}

// handle successful unlock
/* function successHandler() {
  alert('Unlocked');
}; */

// bind events
inputRange.addEventListener('mousedown', unlockStartHandler, false);
inputRange.addEventListener('mousestart', unlockStartHandler, false);
/* inputRange.addEventListener('mouseup', unlockEndHandler, false);
inputRange.addEventListener('touchend', unlockEndHandler, false); */

// move gradient
inputRange.addEventListener('input', function() {
    //Change slide thumb color on way up
    if (this.value > 20) {
        inputRange.classList.add('ltpurple');
    }
    if (this.value > 40) {
        inputRange.classList.add('purple');
    }
    if (this.value > 60) {
        inputRange.classList.add('pink');
    }

    //Change slide thumb color on way down
    if (this.value < 20) {
        inputRange.classList.remove('ltpurple');
    }
    if (this.value < 40) {
        inputRange.classList.remove('purple');
    }
    if (this.value < 60) {
        inputRange.classList.remove('pink');
    }
});



function Rainbow()
{
	"use strict";
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
		return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	"use strict";
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	function formatHex(hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var name = string.toLowerCase();
			if (colourNames.hasOwnProperty(name)) {
				return colourNames[name];
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
	
	// Extended list of CSS colornames s taken from
	// http://www.w3.org/TR/css3-color/#svg-color
	var colourNames = {
		aliceblue: "F0F8FF",
		antiquewhite: "FAEBD7",
		aqua: "00FFFF",
		aquamarine: "7FFFD4",
		azure: "F0FFFF",
		beige: "F5F5DC",
		bisque: "FFE4C4",
		black: "000000",
		blanchedalmond: "FFEBCD",
		blue: "0000FF",
		blueviolet: "8A2BE2",
		brown: "A52A2A",
		burlywood: "DEB887",
		cadetblue: "5F9EA0",
		chartreuse: "7FFF00",
		chocolate: "D2691E",
		coral: "FF7F50",
		cornflowerblue: "6495ED",
		cornsilk: "FFF8DC",
		crimson: "DC143C",
		cyan: "00FFFF",
		darkblue: "00008B",
		darkcyan: "008B8B",
		darkgoldenrod: "B8860B",
		darkgray: "A9A9A9",
		darkgreen: "006400",
		darkgrey: "A9A9A9",
		darkkhaki: "BDB76B",
		darkmagenta: "8B008B",
		darkolivegreen: "556B2F",
		darkorange: "FF8C00",
		darkorchid: "9932CC",
		darkred: "8B0000",
		darksalmon: "E9967A",
		darkseagreen: "8FBC8F",
		darkslateblue: "483D8B",
		darkslategray: "2F4F4F",
		darkslategrey: "2F4F4F",
		darkturquoise: "00CED1",
		darkviolet: "9400D3",
		deeppink: "FF1493",
		deepskyblue: "00BFFF",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1E90FF",
		firebrick: "B22222",
		floralwhite: "FFFAF0",
		forestgreen: "228B22",
		fuchsia: "FF00FF",
		gainsboro: "DCDCDC",
		ghostwhite: "F8F8FF",
		gold: "FFD700",
		goldenrod: "DAA520",
		gray: "808080",
		green: "008000",
		greenyellow: "ADFF2F",
		grey: "808080",
		honeydew: "F0FFF0",
		hotpink: "FF69B4",
		indianred: "CD5C5C",
		indigo: "4B0082",
		ivory: "FFFFF0",
		khaki: "F0E68C",
		lavender: "E6E6FA",
		lavenderblush: "FFF0F5",
		lawngreen: "7CFC00",
		lemonchiffon: "FFFACD",
		lightblue: "ADD8E6",
		lightcoral: "F08080",
		lightcyan: "E0FFFF",
		lightgoldenrodyellow: "FAFAD2",
		lightgray: "D3D3D3",
		lightgreen: "90EE90",
		lightgrey: "D3D3D3",
		lightpink: "FFB6C1",
		lightsalmon: "FFA07A",
		lightseagreen: "20B2AA",
		lightskyblue: "87CEFA",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "B0C4DE",
		lightyellow: "FFFFE0",
		lime: "00FF00",
		limegreen: "32CD32",
		linen: "FAF0E6",
		magenta: "FF00FF",
		maroon: "800000",
		mediumaquamarine: "66CDAA",
		mediumblue: "0000CD",
		mediumorchid: "BA55D3",
		mediumpurple: "9370DB",
		mediumseagreen: "3CB371",
		mediumslateblue: "7B68EE",
		mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC",
		mediumvioletred: "C71585",
		midnightblue: "191970",
		mintcream: "F5FFFA",
		mistyrose: "FFE4E1",
		moccasin: "FFE4B5",
		navajowhite: "FFDEAD",
		navy: "000080",
		oldlace: "FDF5E6",
		olive: "808000",
		olivedrab: "6B8E23",
		orange: "FFA500",
		orangered: "FF4500",
		orchid: "DA70D6",
		palegoldenrod: "EEE8AA",
		palegreen: "98FB98",
		paleturquoise: "AFEEEE",
		palevioletred: "DB7093",
		papayawhip: "FFEFD5",
		peachpuff: "FFDAB9",
		peru: "CD853F",
		pink: "FFC0CB",
		plum: "DDA0DD",
		powderblue: "B0E0E6",
		purple: "800080",
		red: "FF0000",
		rosybrown: "BC8F8F",
		royalblue: "4169E1",
		saddlebrown: "8B4513",
		salmon: "FA8072",
		sandybrown: "F4A460",
		seagreen: "2E8B57",
		seashell: "FFF5EE",
		sienna: "A0522D",
		silver: "C0C0C0",
		skyblue: "87CEEB",
		slateblue: "6A5ACD",
		slategray: "708090",
		slategrey: "708090",
		snow: "FFFAFA",
		springgreen: "00FF7F",
		steelblue: "4682B4",
		tan: "D2B48C",
		teal: "008080",
		thistle: "D8BFD8",
		tomato: "FF6347",
		turquoise: "40E0D0",
		violet: "EE82EE",
		wheat: "F5DEB3",
		white: "FFFFFF",
		whitesmoke: "F5F5F5",
		yellow: "FFFF00",
		yellowgreen: "9ACD32"
	}
}

if (typeof module !== 'undefined') {
  module.exports = Rainbow;
}