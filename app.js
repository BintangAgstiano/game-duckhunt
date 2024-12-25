const canvas = document.querySelector('canvas')
const wCanvas = canvas.width = 700
const hCanvas = canvas.height = 500
const ctx = canvas.getContext('2d');
let xDuck = 0
let yDuck = 200
let intervalDuck
let duckArr = []
let ySpeed
let intervalCreateDuck
let xClient
let yClient
let audioHit = document.querySelector('.audio-hit');
let xDuckDead
let yDuckDead
let scoreNumber = document.querySelector('.score-number')
let colHealtImg = document.querySelector('.col-healt-img')
let inputName = document.querySelector('#input-name')
let selectMode = document.querySelector('.select-mode')
let mode = document.querySelector('.difficulty')
let colInputPlay = document.querySelector('.col-input-play')
let popupScreen = document.querySelector('.popup-screen')
let popupGameOver = document.querySelector('.popup-gameover')
let popupPause = document.querySelector('.popup-pause')
let btnBack = document.querySelectorAll('.back-to-menu')
let btnRetry = document.querySelectorAll('.retry')
let btnContinue = document.querySelector('.continue')
let colSound = document.querySelector('.col-sound')
let lineSound = document.querySelector('.line-sound')
let score = 0
scoreNumber.innerHTML = `${score.toString().padStart(10, '0')}`
let healt = 3
let player = document.querySelector('.player')
let textMode = document.querySelector('.text-mode')
let close = document.querySelector('.close')
let scoreGameOver = document.querySelector('.score-number-gameover')
let footerLeadeboard = document.querySelector('.footer-leadeboard')
let btnLeadeboard = document.querySelector('.col-input-leadeboard')
let popupLeadeboard = document.querySelector('.popup-leadeboard')
let audioUtama = document.querySelector('.audio-utama')
let audioGameOver = document.querySelector('.audio-gameover')
selectMode.value = 'easy'
let numberInterval
setInterval(() => {
    
    if(selectMode.value==='easy'){
        numberInterval=5000
    }
    else if(selectMode.value==='medium'){
        numberInterval=3000
    }
    else if(selectMode.value==='hard'){
        numberInterval=2000
    }
}, 100);
let disablePlay = true
let menu = document.querySelectorAll('.bottom div')
inputName.addEventListener('change', function () {
    if (inputName.value == '') {
        disablePlay = true
    } else {
        disablePlay = false
    }
})
let isVolume = true
colSound.addEventListener('click', function () {
    if (!isVolume) {
        lineSound.style.height = '50px'
        isVolume = true
      audioUtama.pause()
    } else {
        audioUtama.currentTime = 0
        audioUtama.play()
        lineSound.style.height = '0px'
        isVolume = false
    }
})
close.addEventListener('click', function () {
    popupLeadeboard.style.display = 'none'
    popupScreen.style.display = 'flex'
})
btnLeadeboard.addEventListener('click', function () {
    isGameActive = false;
    popupLeadeboard.style.display = 'flex'
    popupScreen.style.display = 'none'
    let getDataScore = JSON.parse(localStorage.getItem('score'));
    if (getDataScore) {
        footerLeadeboard.innerHTML = '';
        let counter = 1
        getDataScore.sort((a, b) => b.score - a.score).forEach((data, index) => {
            if (data.mode == 'easy') {
                footerLeadeboard.innerHTML += `
                      <div class="line-board">
                        <div class="col-number">${counter}</div>
                        <span>${data.player}</span>
                        <div class="col-piala">
                            <img src="piala.png" width="30" alt="">
                            <span>${data.score.toString().padStart(10, '0')}</span>
                        </div>
                    </div>`
                counter++

            }
        })
    }
})

