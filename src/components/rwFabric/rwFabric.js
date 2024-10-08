import {
	fabric
} from "fabric";
import gifuct from "./gifuct-js.js"
export default class rwFabric {

	//new初始化，这个方法都会走
	constructor(id) {
		this._id = id;
		this._canvas = null;
	}


	//初始化SVG
	initSVG(opt) {
		this._canvas = new fabric.Canvas(this._id, {
			backgroundVpt: opt.backgroundVpt | false, // 不受视口变换影响（也就是不管拖拽还是缩放画布，背景图都不受影响）
			isDrawingMode: opt.isDrawingMode | false, //设置是否可以绘制
			selectable: false, //设置是否可以选中拖动  fabric提供的
			selection: opt.selection | false,
			interactive: opt.interactive | false, // 隐藏交互模式
			fireRightClick: opt.fireRightClick | false, // 启用右键，button的数字为3
			stopContextMenu: opt.stopContextMenu | false, // 禁止默认右键菜单
			centeredScaling: true, // 元素中心点缩放
			devicePixelRatio: true, // Retina 高清屏 屏幕支持
			selectionColor: 'transparent',
			selectionBorderColor: 'transparent',
			skipTargetFind: false // 禁止选中
		});
		this._canvas.renderOnAddRemove = true
	}


	//设置背景图
	initSvgScene(opt) {
		var that = this
		fabric.Image.fromURL(opt.imgUrl, (oImg) => {
			oImg.set({
				// 通过scale来设置图片大小，这里设置和画布一样大
				// scaleX: that._canvas.width / oImg.width,
				// scaleY: that._canvas.height / oImg.height,
				scaleX: 1,
				scaleY: 1,
			});
			oImg.id = "-1" //默认为背景
			// 设置背景
			that._canvas.setBackgroundImage(oImg, that._canvas.renderAll.bind(that._canvas));
		});

	}

	/**
	 * 获取所有对象
	 */
	getObjects() {
		return this._canvas.getObjects()
	}
	
	//根据id查找对象
	getObjectById(id) {
		for (var i = 0; i < this.getObjects().length; i++) {
			if(this.getObjects()[i].id === id){
				return this.getObjects()[i]
			}
		}
		return null
	}
	
	/**
	 * 设置活动对象
	 */
	setActiveObject(o) {
		this._canvas.setActiveObject(o)
		this.renderAll()
	}
	//刷新组件状态
	renderAll() {
		this._canvas.renderAll();
	}

	remove(o) {
		this._canvas.remove(o)
	}

	removeById(id) {
		for (var i = 0; i < this.getObjects().length; i++) {
			if(this.getObjects()[i].id === id){
				this.remove(this.getObjects()[i])
			}
		}
	}
	
	//静止操作对象
	lockObject(obj){
		obj.hasBorders = false //不显示选中时的边
		obj.hasControls = false //不显示选中时的9个方块
		//静止移动
		obj.lockMovementX = true
		obj.lockMovementY = true
	}

	// =======================创建对象=====================================//
	//创建文本
	createSvgText(opt) {
		var text = new fabric.Text(opt.text, {
			id: opt.id,
			left: opt.left,
			top: opt.top
		});
		text.set({
			transparentCorners: false,
			cornerColor: 'blue',
			cornerStrokeColor: 'red',
			borderColor: 'red',
			cornerSize: 12,
			padding: 10,
			cornerStyle: 'circle',
			borderDashArray: [3, 3]
		});
		this._canvas.add(text);
	}


