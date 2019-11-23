
# 3d轮播图 （jq插件）

## 介绍

> 利用css3的3d属性将图片分布到立方体的每个面，点击上一个下一个的时候实现图片的轮播

## jq插件的使用

### jq的版本

> jquery-3.0.0.min.js

### 配置项

| 配置项 | 配置值 | 默认值 | 是否必填 | 备注 |
| :---  | :--- | :--- | :---  | ---: |
| carouselBox | 轮播图在外层的父盒子 | 无 | 是 | 无 |
| imgs | 图片的数组 | 无 | 是 | 目前只支撑2张图和4张图 |
| isIndex | 是否显示下标 | true | 否 | Boolean类型 |
| isControl | 是否显示左右键头 | true | 否 | Boolean类型 |
| automatic | 自动轮播 | true | 否 | Boolean类型 |
| automatic_item | 自动轮播时间 | 3000 | 否 | 毫秒值 |
| direction | 轮播方向 | portrait | 否 | 轮播方向 portrait 纵向滚动 transverse 横向滚动 都是字符串类型 默认纵向|
| partition | 分割数 | 4 | 否 | 纵向是宽的公约数 横向是高的公约数 如果不是公约数切割会出现不准的情况|

### 使用方法

```javascript
    $("#carouselBox").slide({
      imgs: ['1.png','2.png','3.png','4.png']
    });
```