menu.forEach(menu => {
    menu.addEventListener('click', function () {
        let menuActive = document.querySelector('.bottom div.active')
        if (menuActive) {
            menuActive.classList.remove('active')
        }
        menu.classList.add('active')
        let menuName = menu.getAttribute('data-name')
        let getDataScore = JSON.parse(localStorage.getItem('score'));
        if (getDataScore) {
            footerLeadeboard.innerHTML = '';
            let counter = 1
            getDataScore.sort((a, b) => b.score - a.score).forEach((data, index) => {
                if (data.mode == menuName) {

                    footerLeadeboard.innerHTML += `
                      <div class="line-board">
                        <div class="col-number">${counter}</div>
                        <span>${data.player}</span>
                        <div class="col-piala">
                            <img src="piala.png" width="30" alt="">
                            <span>${data.score.toString().padStart(10, '0')}</span>
                        </div>
                    </div>`
                    counter++
                }
            })
        }
    })
})
btnRetry.forEach(btnRetry=>{

    btnRetry.addEventListener('click', function () {
    
    
        clearInterval(intervalCreateDuck)
        clearInterval(intervalDuck)
        duckArr = []
        yRand = Math.floor(Math.random() * 100) + 100
        ySpeed = Math.floor(Math.random() * 20);
        duckArr.push({ x: xDuck, y: yRand });
        healt = 3
        colHealtImg.innerHTML = `
                <img src="healt.png" width="20" alt="">
                <img src="healt.png" width="20" alt="">
                <img src="healt.png" width="20" alt="">`
        score = 0
        scoreNumber.innerHTML = `${score.toString().padStart(10, '0')}`;
        popupGameOver.style.display = 'none'
        popupPause.style.display = 'none'
    
        startIntervalDuck()
        startIntervalCreateDuck()
        isGameActive = true;
    })
})
btnBack.forEach(btnBack=>{

    btnBack.addEventListener('click', function () {
        let oldScore = JSON.parse(localStorage.getItem('score')) || []
        oldScore.push({ score: score, player: inputName.value, mode: selectMode.value })
        if (oldScore) {

            localStorage.setItem('score', JSON.stringify(oldScore))
        }
        isGameActive = false;
        inputName.value = ''
        duckArr = []
        selectMode.value = 'easy'
    
        score = 0
        scoreNumber.innerHTML = `${score.toString().padStart(10, '0')}`;
    
        healt = 3
        colHealtImg.innerHTML = `
                <img src="healt.png" width="20" alt="">
                <img src="healt.png" width="20" alt="">
                <img src="healt.png" width="20" alt="">`
        clearInterval(intervalCreateDuck)
        clearInterval(intervalDuck)
        popupGameOver.style.display = 'none'
        popupScreen.style.display = 'flex'
        popupPause.style.display = 'none'
    })
})
colInputPlay.addEventListener('click', function () {
    if (!disablePlay) {
        popupScreen.style.display = 'none'
        main()
        mode.innerHTML = selectMode.value
        player.innerHTML = inputName.value
    }
})
const duckImg = new Image()
duckImg.src = 'duckhunt_various_sheet_cr-removebg-preview.png'
duckImg.onload = () => {
    drawDuck();
}
const duckDeadImg = new Image()
duckDeadImg.src = 'duckhunt_various_sheet_cr-removebg-preview.png'
duckDeadImg.onload = () => {
    drawDuckDead();
}
const boomImg = new Image()
boomImg.src = 'boom.png'
boomImg.onload = () => {
    drawBoom();
}

function drawBoom() {
    ctx.drawImage(boomImg, xClient - 20, yClient - 20, 50, 50)
}

function drawDuckDead() {
    ctx.drawImage(duckDeadImg, xDuckDead, yDuckDead, 100, 80);

}


const pointerImg = new Image();
pointerImg.src = 'images\ \(1\).png'
pointerImg.onload = () => {
    drawPointer()
}

function drawPointer() {
    ctx.drawImage(pointerImg, xClient - 20, yClient - 20, 50, 50)
}

function drawTengkorak(x, y) {

    ctx.drawImage(tengkorakImg, xTengkorak, yTengkorak, 30, 50)
}

