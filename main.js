const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


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

    songs: [
        {
            name: 'Cứ chill thôi',
            author: 'Chilles, Suni Hạ Linh',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Độ Tộc 2',
            author: 'Độ Mixi, Pháo, Phúc Du, Masew',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Death Bed',
            author: 'Powfu',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg'
        },
        {
            name: 'Salt',
            author: 'Ava Max',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg'
        },
        {
            name: 'Crush',
            author: 'Wn, Vani, An An',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg'
        },
        {
            name: 'Aloha Cool English',
            author: 'Cool',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg'
        },
        {
            name: 'Stronger',
            author: 'Kelly Clarkson',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg'
        },
        {
            name: 'At My Worst',
            author: 'Pink Sweat$',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg'
        },
        {
            name: 'Unstoppable',
            author: 'Sia',
            path: './assets/music/song9.mp3',
            image: './assets/img/img9.jpg'
        },
        {
            name: 'All Falls Down',
            author: 'Alan Walker',
            path: './assets/music/song10.mp3',
            image: './assets/img/img10.jpg'
        },
        
    ],
    
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ""}" data-index = "${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.author}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // tốc độ quay 10 seconds
            iterations: Infinity // vòng quay
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to/ thu nhỏ ảnh cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                // duration: tổng tgian của bài hát (s)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hái 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            }else {
                _this.prevSong()
            }          
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random bài hát
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next bài hát khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            
            if (songNode|| e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }


            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    }, 

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if( this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if( this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }

        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()    

        
    }
}

app.start()
