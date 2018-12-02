{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
      
      </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs} = data
      let liList = songs.map((song)=>{
        return $('<li></li>').text(song.name).attr('data-songId',song.id)
      })
      $(this.el).find('ul').empty()
      liList.map((domLi)=>{
        $(this.el).append(domLi)
      })
    },
    removeActive(){
      $(this.el).find('.active').removeClass('active')
    },
    activeItem(li){
      $(li).addClass('active').siblings('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs:[

      ]
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
      this.getAllSongs()
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        this.view.activeItem(e.currentTarget)
      })
    },
    bingEventHub(){
      window.eventHub.on('upload',()=>{
        this.view.removeActive()
      })
      window.eventHub.on('create',(songData)=>{
        this.model.data.songs.push(songData)
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