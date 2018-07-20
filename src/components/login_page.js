import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom'
import Color from 'color';
import {login, getLocations,getShifts,settings} from '../actions/index';
import {Notification} from 'react-pnotify';
import ResetPassword from '../components/reset_password_modal.js'
import {shake} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
  shake: {
    animation: 'x 1s',
    animationName: Radium.keyframes(shake, 'shake')
  }
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isClicked: false,
      message: '',
      link: '/'
    };
    this.onInputChangeUsername = this.onInputChangeUsername.bind(this);
    this.onInputChangePassword = this.onInputChangePassword.bind(this);
  }
  
  
  onInputChangeUsername(event) {
    this.setState({isClicked: false});
    this.setState({username: event.target.value});
  }
  
  onInputChangePassword(event) {
    this.setState({isClicked: false})
    this.setState({password: event.target.value});
  }
  
  isClicked = () => {
    this.setState({isClicked: true});
    if (this.state.username && this.state.password) {
      this.props.login(this.state.username, this.state.password).then(response => {
        this.props.settings().then(response=>{
          this.props.getLocations(response.token).then(response=>{
                this.props.history.push('/dispatchweb-master');
                setTimeout(function () {
                    localStorage.clear();
                },10*60*60*1000)
              if (!localStorage.getItem('token')) {
                  this.props.history.push('/')
              }
                })
    .catch(error=>{
            console.log(error.response.data.error.message)
          });})
        }).catch(error=>{
          console.log(error.response.data.error.message)
      })
      .catch(error => {
        if (error.response) {
          this.setState({message: error.response.data.error.message});
        }
      })
    }
    
    setTimeout(() => {
      this.setState({isClicked: false});
    }, 1000)
    this.setState({message: ''});
    
  }
  
  
  notify(text) {
    return <Notification
      type='notice'
      text={text}
      delay={2000}
      shadow={false}
      hide={true}
      nonblock={true}
      desktop={true}
    />
  }
  
  render() {
    
    if (localStorage.getItem('token')) {
      this.props.history.push('/dispatchweb-master')
    }
    return (
      
      <div className="login-page" >
        
        <div id="loading"
             style={{
               width: 100 + "%", position: "fixed", height: 100 + "%", backgroundColor: Color('rgba(0,0,0,.7)'),
               zIndex: 2147483647, display: 'none'
             }}
        >
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
        
        
        <div className="page-center" style={{width: 100 + "%", position: "fixed", height: 100 + "%"}}>
          <div className="page-center-in">
            <div className="container-fluid">
              <form className="sign-box login-box">
                <div className="sign-avatar">
                  <img id="main_logo" src="img/logo-white.png" width="300" alt=""/>
                </div>
                <div className="empty-xs-40 empty-md-40"></div>
                <div className="form-group">
                  {this.state.isClicked && !this.state.username && !this.state.password ||
                  this.state.isClicked && !this.state.username && this.state.password ?
                    
                    <StyleRoot>
                      <input type="text" className="form-control" name="username" id="login_username"
                             ref="login_username"
                             style={styles.shake}
                             onChange={(event) => this.onInputChangeUsername(event)}
                             placeholder="Username"/>
                    </StyleRoot>
                    :
                    <input type="text" className="form-control" name="username" id="login_username"
                           onChange={(event) => this.onInputChangeUsername(event)}
                           placeholder="Username"/>}
                
                
                </div>
                <div className="form-group">
                  {this.state.isClicked && !this.state.username && !this.state.password ||
                  this.state.isClicked && this.state.username && !this.state.password ?
                    
                    <StyleRoot>
                      <input type="password" className="form-control" name="password" id="login_password"
                             onChange={(event) => this.onInputChangePassword(event)}
                             style={styles.shake}
                             placeholder="Password"/>
                    </StyleRoot>
                    :
                    <input type="password" className="form-control" name="password" id="login_password"
                           onChange={(event) => this.onInputChangePassword(event)}
                           placeholder="Password"/>}
                </div>
                <div className="form-group">
                  <div className="float-right reset">
                    <ResetPassword/>
                  </div>
                </div>
                
                <Link className="btn btn-yellow width100" id="login-link" to='/'
                      onClick={this.isClicked}
                >Login </Link>
                
                <div>
                  
                  {
                    this.state.isClicked && !this.state.username && !this.state.password ?
                      <div> {this.notify('All Fields are Required')}</div>
                      :
                      <div>
                      </div>
                  }
                  {this.state.isClicked && this.state.username && !this.state.password ?
                    <div> {this.notify('Password is Required')}</div> : <div></div>
                  }
                  {this.state.isClicked && !this.state.username && this.state.password ?
                    <div> {this.notify('Username is Required')}</div>
                    : <div></div>
                  }
                  {this.state.isClicked && this.state.message ?
                    <div> {this.notify(this.state.message)}</div>
                    : <div></div>
                  }
                
                </div>
              
              </form>
            
            </div>
          </div>
        </div>
      
      
      </div>
    
    
    );
    
    
  }
}

function mapStateToProps(state) {
  return {
    customer_data: state.customer_data,
    websiteData:state.websiteData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({login, getLocations,getShifts,settings}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);