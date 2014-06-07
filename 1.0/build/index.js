/*
combined files : 

gallery/tinyshow/1.0/main
gallery/tinyshow/1.0/index

*/
var __hasProp = {}.hasOwnProperty;

KISSY.add('gallery/tinyshow/1.0/main',function(S, Node, Anim) {
  var $, TinyShow;
  $ = Node.all;
  return TinyShow = (function() {
    function TinyShow(config) {
      this.config = config;
      this.config.el = $(this.config.el);
      if (!this.config.el) {
        return;
      }
      this.config.src = this.config.src || this.config.el.attr("data-ks-ts-image") || this.config.el.attr("data-origin-url") || this.config.el.attr("data-original-url") || this.config.el.attr("src");
      if (!this.config.src) {
        return;
      }
      this.config.loadDelay = parseInt(this.config.loadDelay) || 0;
      this.bg = $("<div class=\"ks-tiny-show-bg\" title=\"点击关闭\"></div>");
      this.loading = $("<div class=\"ks-tiny-show-loading\"></div>");
      this.pic = $("<img class=\"ks-tiny-show-img\" title=\"滚轮调整大小\" />");
      this.rawImg = new Image();
      this.percent = 100;
      this.isShow = false;
      this.viewportWidth = $(document).width();
      this.viewportHeight = $(document).height();
      this.init();
    }

    TinyShow.prototype.init = function() {
      this.pic.appendTo(this.bg);
      this.loading.appendTo(this.bg);
      this.bg.appendTo('body');
      this._bindEvents();
      return S.later((function(_this) {
        return function() {
          if (!_this.rawImg) {
            return;
          }
          _this.rawImg.src = _this.config.src;
          return _this._checkLoading();
        };
      })(this), this.config.loadDelay);
    };

    TinyShow.prototype.show = function() {
      this.isShow = true;
      this.bg.css("left", 0);
      this.pic.css({
        "opacity": 0,
        "display": "inline-block"
      });
      Anim(this.pic, {
        opacity: 1
      }, 0.4, "easeOut").run();
      this._bindWheelEvent();
      this._bindClose();
      return this._bindDrag();
    };

    TinyShow.prototype.close = function() {
      this.isShow = false;
      this.pic.hide();
      this.bg.css("left", "-200%");
      this.bg.detach("click mouseleave mousewheel pinch pinchStart pinchEnd");
      return this.pic.detach("click touchstart touchmove touchend mousedown mousemove mouseup mouseleave");
    };

    TinyShow.prototype.destroy = function() {
      var key, value, _results;
      this.bg.remove().empty();
      _results = [];
      for (key in this) {
        if (!__hasProp.call(this, key)) continue;
        value = this[key];
        _results.push(this[key] = null);
      }
      return _results;
    };

    TinyShow.prototype._checkLoading = function() {
      if (!this.rawImg) {
        return;
      }
      if (this.rawImg.width && this.rawImg.complete) {
        return this._loadHandler();
      } else {
        return S.later(this._checkLoading, 100, false, this);
      }
    };

    TinyShow.prototype._setLoading = function() {};

    TinyShow.prototype._removeLoading = function() {
      return this.loading.remove();
    };

    TinyShow.prototype._bindEvents = function() {
      return this._bindClick();
    };

    TinyShow.prototype._bindClose = function() {
      this.pic.on("click", function(ev) {
        return ev.halt();
      });
      return this.bg.on("click", (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    };

    TinyShow.prototype._bindClick = function() {
      return this.config.el.on('click', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
    };

    TinyShow.prototype._loadHandler = function() {
      var tmp;
      this._removeLoading();
      this.pic.attr("src", this.rawImg.src);
      this.width = this.rawImg.width;
      this.height = this.rawImg.height;
      this.pic.offset({
        left: (this.viewportWidth - this.width) / 2,
        top: (tmp = (this.viewportHeight - this.height) / 2) < 0 ? 0 : tmp
      });
      if (this.isShow) {
        return this.pic.show();
      } else {
        return this.pic.hide();
      }
    };

    TinyShow.prototype._bindWheelEvent = function() {
      var last_percent, _percent;
      _percent = this.percent;
      last_percent = this.percent;
      this.bg.on('mousewheel pinch', (function(_this) {
        return function(ev) {
          var left, plus;
          ev.halt();
          if (ev.scale) {
            last_percent = _this.percent;
            _this.percent = _percent * ev.scale;
            plus = _this.percent - last_percent;
          } else {
            plus = ev.delta > 0 ? 2 : -2;
            _this.percent += plus;
          }
          if (_this.percent > 400) {
            _this.percent = 400;
          }
          if (_this.percent < 10) {
            _this.percent = 10;
          }
          left = _this.pic.offset().left;
          return _this.pic.css({
            width: _this.percent / 100 * _this.width,
            height: _this.percent / 100 * _this.height,
            left: left - plus / 100 * _this.width / 2
          });
        };
      })(this));
      this.bg.on('pinchStart', (function(_this) {
        return function(ev) {
          ev.halt();
          _this.allowMove = false;
          return _percent = _this.percent;
        };
      })(this));
      return this.bg.on('pinchEnd', (function(_this) {
        return function(ev) {
          ev.halt();
          return _this.allowMove = true;
        };
      })(this));
    };

    TinyShow.prototype._bindDrag = function() {
      var draging, posX, posY, staX, staY, _ref, _ref1;
      _ref = [null, null], posX = _ref[0], posY = _ref[1];
      _ref1 = [null, null], staX = _ref1[0], staY = _ref1[1];
      draging = false;
      this.pic.on("touchstart mousedown", (function(_this) {
        return function(ev) {
          var _ref2, _ref3, _ref4;
          draging = true;
          ev.preventDefault();
          ev = ev.originalEvent;
          _ref2 = [_this.pic.offset().left, _this.pic.offset().top], posX = _ref2[0], posY = _ref2[1];
          if (ev.touches) {
            return _ref3 = [ev.touches[0].pageX, ev.touches[0].pageY], staX = _ref3[0], staY = _ref3[1], _ref3;
          } else {
            return _ref4 = [ev.pageX || ev.clientX, ev.pageY || ev.clientY], staX = _ref4[0], staY = _ref4[1], _ref4;
          }
        };
      })(this));
      this.pic.on("touchmove mousemove", (function(_this) {
        return function(ev) {
          var endX, endY, movX, movY, _ref2, _ref3, _ref4;
          if (draging === false || _this.allowMove === false) {
            return;
          }
          ev.preventDefault();
          ev = ev.originalEvent;
          if (ev.touches) {
            _ref2 = [ev.touches[0].pageX, ev.touches[0].pageY], endX = _ref2[0], endY = _ref2[1];
          } else {
            _ref3 = [ev.pageX || ev.clientX, ev.pageY || ev.clientY], endX = _ref3[0], endY = _ref3[1];
          }
          _ref4 = [endX - staX, endY - staY], movX = _ref4[0], movY = _ref4[1];
          return _this.pic.offset({
            left: posX + movX,
            top: posY + movY
          });
        };
      })(this));
      this.pic.on("mouseleave mouseup touchend", (function(_this) {
        return function() {
          draging = false;
          return _this.allowMove = true;
        };
      })(this));
      return this.bg.on("mouseleave", function() {
        return draging = false;
      });
    };

    return TinyShow;

  })();
}, {
  requires: ['node', 'anim']
});

/**
 * @fileoverview 
 * @author 筱谷<xiaogu.gxb@taobao.com>
 * @module tinyshow
 **/
KISSY.add('gallery/tinyshow/1.0/index',function (S, Tinyshow) {
    return Tinyshow;
}, {requires:['./main']});




