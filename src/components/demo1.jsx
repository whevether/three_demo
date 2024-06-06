import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
let renderer, scene, camera;
const Demo1 = () => {
  const canvasRef = useRef(null);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  //  这是一个使用redux 封装axios中间件请求示例
  const head = () => {
    return (
      <Helmet>
        <title>demo1</title>
        <meta property="og:title" content="demo1" />
      </Helmet>
    );
  };
  const onResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // 更新渲染
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  };
  useEffect(() => {
    //初始化渲染器
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //
    scene = new THREE.Scene();
    //初始化相机
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 3;
    scene.add(camera);
    //创建网格对象
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#2BA471' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('resize', onResize);
    const tick = () => {
      // 更新渲染器
      renderer.render(scene, camera);
      //给网络模型添加一个转动动画
      mesh && (mesh.rotation.y += .02);
      mesh && (mesh.rotation.x += .02);
      //页面重绘时调用自身
      window.requestAnimationFrame(tick);
    };
    tick();
    //初始化场景
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <div className="demo1-wrapper">
      {head()}
      <canvas ref={canvasRef} />
    </div>
  );
};
export default Demo1;