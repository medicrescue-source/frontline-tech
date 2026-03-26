const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {

cards.forEach(card=>{
const top = card.getBoundingClientRect().top;

if(top < window.innerHeight - 100){
card.classList.add("show");
}
});

});

/* COUNTER */

const counters = document.querySelectorAll(".count");

counters.forEach(counter=>{
counter.innerText = "0";

const update = ()=>{
const target = +counter.getAttribute("data-target");
const c = +counter.innerText;

const inc = target / 80;

if(c < target){
counter.innerText = Math.ceil(c + inc);
setTimeout(update,20);
}else{
counter.innerText = target;
}
};

update();
});