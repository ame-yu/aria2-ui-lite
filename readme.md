# aria2-PWA
![](https://raw.githubusercontent.com/ame-yu/Aria2-PWA/master/docs/img/preview.png)
纯控制台不包括aria2

效果类似于http://aria2c.com/
-[关联项目](https://github.com/binux/yaaw)

但是MIT协议可以放心二次开发

但是更加轻量，无框架，最精简的控制台

而且可以作为PWA安装,方便离线。

也可直接下载HTML本地打开。

方便开发人员定制Aria2 页面

面向的是现代浏览器,浏览器原生API,所以不使用Jquery等库去兼容老浏览器

因为是轻量级的，就提供增删改查，这个版本不支持单个任务的设置

除非本人有这个需求或star过100了

轻量便携，未压缩不足12K。

MIT licence

### 开发
注意我使用了parcel-plugin-inliner

所以dist/index.html 是包含了CSS和JS的文件不需要依赖网络

可以直接对index.html就能直接再编辑
#### 打包

### 推荐使用方法（windows为例）
新建run.bat
```cmd
start /min start index.html
aria2c.exe --conf-path=aria2.conf.txt
```
