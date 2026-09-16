const DEFAULT_MOVIES=[
 {id:1,title:"Big Buck Bunny",year:2008,genre:"Animation",poster:"https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",video:"https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"},
 {id:2,title:"Sample Action",year:2026,genre:"Action",poster:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",video:""},
 {id:3,title:"Sample Drama",year:2026,genre:"Drama",poster:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",video:""}
];
const KEY="movie_world_movies";
let movies=JSON.parse(localStorage.getItem(KEY)||"null")||DEFAULT_MOVIES;
let activeGenre="All";

const grid=document.getElementById("movieGrid"), cats=document.getElementById("categories"), search=document.getElementById("search"), empty=document.getElementById("empty");

function save(){localStorage.setItem(KEY,JSON.stringify(movies))}
function genres(){return ["All",...new Set(movies.map(m=>m.genre).filter(Boolean))]}
function renderCats(){cats.innerHTML=genres().map(g=>`<button class="chip ${g===activeGenre?"active":""}" data-g="${escapeHtml(g)}">${escapeHtml(g)}</button>`).join("");cats.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{activeGenre=b.dataset.g;render()})}
function render(){
 renderCats();
 const q=search.value.trim().toLowerCase();
 const list=movies.filter(m=>(activeGenre==="All"||m.genre===activeGenre)&&m.title.toLowerCase().includes(q));
 grid.innerHTML=list.map(m=>`
 <article class="card">
   <img class="poster" src="${escapeAttr(m.poster)}" alt="${escapeAttr(m.title)}" onerror="this.style.visibility='hidden'">
   <div class="card-body">
    <h3>${escapeHtml(m.title)}</h3>
    <div class="meta">${escapeHtml(m.genre)} • ${escapeHtml(String(m.year))}</div>
    <button class="watch" data-id="${m.id}">▶ Watch</button>
   </div>
 </article>`).join("");
 empty.classList.toggle("hidden",list.length>0);
 grid.querySelectorAll(".watch").forEach(b=>b.onclick=()=>openMovie(Number(b.dataset.id)));
}
function openMovie(id){
 const m=movies.find(x=>x.id===id); if(!m)return;
 document.getElementById("playerTitle").textContent=m.title;
 const v=document.getElementById("player"), d=document.getElementById("download");
 v.src=m.video||""; d.href=m.video||"#"; d.style.pointerEvents=m.video?"auto":"none"; d.style.opacity=m.video?"1":".45";
 document.getElementById("playerModal").classList.remove("hidden");
 if(m.video) v.play().catch(()=>{});
}
function close(){const v=document.getElementById("player");v.pause();v.removeAttribute("src");v.load();document.getElementById("playerModal").classList.add("hidden")}
document.getElementById("closePlayer").onclick=close;
document.getElementById("playerModal").onclick=e=>{if(e.target.id==="playerModal")close()};
search.oninput=render;
document.getElementById("movieForm").onsubmit=e=>{
 e.preventDefault();
 const m={id:Date.now(),title:title.value.trim(),year:Number(year.value),genre:genre.value.trim(),poster:poster.value.trim(),video:video.value.trim()};
 movies.unshift(m);save();e.target.reset();activeGenre="All";render();location.hash="movies";
};
document.getElementById("reset").onclick=()=>{if(confirm("Reset to demo movies?")){movies=DEFAULT_MOVIES;save();activeGenre="All";render()}};
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeAttr(s){return escapeHtml(s)}
render();