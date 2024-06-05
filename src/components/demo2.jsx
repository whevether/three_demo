import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
// 加载模型
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const Demo1 = () => {
  const canvasRef = useRef(null);
  let renderer, scene, camera;
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  //  这是一个使用redux 封装axios中间件请求示例
  const head = () => {
    return (
      <Helmet>
        <title>demo2</title>
        <meta property="og:title" content="demo2" />
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
    // 初始化场景
    scene = new THREE.Scene();
    // 设置场景背景
    scene.background = new THREE.Color(0x1A1A1A);
    //设置背景雾化
    scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

    //初始化相机
    camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height);
    scene.add(camera);
    camera.position.set(0, 0, 5);
    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    // 添加环境光 黑色背景下只有白色才能正确显示出模型来
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    directionalLight.intensity = 15; // Adjust as needed

    // Experiment with the light position to find the best angle for illumination
    directionalLight.position.set(5, 5, 5); // Adjust the position values as needed

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Adjust the intensity as needed
    scene.add(ambientLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, .5); // Adjust color and intensity as needed
    fillLight.position.set(-5, -3, -5); // Position it opposite the main light to fill shadows
    scene.add(fillLight);
    //加载材质模型与物体模型
    // const mtlLoader = new MTLLoader();
    // const objLoader = new OBJLoader();
    // mtlLoader.setCrossOrigin('anonymous');//设置允许所有源
    // objLoader.setCrossOrigin('anonymous');

    // // 设置材质加载路径
    // mtlLoader.resourcePath = 'assets/models_02/';
    // mtlLoader.load('assets/models_02/earth.mtl',(materials)=>{
    //   //预加载
    //   materials.preload();
    //   materials.side = THREE.DoubleSide;
    //   objLoader.setMaterials(materials);
    //   //加载模型文件
    //   objLoader.load('assets/models_02/earth.obj',(object)=>{
    //     //设置模型缩放
    //     object.scale.set(50,50,50);
    //     object.children.map(item=>{
    //       const mateialName = item.material.name;
    //       item.material = materials.materials[mateialName];
    //       if(item.name === 'Earth_Sphere'){
    //         item.visible = true;
    //         object.add(new THREE.Mesh(item.geometry,item.material));
    //       }else{
    //         item.material.opacity = 0.2;
    //       }
    //       console.log(object);
    //       scene.add(object);
    //     });
    //   });
    // });
    // 材质图片
    const textureLoader = new THREE.TextureLoader();
    // textureLoader.resourcePath = 'assets/models_02/';
    const earthTexture = textureLoader.load('/assets/models_02/Earth_diffuse_8k.png', texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false; // Texture-specific adjustments
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });
    const loader = new FBXLoader();
    loader.resourcePath = 'assets/models_02/';
    loader.load('/assets/models_02/earth_01.fbx', (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.map = earthTexture;
          child.material.needsUpdate = true;
        }
      });
      scene.add(object);
    });
    // 创建星球
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x03c03c,
      wireframe: true
    });
    const sphereGeometry = new THREE.SphereGeometry(80, 32, 32);
    const planet = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //创建轨道环
    const torusGeometry = new THREE.TorusGeometry(150, 8, 2, 120);
    const torudMaterial = new THREE.MeshLambertMaterial({
      color: 0x40a9ff,
      wireframe: true
    });
    const ring = new THREE.Mesh(torusGeometry, torudMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = -0.1 * (Math.PI / 2);
    //创建卫星
    const iconGeometry = new THREE.IcosahedronGeometry(16, 0);
    const iconMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
    const satellite = new THREE.Mesh(iconGeometry, iconMaterial);
    //创建彗星
    const stars = new THREE.Group();
    for (let i = 0; i < 500; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
      const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 700;
      mesh.position.y = (Math.random() - 0.5) * 700;
      mesh.position.z = (Math.random() - 0.5) * 700;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;
      scene.add(mesh);
    }
    scene.add(stars);

    window.addEventListener('resize', onResize);
    let rot = 0;
    // 轨道卫星动画, 3点坐标
    const axis = new THREE.Vector3(0, 0, 1);
    const tick = () => {
      // 更新渲染器
      renderer.render(scene, camera);
      // 给网格模型添加一个旋转动画
      rot += Math.random() * 0.8;
      const radian = (rot * Math.PI) / 180;
      //星球位置动画
      planet && (planet.rotation.y + .005);
      ring && ring.rotateOnAxis(axis, Math.PI / 400);
      // 卫星位置动画 坐标与角度
      satellite.position.x = 250 * Math.sin(radian);
      satellite.position.y = 100 * Math.cos(radian);
      satellite.position.z = -100 * Math.cos(radian);
      satellite.rotation.x += 0.005;
      satellite.rotation.y += 0.005;
      satellite.rotation.z -= 0.005;

      // 星星动画 坐标
      stars.rotation.y += 0.0009;
      stars.rotation.z -= 0.0003;

      controls.update();
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
    <div className="demo2-wrapper">
      {head()}
      <canvas ref={canvasRef} />
    </div>
  );
};
export default Demo1;