
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

startCountdown(new Date(next.date))

}else{

document.getElementById("nextGigBar").innerText =
"No upcoming gigs announced yet"

}

}

function startCountdown(target){

const el = document.getElementById("countdown")

function update(){

const now = new Date().getTime()
const distance = target - now

if(distance < 0){
el.innerHTML = ""
return
}

const days = Math.floor(distance/(1000*60*60*24))
const hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60))

el.innerHTML = "Next gig in "+days+" days "+hours+" hrs"

}

setInterval(update,1000)
update()

}

async function loadPhotos(){

const res = await fetch('photos.json')
const photos = await res.json()

const grid = document.getElementById("gallery-grid")

photos.forEach(p=>{

const img = document.createElement("img")
img.src="photos/"+p

img.onclick = () => {
openLightbox("photos/"+p)
}

grid.appendChild(img)

})

}

function openLightbox(src){

const lightbox = document.getElementById("lightbox")
const img = document.getElementById("lightbox-img")

img.src = src
lightbox.style.display="flex"

}

document.querySelector(".lightbox-close").onclick = () => {
document.getElementById("lightbox").style.display="none"
}

document.getElementById("lightbox").onclick = (e) => {
if(e.target.id==="lightbox"){
e.target.style.display="none"
}
}

})

}

loadGigs()
loadPhotos()
