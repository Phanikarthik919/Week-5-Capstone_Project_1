import React from 'react';
import { Link } from 'react-router-dom';
import { pageBackground, pageWrapper, pageTitleClass, bodyText, primaryBtn } from '../styles/common';

const Home = () => {
  return (
    <div className={pageBackground}>
      <div className={pageWrapper + " text-center"}>
        <h1 className={pageTitleClass + " mb-4"}>Welcome to BlogApp</h1>
        <p className={bodyText + " max-w-lg mx-auto mb-10"}>
          Join our community and start sharing your thoughts. Read insightful articles from authors around the world.
        </p>
        <Link to="/login">
          <button className={primaryBtn + " px-8 py-3 text-base"}>
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
