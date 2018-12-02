{
  let view = {
    el: '.page > main',
    template: `
    <form>
      <h1>新建歌曲</h1>
      <div class="raw">
        <label>歌名</label>
            <input name="name" type="text" value="__name__">
        
      </div>
      <div class="raw">
          <label>歌手</label>
              <input name="singer" type="text" value="__singer__">
        
      </div>
      <div class="raw">
          <label>外链</label>
              <input name="url" type="text" value="__url__">
        
      </div>
      <div class="raw actions">
        <button  type="submit">保存</button>
      </div>
    </form>
    `,
    render(data = {}) {
      let placeHolders = ['name', 'url','singer','id']
      let html = this.template
      placeHolders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: {
      name: '', singer: '', url: '', id: ''
    },
    create(data) {
      // 声明类型
      var Song = AV.Object.extend('Song')
      // 新建对象
      var song = new Song()
      // 设置名称
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      return song.save().then( (newSong) => {
        let{id, attributes} = newSong
        this.data = {
          id, 
          ...attributes
          // 相当于下面三行
          // name: attributes.name,
          // singer: attributes.singer,
          // url: attributes.url
        }
      }, (error) => {
        console.error(error)
      });
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
      this.view.render(this.model.data)
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('select',(data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        let need = 'name singer url'.split(' ')
        let data = {}
        need.map((string) => {
          data[string] = $(this.view.el).find(`[name=${string}]`).val()
        })
        this.model.create(data)
          .then(()=>{
            this.view.reset()
            window.eventHub.emit('create',this.model.data)
          })
      })
    }
  }
  controller.init(view, model)
}