	//创建文本和图标
	createSvgImgAndText(opt) {
		var that = this
		// let result = [];
		fabric.Image.fromURL(opt.imgUrl, oImg => {
			oImg.scale(1).set({
				left: opt.imgLeft,
				top: opt.imgTop,
				width: opt.imgWidth,
				height: opt.imgHeight,
				angle: opt.imgAngle, //旋转角度
				selectable: false, //设置是否可以选中拖动  fabric提供的
			});

			const text = new fabric.Text(opt.text, {
				fontSize: opt.textFontSize,
				top: opt.textTop,
				left: opt.textLeft,
				angle: opt.textAngle, //旋转角度

			})
			text.set({
				fill: 'white'
			})

			let group = new fabric.Group([oImg, text])
			group.id = opt.id//给对象添加自定义属性
			group.set({
				transparentCorners: false,
				cornerColor: 'blue',
				cornerStrokeColor: 'red',
				borderColor: 'red',
				cornerSize: 12,
				padding: 10,
				cornerStyle: 'circle',
				borderDashArray: [3, 3],
				selectable: opt.selectable, //设置是否可以选中拖动  fabric提供的
			});
			// that.lockObject(group)
			that._canvas.add(group)
		})
	}

	//创建图标
	createSvgImg(opt) {
		var that = this
		fabric.Image.fromURL(opt.imgUrl, oImg => {
			oImg.scale(1).set({
				left: opt.left,
				top: opt.top,
				width: opt.width,
				height: opt.height,
				angle: opt.angle, //旋转角度
				// 这里可以通过scaleX和scaleY来设置图片绘制后的大小，这里为原来大小的一半
				scaleX: opt.scaleX,
				scaleY: opt.scaleY,

			});
			oImg.id = opt.id//给对象添加自定义属性
			oImg.set({
				transparentCorners: false,
				cornerColor: 'blue',
				cornerStrokeColor: 'red',
				borderColor: 'red',
				cornerSize: 12,
				padding: 10,
				cornerStyle: 'circle',
				borderDashArray: [3, 3],
				selectable: opt.selectable, //设置是否可以选中拖动  fabric提供的
			});

			that._canvas.add(oImg)
		})
	}
	
