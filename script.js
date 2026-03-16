
async function loadGigs(){

const res = await fetch('gigs.json')
const gigs = await res.json()

const now = new Date()

const future = gigs.filter(g=> new Date(g.date) >= now)
future.sort((a,b)=> new Date(a.date)-new Date(b.date))

const list = document.getElementById("giglist")

future.forEach(gig=>{

const card = document.createElement("div")
card.className="gig-card"

card.innerHTML=`
<div class="gig-date">${gig.date}</div>
<div>${gig.venue}</div>
<div>${gig.city}</div>
`

list.appendChild(card)

})

if(future.length>0){

const next = future[0]

document.getElementById("nextGigBar").innerText =
"NEXT GIG: "+next.date+" – "+next.venue+" ("+next.city+")"

}else{

document.getElementById("nextGigBar").innerText =
"No upcoming gigs announced yet"

}

}

async function loadPhotos(){

const res = await fetch('photos.json')
const photos = await res.json()

const grid = document.getElementById("gallery-grid")

photos.forEach(p=>{

const img = document.createElement("img")
img.src="photos/"+p

grid.appendChild(img)

})

}

loadGigs()
loadPhotos()
