
function formatDate(dateString){
  const d=new Date(dateString)
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})
}

function formatTime(time){
  if(!time) return "";

  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
}

async function loadGigs(){
  const res=await fetch('gigs.json')
  const gigs=await res.json()
  const now=new Date()

  const future=gigs.filter(g=>new Date(g.date)>=now)
  future.sort((a,b)=>new Date(a.date)-new Date(b.date))

  const list=document.getElementById("giglist")

  future.forEach(g=>{
    const el=document.createElement("div")
    const mapsQuery = encodeURIComponent(`${g.venue}, ${g.city}`);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    el.className="gig-card"
    el.innerHTML=`
      <div class="gig-date">${formatDate(g.date)}</div>
      ${g.time ? `<div class="gig-time">🕒 ${formatTime(g.time)}</div>` : ""}
      <div class="gig-venue">${g.venue}</div>
      <div class="gig-city">${g.city}</div>
    
      <a href="${mapsLink}" target="_blank" class="map-link">📍 View Map</a>
    
      <a href="#" onclick='handleCalendarClick(${JSON.stringify(g)})' class="calendar-link">
  📅 Add to Calendar
</a>
    list.appendChild(el)
  })

  if(future.length){
    const next=future[0]
    document.getElementById("nextGigBar").innerText=
      "NEXT GIG: "+formatDate(next.date)+" – "+next.venue+" ("+next.city+")"
    startCountdown(new Date(next.date))
  }else{
    document.getElementById("nextGigBar").innerText="No upcoming gigs announced yet"
  }
}

function startCountdown(target){
  const el=document.getElementById("countdown")
  function update(){
    const now=Date.now()
    const dist=target-now
    if(dist<0){el.innerHTML="";return}
    const d=Math.floor(dist/(1000*60*60*24))
    const h=Math.floor((dist%(1000*60*60*24))/(1000*60*60))
    el.innerHTML=`Next show in ${d} days ${h} hrs`
  }
  setInterval(update,1000)
  update()
}

function createGoogleCalendarLink(g){
  if(!g.date) return "#";

  const start = new Date(g.date + "T" + (g.time || "20:00"));
  const end = new Date(start.getTime() + (2 * 60 * 60 * 1000)); // +2 hours

  const format = d => d.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z";

  const dates = `${format(start)}/${format(end)}`;
  const text = encodeURIComponent(`King Louie @ ${g.venue}`);
  const location = encodeURIComponent(`${g.venue}, ${g.city}`);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}`;
}

function downloadICS(g){
  const start = new Date(g.date + "T" + (g.time || "20:00"));
  const end = new Date(start.getTime() + (2 * 60 * 60 * 1000));

  const format = d => d.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z";

  const content = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(start)}
DTEND:${format(end)}
SUMMARY:King Louie @ ${g.venue}
LOCATION:${g.venue}, ${g.city}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "king-louie-gig.ics";
  a.click();
}

function handleCalendarClick(g){
  const ua = navigator.userAgent.toLowerCase();

  const isIOS = /iphone|ipad|macintosh/.test(ua) && 'ontouchend' in document;
  const isAndroid = /android/.test(ua);

  if(isIOS){
    // Apple devices → download ICS
    downloadICS(g);
  } else {
    // Everything else → Google Calendar
    window.open(createGoogleCalendarLink(g), "_blank");
  }
}
  
async function loadPhotos(){
  const res=await fetch('photos.json')
  const photos=await res.json()
  const grid=document.getElementById("gallery-grid")

  photos.forEach(p=>{
    const img=document.createElement("img")
    img.src="photos/"+p
    img.onclick=()=>openLightbox(img.src)
    grid.appendChild(img)
  })
}

function openLightbox(src){
  const lb=document.getElementById("lightbox")
  document.getElementById("lightbox-img").src=src
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

// LIGHTBOX FUNCTIONALITY
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");

// Open lightbox when clicking gallery image
document.addEventListener("click", function(e){
  if(e.target.closest("#gallery-grid img")){
    lightbox.classList.add("show");
    lightboxImg.src = e.target.src;
  }
});

// Close when clicking X
closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

// Close when clicking outside image
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox){
    lightbox.classList.remove("show");
  }
});
