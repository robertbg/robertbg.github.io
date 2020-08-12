/**
 * Loading animation originally created by Dev Tips.
 * Codepen: https://codepen.io/devtips/pen/xZdJaE
 * Converted to SCSS and React by me
 */

import React from 'react';

import './loader.scss';

const Loader = () => (
  <div className="loader">
    <div className="bb8">
      <div className="bb8-body">
        <div className="dot dot-1">
          <div className="line line-1" />
          <div className="line line-2" />
          <div className="line line-3" />
        </div>
        <div className="dot dot-2" />
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>
      <div className="body-shadow-crop">
        <div className="body-shadow" />
      </div>
      <div className="bb8-head">
        <div className="head-bottom">
          <div className="head-side-1" />
          <div className="head-side-2" />
          <div className="head-bottom-base" />
        </div>
        <div className="head-top-crop">
          <div className="head-top" />
        </div>
        <div className="lens" />
        <div className="freckle" />
      </div>
    </div>
  </div>
);

export default Loader;
