const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map( (song, index) => {
            return `<div class="song ${index === this.currentIndex? 'active' : ''}" data-index = "${index}">
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
    playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth
        const _this = this
        
        //xu ly quay thumb / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10seconds
            iteration: Infinity,
        })

        cdThumbAnimate.pause()
        // xu ly zoom in zoom out cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0?newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xu ly play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // khi song duoc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            var progressPercent = audio.currentTime / audio.duration * 100
            // xu ly progressPercent = NaN
            !progressPercent?progressPercent = 0:progress.value = progressPercent
        }
        //su ly khi tua nhac
        progress.oninput = function(e){
            audio.pause()
            const seekTime = e.target.value*(audio.duration/100)
            audio.currentTime = seekTime
            progress.onchange = function(){
                audio.play()
            }
        }
        // xu li next 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // xu ly prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // xu ly random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        //xu ly loop
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //xu ly next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.onclick()
            }
        }
        // lang nghe hanh vi click vao playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            // xu ly khi click vao song
            if(songNode || e.target.closest('.option')){
                //xu ly khi click vao song 
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //xu ly khi click vao nut option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= (this.songs.length)){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = (this.songs.length-1)
        }
        this.loadCurrentSong()
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
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        //gan cau hinh tu localStorage
        this.loadConfig()
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe các sự kiện (DOM Events)
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()
        // Play list
        this.render()
        // hien thi trang thai ban dau cua button repeat va random
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom)
    }
}

app.start()