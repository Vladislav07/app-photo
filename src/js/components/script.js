let burger = document.querySelector(".burger");
let menu = document.querySelector(".header__nav");
let menuLinks=document.querySelectorAll(".nav__link");
let isState=false;

burger.addEventListener("click", function () {
  burger.classList.toggle("burger__active");
  menu.classList.toggle("header__nav--active");
  document.body.classList.toggle('stop-scroll');
  requestAnimationFrame(Play);
  
});

menuLinks.forEach(function(el){
  el.addEventListener("click",
  function(){
    burger.classList.remove("burger__active");
    menu.classList.remove("header__nav--active");
    document.body.classList.remove('stop-scroll');
  })
})

let btnSearh = document.querySelector(".search");
let fieldSearch=document.querySelector(".header__search");
let btnCloseSearch=document.querySelector(".header__close-search")

btnSearh.addEventListener("click",
function () {

  fieldSearch.classList.add("header__search--active")
})

btnCloseSearch.addEventListener("click",
function () {
  fieldSearch.classList.remove("header__search--active")

})


const block = document.querySelector('.nav');

  const frameBlock = new KeyframeEffect(
    block,
    [
       {
        transform: 'translate(0,-100vh)', 
      },
      {
        transform: 'translate(0, 0)',
      },  
    ],
    { duration: 1000 }
  );

  const animation = new Animation(frameBlock, document.timeline);
  function Play() {
    animation.play();
  }
 

 

