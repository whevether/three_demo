import React from 'react';
import PropTypes from 'prop-types';
import {/*Routes, Route*/ useRoutes } from 'react-router-dom';
import { connect } from 'react-redux';
//总布局
import RootLayout from './rootLayout';
//默认布局
import DefaultLayout from './defaultLayout';
//分割路由
import LoadableComponent from './LoadableComponent';
/* 页面 */
const Home = LoadableComponent(() => import(/* webpackPrefetch: true */'../components/home'));
const Demo1 = LoadableComponent(() => import(/* webpackPrefetch: true */'../components/demo1'));
const NotFound = LoadableComponent(() => import(/* webpackPrefetch: true */'../components/nodeFound'));
/* Routes 相当于 v4 v5中的switch路由 */
const routes = [{
  path: "/",
  element: <RootLayout />,
  children:[{
    element: <DefaultLayout />,
    children: [{
      index: true,
      element: <Home />
    },{
      path: 'demo1',
      element: <Demo1 />
    },{
    path: '*',
    element: <NotFound />
    }]
  }]
}];
// react路由.
const App = () => {
  return (
    <div className="main" >
      {useRoutes(routes)}
      {/* <Routes>
        // 根布局
        <Route path="/" element={<RootLayout />}>
          // 默认布局
          <Route element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route element={<RedBull />} path="redbull"/>
            // 子路由
            <Route path="snacks" element={<Snacks />}>
              <Route path="one" element={<One />} />
              <Route path="two" element={<Two />} />
            </Route>
            <Route element={<Keep />} path="keep"/>
          </Route>
          // 登录页面布局
          <Route element={<LoginLayout />}>
            <Route element={<Login />} path="login" index/>
          </Route>
          // 401页面
          <Route element={<Error401 />} path="401"/>
          // 没有找到页面
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes> */}
    </div>
  );
};
App.propTypes = {
  route: PropTypes.object,
  routes: PropTypes.arrayOf(Object)
};
export default connect(state => ({
  state: state.state,
}))(App);