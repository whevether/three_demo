import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, Navigate, } from 'react-router-dom';
// 登入页布局

const DefaultLayout = (props) => {
  const renderProtectedRoute = () => {
    return (
      <div className="DefaultLayout-wrapper" >
        {/* 路由占位符  */}
        <Outlet />
      </div>
    );

  };
  return (
    <>
      {
        !props?.home?.logout && renderProtectedRoute()
      }
      {
        props?.home?.logout && <Navigate to="/login" replace />
      }
    </>
  );
};
DefaultLayout.propTypes = {
  routes: PropTypes.object,
  home: PropTypes.object
};
export default connect(state => ({
  home: state?.home
}))(DefaultLayout);