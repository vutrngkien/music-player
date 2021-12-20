const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
var randomCurrent = []



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))  || {},
    setConfig: function(key,value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [{
        name: 'Better Days',
        singer: 'NEIKED,  Mae Muller,  Polo G',
        path: './assets/music/Better Days-1.mp3',
        image: './assets/img/better-day.jpg'
    },
    {
        name: 'Girl Of My Dreams',
        singer: 'Juice WRLD, SUGA',
        path: './assets/music/Girl Of My Dreams-2.mp3',
        image: './assets/img/girlofdream.jpg'
    },
    {
        name: 'It_ll Be Okay',
        singer: 'Shawn Mendes',
        path: './assets/music/It_ll Be Okay-3.mp3',
        image: './assets/img/okey.jpg'
    },
    {
        name: 'Love Nwantiti Ah Ah Ah',
        singer: 'CKay',
        path: './assets/music/Love Nwantiti Ah Ah Ah_ - CKay.mp3',
        image: './assets/img/love.jpg'
    },
    {
        name: 'Merry Christmas',
        singer: 'Ed Sheeran,  Elton John',
        path: './assets/music/Merry Christmas-4.mp3',
        image: './assets/img/christmas.jpg'
    },
    {
        name: 'Miracle',
        singer: 'WayV',
        path: './assets/music/Miracle-5.mp3',
        image: './assets/img/enermy.jpg'
    },
    {
        name: 'Oh My God',
        singer: 'Adele',
        path: './assets/music/Oh My God-6.mp3',
        image: './assets/img/ohmygod.jpg'
    },
    {
        name: 'SG',
        singer: 'DJ Snake',
        path: './assets/music/SG-7.mp3',
        image: './assets/img/sg.jpg'
    },
    {
        name: 'Smokin Out The Window',
        singer: 'Bruno Mars',
        path: './assets/music/Smokin Out The Window-8.mp3',
        image: './assets/img/smokin.jpg'
    }],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    renderSong:function () {
        const _this = this
        const html = this.songs.map(function(song,index) {
            return `<div class="song ${index === _this.currentIndex?'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})" >
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = html.join('')
    },
    handleEvents: function() {
        const _this = this
        cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000,
            iterations: Infinity
        });

        cdThumbAnimate.pause()

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        
        audio.onplay = function(){
            player.classList.add('playing')
            _this.isPlaying = true
            cdThumbAnimate.play()
        }

        audio.onpause = function(){
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }

        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }else if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
        }

        audio.addEventListener("timeupdate", timeUpdate);

        function timeUpdate(e) {
            if (audio.duration){
                progress.value = (audio.currentTime / audio.duration) * 100
            }
        }
        function seekStart() {
            audio.removeEventListener("timeupdate", timeUpdate);
          };

        function seekEnd() {
            audio.addEventListener("timeupdate", timeUpdate);
            audio.currentTime = progress.value * (audio.duration / 100)
        }

        progress.onmousedown = seekStart
        progress.ontouchstart = seekStart
        progress.onmouseup = seekEnd
        progress.ontouchend = seekEnd

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.renderSong()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.renderSong()
            _this.scrollToActiveSong()
        }

        randomBtn.onclick = function() {
            _this.isRepeat = false
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRepeat',_this.isRepeat)
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            repeatBtn.classList.remove('active')
        }

        repeatBtn.onclick = function() {
            _this.isRandom = false
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRandom',_this.isRandom)
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
            randomBtn.classList.remove('active')
        }
        
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.renderSong()
                    audio.play()
                }
                if(e.target.closest('.option')){
                    console.log("option")
                }
            }
        }

    },
    scrollToActiveSong: function(){
        if(this.currentIndex <= 4){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 100);
        }else{
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 100);
        }
    },
    nextSong: function() {
        this.currentIndex ++ 
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex --
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        function randomIndex(){
            return  Math.floor(Math.random() * app.songs.length)
        }
        let newIndex = randomIndex()
        if(randomCurrent.length === this.songs.length){
            randomCurrent = [newIndex]
        }else{
            while(randomCurrent.includes(newIndex)){
                newIndex = randomIndex()
            }
            randomCurrent.push(newIndex)
        }
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = `${this.currentSong.path}`
    },
    start: function(){
        this.loadConfig()
        this.handleEvents()
        this.defineProperties()
        this.loadCurrentSong()
        this.renderSong()
        
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}

app.start()
