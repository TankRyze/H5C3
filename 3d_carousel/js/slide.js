$(function () {
  $.fn.slide = function (params) {
    var imgs = params.imgs
    // 下标的个数
    params.indexList = imgs.length

    var $this = $(this); //当然响应事件对象
    //功能代码部分
    function _Slide(params) {
      //设置默认的事件和修改属性
      var defaults = {
        direction: 'portrait', // 轮播方向 portrait 纵向滚动 transverse 横向滚动
        imgs: [], // 轮播图片
        indexList: 0, //下标
        partition: 4, // 分割数
        isIndex: true, // 是否显示下标
        isControl: true, // 是否显示左右键头
        automatic: true, // 自动轮播
        automatic_item: 3000 // 自动轮播时间
      };
      // 记录波动的次数
      this.waveNum = 0;
      //合并代码：defaults与options进行比较，如果属性相同，则用options的覆盖前者。从后往前覆盖！
      this.params = $.extend(defaults, params);
      // 可以波动的最大次数
      this.waveMaxNum = imgs.length;
      // 是否在动画中
      this.isanimating = false;
      // 计时器
      this.params.interval;

    }
    _Slide.prototype = {
      // 创建标签
      create: function () {
        var that = this
        // 创建图片框
        function createImgBox() {
          var ul = document.createElement('ul');
          ul.className = 'container'
          var partition = that.params.partition
          if (partition < 2) {
            $(ul).css({
              'transform-style': 'preserve-3d',
              transition: 'all 1s'
            })
          }
          // li是分割多少份
          for (let index = 0; index < partition; index++) {
            var li = document.createElement('li')
            var direction = that.params.direction
            li.className = 'items'
            if (partition == 0) partition = 1;
            if (partition > 1) {
              $(li).css({
                width: direction === 'portrait' ? 100 / partition + '%' : '100%',
                height: direction === 'portrait' ? '100%' : 100 / partition + '%',
                'transform-style': 'preserve-3d',
                transition: 'all 1s'
              });
            }
            // div是每份几个面
            var length = that.params.imgs.length
            for (let i = 0; i < length; i++) {
              var imgSrc = that.params.imgs[i]
              var div = document.createElement('div')
              div.className = 'item'
              div.style.background = 'url(' + imgSrc + ') no-repeat';
              div.style['background-position'] = direction === 'portrait' ? -($this.width() / partition) * index + 'px 0px' : '0px ' + (-($this.height() / partition) * index) + 'px';
              // 纵向
              if (direction === 'portrait') {
                if (i === length - 1) {
                  div.style.transform = 'rotateX(-' + (360 / length) + 'deg)' + ' translateZ( ' + $this.height() / 2 + 'px)'
                } else {
                  div.style.transform = 'rotateX(' +( i * (360 / length) )+ 'deg)' + ' translateZ( ' + $this.height() / 2 + 'px)'
                }

              } else {
                // 横向
                if (i === length - 1) {
                  div.style.transform = 'rotateY(-' + (360 / length) + 'deg)' + ' translateZ( ' + $this.width() / 2 + 'px)'
                } else {
                  div.style.transform = 'rotateY(' +( i * (360 / length) )+ 'deg)' + ' translateZ( ' + $this.width() / 2 + 'px)'
                }

              }

              $(li).append(div)
            }
            $(ul).append(li)
          }
          return ul
        }
        // 创建控制框
        function createControlBox() {
          var div = document.createElement('div');
          div.className = 'control'
          var arr = [{
            className: 'prev',
            text: '<'
          }, {
            className: 'next',
            text: '>'
          }]
          $.each(arr, function (index, item) {
            var a = document.createElement('a')
            a.href = 'javascript:;'
            a.className = item.className
            $(a).text(item.text)
            $(div).append(a)
          })
          return div
        }
        // 创建下标框
        function createIndexBox() {
          var ol = document.createElement('ol')
          ol.className = 'indexBox'
          for (let i = 0; i < that.params.indexList; i++) {
            var li = document.createElement('li')
            if (i == 0) {
              li.className = 'ib_active'
            }
            $(ol).append(li)
          }
          return ol
        }
        // 将图片添加到轮播图中
        $this.append(createImgBox())
        if (this.params.isControl) {
          $this.append(createControlBox())
          // 绑定事件
          // 上一步
          $('.prev').on('click', function () {
            that.scroll('+')
          })
          // 下一步
          $('.next').on('click', function () {
            that.scroll('-')
          })
        }
        if (this.params.isIndex) {
          $this.append(createIndexBox())
        }
        // 绑定鼠标计入和鼠标离开事件
        $this.on('mouseover', function () {
          // 左右箭头高亮
          if (that.params.isControl) {
            $('.control a').css({
              background: 'rgba(0, 0, 0, .5)'
            });
          }
          if (that.params.automatic) {
            clearInterval(that.params.interval)
          }
          // 停止计时器

        }).on('mouseout', function () {
          if (that.params.isControl) {
            $('.control a').css({
              background: 'transparent'
            });
          }
          // 开始滚动
          if (that.params.automatic) {
            that.play()
          }
        })
      },
      // 滚动
      scroll: function (waveNum) {
        // 是否在动画中如果在不执行 （反之多次点击）
        if (this.isanimating == true) return;
        // 停止计时器

        if (waveNum === '-') {
          this.waveNum--
        } else if (waveNum === '+') {
          this.waveNum++
        } else {
          this.waveNum = waveNum
        }
        // 当前下标
        var indexCount = 0
        if (Math.abs(this.waveNum) < this.waveMaxNum) {
          indexCount = Math.abs(this.waveNum)
        }
        if (Math.abs(this.waveNum) % this.waveMaxNum > 0) {
          indexCount = Math.abs(this.waveNum) % this.waveMaxNum
        }
        // 将动画中变量设置true
        this.isanimating = true;
        // 获取图片的张数
        var imgSum = this.params.imgs.length
        var that = this
        // 图形动画
        if (this.params.partition > 1) {
          // 横向
          if (this.params.direction === 'transverse') {
            $('.items').each(function (i, v) {
              $(v).css({
                'transform': 'rotateY(' +( that.waveNum * (360 / imgSum) )+ 'deg)',
                'transitionDelay': i * 0.25 + 's'
              });
            });
          } else {
            $('.items').each(function (i, v) {
              $(v).css({
                'transform': 'rotateX(' +( that.waveNum * (360 / imgSum) )+ 'deg)',
                'transitionDelay': i * 0.25 + 's'
              });
            });
          }

        } else {
          // 横向
          if (this.params.direction === 'transverse') {
            $('.container').css({
              'transform': 'rotateY(' +( that.waveNum * (360 / imgSum) )+ 'deg)'
            })
          } else {
            $('.container').css({
              'transform': 'rotateX(' +( that.waveNum * (360 / imgSum) )+ 'deg)'
            })
          }

        }

        // 索引样式切换
        $('.indexBox li').removeClass('ib_active')
        $('.indexBox li').eq(indexCount).addClass('ib_active')
        // 动画结束后将动画进行设置为false
        setTimeout(function () {
          that.isanimating = false
        }, $('.items').length * 0.25 * 1000);
      },
      // 自动轮播
      play: function () {
        clearInterval(this.params.interval)
        var that = this
        var automatic_itemc = this.params.automatic_item + $('.items').length * 0.25 * 1000
        this.params.interval = setInterval(function () {
          that.waveNum--
          that.scroll(that.waveNum)
        }, automatic_itemc)
      },
      // 初始化
      init: function () {
        // 创建标签
        this.create()
        // 自动
        var that = this
        if (this.params.automatic) {
          this.play()
        }
        // 解决离开页面再回来多次滚动bug
        // document添加visibilitychange事件
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) {
            if (that.params.automatic) {
              that.play()
            }
          } else {
            clearInterval(that.params.interval)
          }
        }, false);
        console.log(this.params)
      }
    }
    // 检验毕传参数是否有值
    if (imgs.length > 0) {
      // 创建对象
      if (imgs.length > 2) {
        var _slide = new _Slide(params);
        _slide.init()
      } else {
        var arr = []
        for (var i = 0; i < 4; i++) {
          arr[i] = imgs[i] ? imgs[i] : imgs[i - imgs.length]
        }
        params.imgs = arr;
        var _slide = new _Slide(params);
        console.log(`_slide`, _slide);
        _slide.init()
      }
    } else {
      alert('请传入图片相对路径的数组，请仔细阅读文档')
      return;
    }
  }
})
