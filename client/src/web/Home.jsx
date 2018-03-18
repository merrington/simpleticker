import React from 'react';

const Home = () => {
  const CLIENT_ID = 'daa4bed9fce307551d2792cd86be6fadc82a814c4889aaa0c0c88ea972a74919' // TODO?
  const REDIRECT_URI = 'http://localhost:3000/auth-redirect'
  const CSRF = '1234'
  const LOGIN_URL = `https://staging.wealthsimple.com/authorize?` +
                  `client_id=${CLIENT_ID}&` +
                  `redirect_uri=${REDIRECT_URI}&` +
                  `&state=${CSRF}&` +
                  `&scope=read%20write&` +
                  `&response_type=code`;
  return (
    <div>
      <a href={LOGIN_URL}>
        <button class="button primary-action size-lg" >
          Login
        </button>
      </a>
    </div>
  )
}

export default Home
