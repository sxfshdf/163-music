{
  let view = {
    el: '.newSong',
    template: `
      新建歌曲
    `,
    render(data){
      $(this.el).html(this.template)
    },
    active(){
      $(this.el).addClass('active')
    },
    deactive(){
      $(this.el).removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.view.active()
      this.bindEvents()
      window.eventHub.on('newSong',(data)=>{
        this.view.active()
      })
      window.eventHub.on('select',(data)=>{
        this.view.deactive()
      })
    },
    bindEvents(){
      $(this.view.el).on('click',()=>{
        window.eventHub.emit('newSong')
      })
    }
  }
  controller.init(view,model)
}