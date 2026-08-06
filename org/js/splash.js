const SPLASH_REDIRECT_DELAY=2500;
const SPLASH_PROGRESS_START_DELAY=80;

document.addEventListener('DOMContentLoaded',()=>{startProgressAnimation();scheduleRedirectToHome();});

function startProgressAnimation(){const fill=document.querySelector('#progress-fill');if(!fill)return;window.setTimeout(()=>{fill.style.width='100%';fill.parentElement?.setAttribute('aria-valuenow','100');},SPLASH_PROGRESS_START_DELAY);}

function scheduleRedirectToHome(){window.setTimeout(()=>{window.location.href='index_home.html';},SPLASH_REDIRECT_DELAY);}
