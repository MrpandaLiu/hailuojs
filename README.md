# Hailuo.js

> 一款渐进式 MVVM 轻量级框架

## 1. 快速上手

1. 通过cdn引入`Hailuo`
```
<script src="https://cdn.jsdelivr.net/npm/hailuo@1.0.6/lib/index.min.js"></script>
```

2. 创建一个`app`对象
``` js
const App = H.createApp(`
    <div>
        My name is: 
        <span h-bind="test"></span>
    </div>
`);
```

3. 设置响应式数据
``` js
App.useReactive({
    name: 'panda'
});
```

4. 添加方法
``` js
App.register('handleClick', () => {
    console.log('this is a func');
    App.states.name = 'cat';
});
```

5. 将该组件定义到全局`Hailuo`对象中
``` js
H.define('app', App);
```
    
6. 当组件编译完成后，将组件添加到当前DOM树中
``` js
App.onMount(() => {
    console.log('this is mounted');
    document.querySelector('#root').appendChild(window.Hailuo.app);
});
```

## 2. API参考

Todo

## 3. 设计思想

> Why we need Hailuo.js ?

在市面上流行了诸如vue、react等业界先进MVVM框架的现在，一套轻量的框架是否还有存在的必要呢？  
答案是：有的。  
如果我们是一个前端小白，当有一个项目摆在你面前时：how to do it ？如果使用jquery等早期技术，很难从中学习到现代前端框架的精髓且效率并不高，如果使用vue、react，从入门到上手应用需要一定时间的积累，学习成本相对较高。  
就这样，应用MVVM思想且概念少容易上手——Hailuo.js应运而生。

- MVVM

Hailuo的响应式基础是`Object.defineProperty`，通过观察者模式，进行依赖收集，在必要时进行更新，实现双向数据绑定（Two-way data binding）。

- template

HTML部分由模板字符串直接生成至真实DOM，再通过递归对每一个元素添加Hailuo api的能力。

- component

Hailuo是将所有声明过的组件都注册在`window.Hailuo`这个对象里，这样将有利于组件间的任意调用和外部组件的引入。
    