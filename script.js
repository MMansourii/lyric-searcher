const form = document.getElementById('form');
const search = document.getElementById('search');
const results = document.getElementById('results');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';


//serach song by artist or song name
async function searchSongs(term){

        // fetch(`${apiURL}/suggest/${term}`)
        // .then(res => res.json())
        // .then(data => {
        //     console.log(data);
        // });

        //preferable way to fetch the api becaude it's neater
        const res = await fetch(`${apiURL}/suggest/${term}`);
        const data =await res.json();

        showData(data);
}
//insert data to DOM
function showData(data){
                // let output = '';
                // data.data.forEach(song => {
                //     output +=`
                //     <li>
                //     <span><strong>${song.artist.name}</strong>-${song.title}</span>
                //     <button class='btn' data-artist='${song.artist.name}'  data-song-title='${song.title}'> Get Lyrics</button>
                //     </li>
                //     `;
                // });
                // results.innerHTML=`
                // <ul class='songs'>
                // ${output}
                // </ul>`;

    //easy way by map()
    results.innerHTML=`
    <ul class='songs'>
    ${data.data
        .map(
            song =>
        `
        <li>
        <span><strong>${song.artist.name}</strong>-${song.title}</span>
        <button class='btn' data-artist='${song.artist.name}'  data-song-title='${song.title}'> Get Lyrics</button>
        </li>
       `
    ).join('')}
    </ul>
    `;

    if(data.prev || data.next)
    {
        more.innerHTML = 
        `
        ${data.prev 
            ? `<button class='btn' onclick="getMoreSongs('${data.prev}')" >Prev</button>` 
            : ''}
        ${data.next 
            ? `<button class='btn' onclick="getMoreSongs('${data.next}')">Next</button>` 
            : ''}
        `;
    }
    else{
        more.innerHTML = '';
    }
}

//get more song by next and prev button
async function getMoreSongs(url) {
        const res = await fetch('https://cors-anywhere.herokuapp.com/' + url);
        const data =await res.json();
        showData(data);    
}
//get the lyrics
async function  getLyrics(artist,songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data =await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');

    results.innerHTML=`
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span> `;

    more.innerHTML='';
}
  

//event listener    
form.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm){
        alert('Please enter the song  or artist name ');
    }else{
        searchSongs(searchTerm);
    }
});
results.addEventListener('click', e =>{
    const clickEl = e.target ;
    if(clickEl.tagName === 'BUTTON'){
        const artist = clickEl.getAttribute('data-artist');
        const songTitle = clickEl.getAttribute('data-song-title');

        getLyrics(artist,songTitle);
    }
});