function createDuck() {
    let yRand = Math.floor(Math.random() * 100) + 100
    ySpeed = Math.floor(Math.random() * 20);
    duckArr.push({ x: xDuck, y: yRand });
}
function startIntervalCreateDuck() {
    intervalCreateDuck = setInterval(() => {
        createDuck()
    }, numberInterval);
}
function drawDuck() {
    duckArr.forEach(duck => {
        ctx.drawImage(duckImg, duck.x, duck.y, 100, 80);
        duck.x += 30
        duck.y -= 8
    })
}

function startIntervalDuck() {
    intervalDuck = setInterval(() => {
        ctx.clearRect(0, 0, wCanvas, hCanvas)
        drawDuck()

        drawPointer()
    }, 100);
}

let intervalDuckDead
let isHit = false
function update() {
    if (!isHit) {
        isHit = true

        audioHit.currentTime = 0
        audioHit.play()
        drawBoom()
        clearInterval(intervalDuckDead)
        let dead = false;

        duckArr.forEach((duck, index) => {
            if (
                xClient > duck.x &&
                xClient < duck.x + 100 &&
                yClient > duck.y &&
                yClient < duck.y + 80
            ) {

                duckArr.splice(index, 1);
                xDuckDead = duck.x;
                yDuckDead = duck.y;
                score += 1;
                scoreNumber.innerHTML = `${score.toString().padStart(10, '0')}`;
                dead = true;


                intervalDuckDead = setInterval(() => {
                    yDuckDead += 30;
                    drawDuckDead();
                    if (yDuckDead > 300) {
                        xDuckDead = 1000;
                    }
                }, 100);
            }
        });


        if (!dead) {

            healt -= 1;
            if (healt == 3) {
                colHealtImg.innerHTML = `
            <img src="healt.png" width="20" alt="">
            <img src="healt.png" width="20" alt="">
            <img src="healt.png" width="20" alt="">
        `;
            } else if (healt == 2) {
                colHealtImg.innerHTML = `
            <img src="healt.png" width="20" alt="">
            <img src="healt.png" width="20" alt="">
        `;
            } else if (healt == 1) {
                colHealtImg.innerHTML = `
            <img src="healt.png" width="20" alt="">
        `;
            } else if (healt == 0) {
                colHealtImg.innerHTML = ``;
                let oldScore = JSON.parse(localStorage.getItem('score')) || []
                oldScore.push({ score: score, player: inputName.value, mode: selectMode.value })
                if (oldScore) {

                    localStorage.setItem('score', JSON.stringify(oldScore))
                }
                scoreGameOver.innerHTML = scoreNumber.innerHTML
                textMode.innerHTML = selectMode.value
                gameOVer()

            }
        }


        dead = false;
        setTimeout(() => {
            isHit = false
        }, 1000);
    }
}

btnContinue.addEventListener('click', function () {
    startIntervalCreateDuck()
    startIntervalDuck()
    popupPause.style.display = 'none'
})
function gameOVer() {
    audioUtama.pause()
    audioGameOver.currentTime=0
    audioGameOver.play()
    setTimeout(() => {
        audioGameOver.pause()
        audioUtama.currentTime = 0
        audioUtama.play()
    }, 2000);
    isGameActive = false;
    popupGameOver.style.display = 'flex'
    clearInterval(intervalCreateDuck)
    clearInterval(intervalDuck)
}

let isGameActive = false;
function updatePermainan(e) {
    if (e.keyCode === 27 && isGameActive) {
            clearInterval(intervalCreateDuck)
            clearInterval(intervalDuck)
            popupPause.style.display = 'flex'
    }
}

function main() {
    isGameActive = true
    ctx.clearRect(0, 0, wCanvas, hCanvas)
    ctx.beginPath()
    drawDuck()
    createDuck()
    startIntervalDuck()
    startIntervalCreateDuck()
    canvas.addEventListener('mousemove', function (e) {
        xClient = e.clientX - canvas.getBoundingClientRect().left
        yClient = e.clientY - canvas.getBoundingClientRect().top

    })
    canvas.addEventListener('click', update)

    drawPointer()
    drawDuckDead()
    document.addEventListener('keyup', updatePermainan)
}
// main()