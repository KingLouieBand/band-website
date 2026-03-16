
fetch('gigs.json')
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("giglist")

data.forEach(gig=>{
const li=document.createElement("li")
li.innerHTML=`<strong>${gig.date}</strong> — ${gig.venue} (${gig.city})`
list.appendChild(li)
})

})

fetch('photos.json')
.then(res=>res.json())
.then(data=>{

const gallery=document.getElementById("gallery-grid")

data.forEach(photo=>{

const img=document.createElement("img")
img.src="photos/"+photo
gallery.appendChild(img)

})

})
