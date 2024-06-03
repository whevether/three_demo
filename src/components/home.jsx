import React from 'react';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as fetchAction from 'store/actions/fetch';
import '../style/home.scss';
import { NavLink } from 'react-router-dom';
// import { List } from 'antd-mobile';   //测试代码
/* eslint-disable react/no-multi-comp */
const Home = () => {
    //  这是一个使用redux 封装axios中间件请求示例
    const head = () => {
        return (
            <Helmet>
                <title>主页</title>
                <meta property="og:title" content="主页" />
            </Helmet>
        );
    };
    const list = [];
    for (let i = 1; i < 15; i++) {
        list.push(i);
    }
    return (<>
        {head()}
        {
            list.map((item,index) => (<div key={index} className="route-wrapper">
                <NavLink to={`/demo${item}`} className="route-item">demo{item}</NavLink>
                <div className="fgx" />
            </div>))
        }
    </>
    );
};
Home.propTypes = {
    data: PropTypes.objectOf(Array)
};
const mapStateToProps = (state) => {
    return {
        data: state.home.data
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(fetchAction, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);