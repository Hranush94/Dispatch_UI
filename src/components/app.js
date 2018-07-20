import React, { Component } from 'react';
import { BrowserRouter ,Route } from 'react-router-dom';
import LoginPage from '../components/login_page';
import Main from './main';
// import SetLocation from '../components/select_location_modal';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div style={{height:100+'%'}}>
          <Route path="/" exact component={LoginPage}/>
          <Route path="/dispatchweb-master" component={Main}/>
        </div>
        
      </BrowserRouter>
    );
  }
}


