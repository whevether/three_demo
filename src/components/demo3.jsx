import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import 'style/demo3.scss';
const Demo3 = () => {
  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null);
  //  这是一个使用redux 封装axios中间件请求示例
  const head = () => {
    return (
      <Helmet>
        <title>demo3</title>
        <meta property="og:title" content="demo3" />
      </Helmet>
    );
  };
  return (
    <div className="demo3-body">
      {head()}
      <div className="demo3-wrapper">
        <div className="cursor" />
        <div className="lds-roller"><div /><div /><div /><div /><div /><div /><div /><div /></div>
        <div className="loading-text-intro"><p>Loading</p></div>
        <div className="content">
          <div className="section first">
            <canvas ref={canvasRef} />
          </div>
          <div className="section second" >
            <div className="section-content">
              <ul>
                {
                  ['入门', '基础', '进阶'].map((item, index) => <li key={index}>{item}</li>)
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