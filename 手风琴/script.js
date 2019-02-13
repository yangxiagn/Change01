function XyGallery(id, option) {
  var container = document.getElementById(id);
  if (!~container.className.indexOf('xy-gallery')) container.className += " xy-gallery";
  var defaultOption = {
    defaultWidth: 130,
    defaultHeight: 40,
    activeWidth: 340,
    activeHeight: 400,
    animateDuration: 300   //300毫秒
  }

  option = Object.assign({}, defaultOption, option);

  if (option.width && option.height && option.width * option.height != container.children.length) throw "width and height not match children length!";

//当鼠标滑动太快，过渡时间未完成，会造成页面效果混乱，
//鼠标一移入就开始计时，毫秒
//当第二次滑入时，判断是否执行完成，如果没有就不调用更改图片大小的代码；
  var lastRunTime = new Date(0);  //设置时间是1970年
  var runId = 0;   //定时函数
  //移动照片，让图片有放大的功能；
  var activePicture = function (index) {
    clearTimeout(runId)     //清除一次性定时器
    var currentTime = new Date();   //设置当前时间
    if (currentTime - lastRunTime < option.animateDuration) {  //当前的时间-最后的时间<300毫秒的话，就执行
      runId = setTimeout(function () {
        activePicture(index)
      }, option.animateDuration);
      return;
    }
    lastRunTime = currentTime;

    container.style.width = (option.width - 1) * option.defaultWidth + option.activeHeight + 'px';
    var cx = index % option.width;
    var cy = Math.floor(index / option.width);
    for (var x = 0, xl = option.width; x < xl; x++) {
      for (var y = 0, yl = option.height; y < yl; y++) {
        var cindex = y * option.width + x;
        var item = container.children[cindex];
        if (x == cx && y == cy) {
          item.className = "active";     //当移动到当前图片，样式就加上active
          item.style.width = option.activeWidth + "px";
          item.style.height = option.activeHeight + "px";
        } else if (x == cx) {
          item.className = "";
          item.style.width = option.activeWidth + "px";
          item.style.height = option.defaultHeight + "px";
        } else if (y == cy) {
          item.className = "";
          item.style.width = option.defaultWidth + "px";
          item.style.height = option.activeHeight + "px";
        } else {
          item.className = "";
          item.style.width = option.defaultWidth + "px";
          item.style.height = option.defaultHeight + "px";
        }
      }
    }
  }
  activePicture(0);

  var runId = 0;
  Array.prototype.forEach.call(container.children, function (o, i) {
    o.addEventListener('mouseenter', function () {
      activePicture(i);
    })
  })

  return {
    active: activePicture,
    setSize: function(width, height){
      if (width && height && width * height != container.children.length) throw "width and height not match children length!";
      option.width = width;
      option.height = height;
      activePicture(0)
    }
  }
}