	//播放gif
	createGif(opt) {
		var that = this;
		var url = opt.imgUrl;
		fabric.Image.fromURL(url, function(img) {
			img.width = opt.width;
			img.height = opt.height;
			img.left = opt.left;
			img.top = opt.top;
			img.scaleX = opt.scaleX;
			img.scaleY = opt.scaleY;
			img.id = opt.id;
			img.zindex = opt.zindex; //目前参数无效
			img.set({
				transparentCorners: false,
				cornerColor: 'blue',
				cornerStrokeColor: 'red',
				borderColor: 'red',
				cornerSize: 12,
				padding: 10,
				cornerStyle: 'circle',
				borderDashArray: [3, 3]
			});

			gif(url, function(frames, delay) {
				var framesIndex = 0,
					animInterval;
				img.dirty = true;
				img._render = function(ctx) {
					ctx.drawImage(frames[framesIndex], -this.width / 2, -this.height / 2, this
						.width, this.height);
				}
				img.play = function() {
					if (typeof(animInterval) === 'undefined') {
						animInterval = setInterval(function() {
							framesIndex++;
							if (framesIndex === frames.length) {
								framesIndex = 0;
							}
						}, delay);
					}
				}
				img.stop = function() {
					clearInterval(animInterval);
					animInterval = undefined;
				}
				img.play();
				that._canvas.add(img);
			})
		})


		function gif(url, callback) {
			var tempCanvas = document.createElement('canvas');
			var tempCtx = tempCanvas.getContext('2d');
			var gifCanvas = document.createElement('canvas');
			var gifCtx = gifCanvas.getContext('2d');
			var imgs = [];
			var xhr = new XMLHttpRequest();
			xhr.open('get', url, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function() {
				var tempBitmap = {};
				tempBitmap.url = url;
				var arrayBuffer = xhr.response;
				if (arrayBuffer) {
					var gif = new GIF(arrayBuffer);
					var frames = gif.decompressFrames(true);
					gifCanvas.width = frames[0].dims.width;
					gifCanvas.height = frames[0].dims.height;

					for (var i = 0; i < frames.length; i++) {
						createFrame(frames[i]);
					}
					callback(imgs, frames[0].delay);
				}

			}
			xhr.send(null);
			var disposalType;

			function createFrame(frame) {
				if (!disposalType) {
					disposalType = frame.disposalType;
				}
				var dims = frame.dims;
				tempCanvas.width = dims.width;
				tempCanvas.height = dims.height;
				var frameImageData = tempCtx.createImageData(dims.width, dims.height);
				frameImageData.data.set(frame.patch);
				if (disposalType !== 1) {
					gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
				}
				tempCtx.putImageData(frameImageData, 0, 0);
				gifCtx.drawImage(tempCanvas, dims.left, dims.top);
				var dataURL = gifCanvas.toDataURL('image/png');
				var tempImg = fabric.util.createImage();
				tempImg.src = dataURL;
				imgs.push(tempImg);
			}
		}
		render()
		
		function render() {
		  if (that._canvas) {
		    that._canvas.renderAll();
		  }
		
		  fabric.util.requestAnimFrame(render);
		}
	}


	/**
	 * 重置层级
	 */
	resetLayer(){
		function sortByValue(propName) {
			return function(a, b) {
			return a[propName] - b[propName];
			};
		}
		let objects = this._canvas.getObjects()
		objects.sort(sortByValue('objIndex'))//根据objIndex排序，objIndex就是自定义的层级字段
		for (var i = 0; i < objects.length; i++) {
			objects[i].moveTo(i)
		}
		this.renderAll()
	}
	


	// =======================创建事件=====================================//
	/**拖东事件
	 */
	initMoveEvent(func) {
		var that = this
		that._canvas.on('object:moving', function(event) {
			var id;
			if (event.target) {
				id = event.target.id
			}
			if (id) {
				that._canvas.getObjects().forEach(function(o) {
					if (o.id === id) {
						if (typeof(func) == 'function') {
							func(o,true)
						}
					}
				})
			} else {
				func("点击空白位置", false)
			}
		});
	}
	/**
	 * 左键up事件
	 */
	initUpEvent(func) {
		var that = this
		that._canvas.on('mouse:up', function(event) {
			var id;
			if (event.target) {
				id = event.target.id
			}
			if (id) {
				that._canvas.getObjects().forEach(function(o) {
					if (o.id === id) {
						if (typeof(func) == 'function') {
							func(o, true)
						}
					}
				})
			} else {
				func("点击空白位置", false)
			}
		});
	}
	/**
	 * 左键down事件
	 */
	initDownEvent(func) {
		var that = this
		that._canvas.on('mouse:down', function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}
	/**旋转事件
	 */
	initRotatingEvent(func) {
		var that = this
		that._canvas.on("object:rotating", function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}

	/**缩放事件
	 */
	initScalingEvent(func) {
		var that = this
		that._canvas.on("object:scaling", function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}

	/**双击
	 * @param {Object} func
	 */
	initDblclickEvent(func) {
		var that = this
		that._canvas.on('mouse:dblclick', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}


	/**右击
	 * @param {Object} func
	 */
	initRightClickEvent(func) {
		window.oncontextmenu = function(e) {
			e.preventDefault()
		}

		var that = this
		that._canvas.on('mouse:down', function(e) {
			if (e.button != 3) {
				return
			}
			if (!e.target) {
				return
			}
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})

	}

	/**移出
	 * @param {Object} func
	 */
	initOutEvent(func) {
		var that = this
		that._canvas.on('mouse:out', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}

	/**移入
	 * @param {Object} func
	 */
	initOverEvent(func) {
		var that = this
		that._canvas.on('mouse:over', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}

	// 创建直线
	createLine(opt) {
		// 创建直线对象
		var line = new fabric.Line([opt.startPoint.x, opt.startPoint.y, opt.endPoint.x, opt.endPoint.y], {
			stroke: opt.color?opt.color:"#c45656",
			strokeWidth: opt.strokeWidth?opt.strokeWidth:4, // 默认设置线条粗细为4像素
		});
		this._canvas.add(line)
	}
}
