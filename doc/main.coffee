KISSY.add (S, Node, Anim)->

  $ = Node.all

  class TinyShow
    constructor: (@config)->
      @config.el = $ @config.el
      return if !@config.el
      @config.src = @config.src               ||
        @config.el.attr("data-ks-ts-image")   ||
        @config.el.attr("data-origin-url")    ||
        @config.el.attr("data-original-url")  ||
        @config.el.attr("src")
      return if !@config.src
      @config.loadDelay = parseInt(@config.loadDelay) || 0
      @bg =  $ """<div class="ks-tiny-show-bg" title="点击关闭"></div>"""
      @loading = $ """<div class="ks-tiny-show-loading"></div>"""
      @pic = $ """<img class="ks-tiny-show-img" title="滚轮调整大小" />"""
      @rawImg = new Image()
      @percent = 100
      @isShow = false
      @viewportWidth = $(document).width()
      @viewportHeight = $(document).height()
      @init()

    init: ->
      @pic.appendTo @bg
      @loading.appendTo @bg
      @bg.appendTo 'body'
      @_bindEvents()
      S.later =>
        return if !@rawImg
        @rawImg.src = @config.src
        @_checkLoading()
      , @config.loadDelay


    show: ->
      @isShow = true
      @bg.css "left", 0
      @pic.css
        "opacity" : 0
        "display" : "inline-block"
      Anim(@pic,
        opacity: 1
      , 0.4, "easeOut").run()
      @_bindWheelEvent()
      @_bindClose()
      @_bindDrag()


    close: ->
      @isShow = false
      @pic.hide()
      @bg.css "left", "-200%"
      @bg.detach "click mouseleave mousewheel pinch pinchStart pinchEnd"
      @pic.detach "click touchstart touchmove touchend mousedown mousemove mouseup mouseleave"

    destroy: ->
      @bg.remove().empty()
      for own key, value of @
        @[key] = null

    _checkLoading: ->
      return if !@rawImg
      if @rawImg.width and @rawImg.complete
        @_loadHandler()
      else
        S.later @_checkLoading, 100, false, @

    _setLoading: ->

    _removeLoading: ->
      @loading.remove()

    _bindEvents: ->
      @_bindClick()

    _bindClose: ->
      @pic.on "click", (ev)->
        ev.halt()
      @bg.on "click", =>
        @close()

    _bindClick: ->
      @config.el.on 'click', =>
        @show()

    _loadHandler: ->
      @_removeLoading()
      @pic.attr "src", @rawImg.src
      @width = @rawImg.width
      @height = @rawImg.height
      @pic.offset
        left: (@viewportWidth - @width) / 2
        top: if (tmp = (@viewportHeight - @height) / 2) < 0 then 0 else tmp
      if @isShow then @pic.show() else @pic.hide()

#
#    _bindImageLoad: ->
#      $(@rawImg).on 'load', @_loadHandler, @

    _bindWheelEvent: ->
      _percent = @percent
      last_percent = @percent
      @bg.on 'mousewheel pinch', (ev)=>
        ev.halt()
        if ev.scale
          last_percent = @percent
          @percent = _percent * ev.scale
          plus = @percent - last_percent
        else
          plus = if ev.delta > 0 then 2 else -2
          @percent += plus
        @percent = 400 if @percent > 400
        @percent = 10 if @percent < 10
        left = @pic.offset().left
        @pic.css
          width     : @percent / 100 * @width
          height    : @percent / 100 * @height
          left      : left - plus / 100 * @width / 2

      @bg.on 'pinchStart', (ev)=>
        ev.halt()
        @allowMove = false
        _percent = @percent

      @bg.on 'pinchEnd', (ev)=>
        ev.halt()
        @allowMove = true


    _bindDrag: ->
      [posX, posY] = [null, null]
      [staX, staY] = [null, null]
      draging = false
      @pic.on "touchstart mousedown", (ev)=>
        draging = true
        ev.preventDefault()
        ev = ev.originalEvent
        [posX, posY] = [@pic.offset().left, @pic.offset().top]
        if ev.touches
          [staX, staY] = [ev.touches[0].pageX, ev.touches[0].pageY]
        else
          [staX, staY] = [ev.pageX || ev.clientX, ev.pageY || ev.clientY]

      @pic.on "touchmove mousemove", (ev)=>
        return if draging is false or @allowMove is false
        ev.preventDefault()
        ev = ev.originalEvent
        if ev.touches
          [endX, endY] = [ev.touches[0].pageX, ev.touches[0].pageY]
        else
          [endX, endY] = [ev.pageX || ev.clientX, ev.pageY || ev.clientY]
        [movX, movY] = [endX - staX, endY - staY]
        @pic.offset
          left: posX + movX
          top: posY + movY

      @pic.on "mouseleave mouseup touchend", =>
        draging = false
        @allowMove = true

      @bg.on "mouseleave", ->
        draging = false


, {
  requires: ['node', 'anim']
}