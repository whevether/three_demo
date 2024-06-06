import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import 'style/demo3.scss';
import { Clock, DirectionalLight, Group, LoadingManager, MeshPhongMaterial, PerspectiveCamera, PointLight, SRGBColorSpace, Scene, WebGLRenderer } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Easing, Tween, remove, update } from 'three/examples/jsm/libs/tween.module.js';
let oldMaterial, renderer, renderer2, camera, camera2;
const Demo3 = () => {
  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null);
  const wapperRef = useRef(null);
  const secondRef = useRef(null);
  const [loadStyle, setLoadStyle] = useState({}); // 加载样式
  const [hideLoadText, setHideLoadText] = useState(false); //是否隐藏加载文字
  const [hideLoad, setHideLoad] = useState(false); // 是否隐藏加载
  const [hideContent, setHideContent] = useState({ 'visibility': 'hidden' }); // 容器样式
  const [cursorStyle, setCursorStyle] = useState({}); // 鼠标样式
  const [active,setActive] = useState(0);
  //  这是一个使用redux 封装axios中间件请求示例
  const head = () => {
    return (
      <Helmet>
        <title>demo3</title>
        <meta property="og:title" content="demo3" />
      </Helmet>
    );
  };
  const onResize = () => {
    let width = wapperRef.current.clientWidth;
    let height = wapperRef.current.clientHeight;
    camera.aspec = width / height;
    camera.updateProjectionMatrix();

    camera2.aspec = width / height;
    camera2.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer2.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  useEffect(() => {
    let width = wapperRef.current.clientWidth;
    let height = wapperRef.current.clientHeight;

    renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true, //开启抗锯齿
      alpha: true,
      powerPreference: 'high-performance',//渲染模式为高性能
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = true; //是否自动清除
    renderer.outputColorSpace = SRGBColorSpace;


    renderer2 = new WebGLRenderer({
      canvas: canvasRef1.current,
      antialias: true,
    });
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer2.autoClear = true;
    renderer2.outputColorSpace = SRGBColorSpace;
    // 初始化场景
    const scene = new Scene();
    //初始化相机组
    const cameraGroup = new Group();
    scene.add(cameraGroup);//相机组加入场景
    // 初始化相机1
    camera = new PerspectiveCamera(35, width / height, 1, 100);
    camera.position.set(19, 1.54, -.1);//设置相机偏移量 坐标
    cameraGroup.add(camera);
    //初始化相机2
    camera2 = new PerspectiveCamera(35, width / height, 1, 100);
    camera2.position.set(3.2, 2.8, 3.2); //设置坐标
    camera2.rotation.set(0, 1, 0); //设置旋转角度
    //直射光
    const directionLight = new DirectionalLight(0xffffff, .8);
    directionLight.position.set(-100, 0, -100);
    scene.add(directionLight);
    //点光源
    const fillLight = new PointLight(0x88ffee, 2.7, 4, 3);
    fillLight.position.set(30, 3, 1.8);
    scene.add(fillLight);
    //加载管理
    const loadingManager = new LoadingManager();
    loadingManager.onLoad = () => {
      setHideContent({ 'visibility': 'visible' });
      const yPosition = { y: 0 };
      // 隐藏加载页面动画
      let t = new Tween(yPosition)
        .to({ y: 100 }, 900)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onUpdate(() => {
          setLoadStyle({ 'transform': `translate(0, ${yPosition.y}%)` });
        }).onComplete(() => {
          setHideLoadText(true);
          remove(t);
        });
      // 给相机添加入场动画
      let tt = new Tween(camera.position.set(0, 4, 2))
        .to({ x: 0, y: 2.4, z: 5.8 }, 3500)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onComplete(() => {
          remove(tt);
        });
      //移除加载
      setHideLoad(true);
      window.scroll(0, 0);
    };
    //使用 dracoLoader 加载压缩过的模型,
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/models_03/draco/'); //dracoLoader是three自带的。一定要匹配当前库，在当前版本的three.js 中复制出来
    dracoLoader.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);
    // loader.resourcePath = 'assets/models_03/';
    //模型加载
    loader.load('assets/models_03/statue.glb', (gltf) => {
      gltf.scene.traverse(obj => {
        if (obj.isMesh) {
          oldMaterial = obj.material;
          obj.material = new MeshPhongMaterial({ shininess: 100 });
        }
      });
      scene.add(gltf.scene);
      oldMaterial.dispose();
      renderer.renderLists.dispose();
    });
    // 鼠标移动时添加虚拟光标
    const cursor = { x: 0, y: 0 };
    document.addEventListener('mousemove', event => {
      event.preventDefault();
      cursor.x = event.clientX / window.innerWidth - .5;
      cursor.y = event.clientY / window.innerHeight - .5;
      setCursorStyle({ 'left': `${event.clientX}px`, 'top': `${event.clientY}px` });
    }, false);
    // 基于容器视图禁用渲染器, 监听第二个容器订阅处理, 当窗口比例位于第一个时候禁用渲染第二个，以避免同时渲染造成开销
    let secondContainer = false;
    const ob = new IntersectionObserver(payload => {
      secondContainer = payload[0].intersectionRatio > 0.05;
    }, { threshold: 0.05 }); //threshold 比例值
    ob.observe(secondRef.current);
    // 页面重绘动画, 利用 clock 绘制间隔来处理重
    const clock = new Clock();
    let previousTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      const parallaxY = cursor.y;
      const parallaxX = cursor.x;
      fillLight.position.y -= (parallaxY * 9 + fillLight.position.y - 2) * deltaTime;
      fillLight.position.x += (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;
      cameraGroup.position.z -= (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
      cameraGroup.position.x += (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;
      update(); // 更新动画 不执行这个，Tween 中的 onUpdate以及之后无法执行
      secondContainer ? renderer2.render(scene, camera2) : renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  // 相机动画
  const animateCamera = (position, rotation) => {
    let t = new Tween(camera2.position)
      .to(position, 1800)
      .easing(Easing.Quadratic.InOut)
      .start()
      .onComplete(() => {
        remove(t);
      });
    let tt = new Tween(camera2.rotation)
      .to(rotation, 1800)
      .easing(Easing.Quadratic.InOut)
      .start()
      .onComplete( () => {
        remove(tt);
      });
  };
  return (
    <div className="demo3-body">
      {head()}
      <div className="demo3-wrapper" ref={wapperRef}>
        <div className="cursor" style={cursorStyle} />
        {
          !hideLoad && <div className="lds-roller"><div /><div /><div /><div /><div /><div /><div /><div /></div>
        }
        {
          !hideLoadText && <div className="loading-text-intro" style={loadStyle}><p>Loading</p></div>
        }

        <div className="content" style={hideContent}>
          <div className="section first">
            <canvas ref={canvasRef} />
          </div>
          <div className="section second" ref={secondRef}>
            <div className="second-container">
              <ul>
                {
                  [{title: '入门',func: ()=>{
                    setActive(0);
                    animateCamera({ x: 3.2, y: 2.8, z: 3.2 }, { y: 1 });
                  }}, {title: '基础',func: ()=>{
                    setActive(1);
                    animateCamera({ x: -1.4, y: 2.8, z: 4.4 }, { y: -0.1 });
                  }}, {title: '进阶',func: ()=>{
                    setActive(2);
                    animateCamera({ x: -4.8, y: 2.9, z: 3.2 }, { y: -0.75 });
                  }}].map((item, index) => <li key={index} className={active === index ? "active" : ''} onClick={item.func}>{item.title}</li>)
                }
              </ul>
              <canvas ref={canvasRef1} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default Demo3;