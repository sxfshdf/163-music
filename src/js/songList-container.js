{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
      
      </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs, selectedSongId} = data
      let liList = songs.map((song)=>{
        let $li =  $('<li></li>').text(song.name).attr('data-songId',song.id)
        if(song.id === selectedSongId){
          $li.addClass('active')
        }
        return $li
      })
      $(this.el).find('ul').empty()
      liList.map((domLi)=>{
        $(this.el).append(domLi)
      })
    },
    removeActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs:[],
      selectedSongId: null
    },
    find(){
      var query = new AV.Query('Song')
      return query.find().then((songs)=>{
        this.data.songs = songs.map((song)=>{
          return {id:song.id, ...song.attributes}
        })
        return songs
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
      this.getAllSongs()
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        let songId = $(e.currentTarget).attr('data-songId')

        this.model.data.selectedSongId = songId
        this.view.render(this.model.data)

        let songs = this.model.data.songs
        let data
        for(let i=0; i<songs.length; i++){
          if(songs[i].id === songId){
            data = songs[i]
            break
          }
        }
        window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
      })
    },
    bindEventHub(){
      // window.eventHub.on('upload',()=>{
      //   this.view.removeActive()
      // })
      window.eventHub.on('create',(songData)=>{
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      window.eventHub.on('newSong',()=>{
        this.view.removeActive()
      })
      window.eventHub.on('update',(song) => {
        let songs = this.model.data.songs
        for(let i=0; i<songs.length; i++){
          if(songs[i].id === song.id){
            Object.assign(songs[i], song)
          }
        }
        
        this.view.render(this.model.data)
        
      })
    },
    getAllSongs(){
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}