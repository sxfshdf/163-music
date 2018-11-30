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
        return $('<li></li>').text(song.name)
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
      songs:[

      ]
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload',()=>{
        this.view.removeActive()
      })
      window.eventHub.on('create',(songData)=>{
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}