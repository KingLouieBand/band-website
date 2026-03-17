
function formatDate(dateString){
const date = new Date(dateString)
return date.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})
}

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
card.innerHTML = `
<div class="gig-date">${formatDate(gig.date)}</div>
<div>${gig.venue}</div>
<div>${gig.city}</div>`
list.appendChild(card)
})

if(future.length){
const next = future[0]
document.getElementById("nextGigBar").innerText =
"NEXT GIG: "+formatDate(next.date)+" – "+next.venue+" ("+next.city+")"
startCountdown(new Date(next.date))
}
}

function startCountdown(target){
const el = document.getElementById("countdown")

function update(){
const now = Date.now()
const dist = target - now
if(dist < 0) return
const d = Math.floor(dist/(1000*60*60*24))
const h = Math.floor((dist%(1000*60*60*24))/(1000*60*60))
el.innerHTML = "Next show in "+d+" days "+h+" hrs"
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
img.onclick=()=>openLightbox("photos/"+p)
grid.appendChild(img)
})
}

function openLightbox(src){
const lb = document.getElementById("lightbox")
document.getElementById("lightbox-img").src = src
lb.style.display="flex"
}

document.addEventListener("DOMContentLoaded",()=>{
document.querySelector(".lightbox-close").onclick=()=>document.getElementById("lightbox").style.display="none"
document.getElementById("lightbox").onclick=e=>{
if(e.target.id==="lightbox") e.target.style.display="none"
}
})

loadGigs()
loadPhotos()
