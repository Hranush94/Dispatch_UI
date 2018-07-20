import React from 'react';
import {Modal} from 'react-bootstrap';
import {Notification} from 'react-pnotify';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {resetPassword, verifyPassword, newPassword} from '../actions/index';
import {shake} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
  shake: {
    animation: 'x 1s',
    animationName: Radium.keyframes(shake, 'shake')
  }
}

class ResetPassword extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      modalState: 1,
      show: false,
      value: 0,
      isClicked: false,
      phone: '',
      code: '',
      message: '',
      newPass1: '',
      newPass2: '',
      wasChanged: false,
      style: '',
    };
    
  }
  
  handleClose = () => {
    this.setState({show: false});
    this.setState({isClicked: false})
  
  }
  
  handleShow = (event) => {
    event.preventDefault();
    this.setState({value: (this.state.value + 1)});
    if (this.state.value >= 1) {
      this.setState({isClicked: true})
    }
    this.setState({show: true});
    if (this.state.modalState === 1) {
      if (this.state.phone) {
        this.props.resetPassword(this.state.phone).then((response,) => {
            if (response.status && response.status === 'success') {
              this.setState({isClicked: false}, function () {
                this.setState({modalState: 2});
                this.setState({phone: ''});
              });
              
              
            }
          }
        ).catch(error => {
          this.setState({message: error.response.data.error.message})
          
        })
      }
    }
    else if (this.state.modalState === 2) {
      if (this.state.code) {
        this.props.verifyPassword(this.state.code).then((response) => {
          if (response.status && response.status === 'success') {
            this.setState({isClicked: false}, function () {
              this.setState({modalState: 3});
              this.setState({code: ''});
            })
          }
        })
          .catch(error => {
            this.setState({message: error.response.data.error.message});
            
            
          })
        
      }
    }
    else if (this.state.modalState === 3) {
      if (this.state.newPass1 && this.state.newPass2 && (this.state.newPass1 === this.state.newPass2)) {
        this.props.newPassword(this.state.newPass1, this.state.newPass2).then((response) => {
          this.setState({isClicked: true}, function () {
            this.setState({wasChanged: true});
            this.setState({modalState:1})
            this.setState({show: false});
            
          })
          
        })
          .catch(error => {
            this.setState({message: error.response.data.error.message});
            
          })
        
      }
      
      
    }
    setTimeout(() => {
      this.setState({isClicked: false});
    }, 1000)
    setTimeout(() => {
      this.setState({message: ''});
    }, 1000)
    this.setState({wasChanged: false});
    
    
  }
  
  handleShowBack=(event)=> {
    event.preventDefault();
    if (this.state.modalState === 2) {
      this.setState({modalState: 1});
    }
    if (this.state.modalState === 3) {
      this.setState({modalState: 2});
    }
    {
      () => this.handleShow()
    }
  }
  
  
  onInputChangePhoneNumber(event) {
    this.setState({isClicked: false});
    this.setState({phone: event.target.value});
    
  }
  
  onInputChangeCode(event) {
    this.setState({isClicked: false});
    this.setState({code: event.target.value});
    
  }
  
  onInputChangePass1(event) {
    this.setState({isClicked: false});
    this.setState({newPass1: event.target.value});
    
  }
  
  onInputChangePass2(event) {
    this.setState({isClicked: false});
    this.setState({newPass2: event.target.value});
    
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
    
    return (
      <div>
        <div id="reset" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle">
          <a href="#" style={{float:'right'}}onClick={(event) => {
            this.handleShow(event)
          }} data-target="#reset">Forgot Password?</a>
          {(this.state.modalState === 1) ?
            <Modal show={this.state.show} onHide={() => this.handleClose()}>
              <Modal.Header closeButton style={{paddingTop: 0}}>
                <Modal.Title>Forgot Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form className="reset-password-box">
                  
                  <div className="empty-xs-40 empty-md-40"></div>
                  <div className="form-group">
                    <label>Please enter your phone number here:</label>
                    
                    {this.state.isClicked && !this.state.phone ?
                      
                      <StyleRoot>
                        <input type="text" className="form-control" id="forgot_phone" placeholder="Phone Number"
                               style={styles.shake} onChange={(event) => this.onInputChangePhoneNumber(event)}
                        />
                      </StyleRoot>
                      :
                      <input type="text" className="form-control" id="forgot_phone" placeholder="Phone Number"
                             onChange={(event) => this.onInputChangePhoneNumber(event)}
                      />}
                  
                  </div>
                  <div className="empty-xs-100 empty-md-100"></div>
                  <a href="#"
                     onClick={(event) => this.handleShow(event)}
                     className="btn btn-yellow2 width100">Next
                  
                  </a>
                  
                  <div>
                    
                    {this.state.isClicked && !this.state.phone ?
                      <div>
                        
                        {this.notify('Phone Number is Required')}
                      
                      </div>
                      : ''}
                    
                    {this.state.message && this.state.isClicked
                      ?
                      <div>
                        {this.notify(this.state.message)}</div> : ''
                    }
                  
                  </div>
                </form>
                
                <div className="empty-xs-10 empty-md-10"></div>
              </Modal.Body>
            </Modal>
            
            : ''}
        
        </div>
        <div id="reset2" tabIndex="2" role="dialog" aria-labelledby="exampleModalLongTitle">
          {(this.state.modalState === 2) ?
            <Modal show={this.state.show} onHide={() => this.handleClose()}>
              <Modal.Header closeButton style={{paddingTop: 0}}>
                <Modal.Title>
                  <a
                    onClick={(event) => this.handleShowBack(event)}
                  ><img
                    src="img/ic_back.png" width="12"/></a> Forgot Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form className="reset-password-box">
                  
                  <div className="empty-xs-40 empty-md-40"></div>
                  <div className="form-group">
                    <label>We have sent you a 6 digit verification code, please enter it
                      below</label>
                    
                    <div className="form-control-wrapper form-control-icon-right">
                      {this.state.isClicked && !this.state.code ?
                        
                        <StyleRoot>
                          <input type="text" className="form-control form-control-sm" id="password_code"
                                 style={styles.shake} onChange={(event) => this.onInputChangeCode(event)}
                          />
                        </StyleRoot>
                        :
                        <input type="text" className="form-control form-control-sm" id="password_code"
                               onChange={(event) => this.onInputChangeCode(event)}
                        />}
                      <i className="font-icon"> <img src="img/check.png" width="25"/></i>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                  
                  </div>
                  
                  <div className="empty-xs-100 empty-md-100"></div>
                  <a href="#"
                     onClick={(event) => this.handleShow(event)}
                     className="btn btn-yellow2 width100">Verify</a>
                  <div>
                    
                    {this.state.isClicked && !this.state.code ?
                      <div>
                        
                        {this.notify('Code is Required')}
                      
                      </div>
                      : ''}
                    
                    {this.state.message && this.state.isClicked
                      ?
                      <div>
                        {this.notify(this.state.message)}</div> : ''
                    }
                  
                  </div>
                </form>
                
                <div className="empty-xs-10 empty-md-10"></div>
              </Modal.Body>
            </Modal> : ''}
        </div>
        <div className="modal fade show" id="reset3" tabIndex="3" role="dialog"
             aria-labelledby="exampleModalLongTitle">
          {(this.state.modalState === 3) ?
            <Modal show={this.state.show} onHide={() => this.handleClose()}>
              <Modal.Header closeButton style={{paddingTop: 0}}>
                <Modal.Title><a
                  onClick={(event) => this.handleShowBack(event)}
                ><img
                  src="img/ic_back.png" width="12"/></a> Forgot Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form className="reset-password-box">
                  
                  <div className="empty-xs-40 empty-md-40"></div>
                  <div className="form-group">
                    <label>We have successfully verified your account, please set your new password
                      below</label>
                    
                    <input type="password" className="form-control" id="newPassword_1" placeholder="New Password"
                           onChange={(event) => this.onInputChangePass1(event)}
                    
                    />
                    <div className="empty-xs-20 empty-md-20"></div>
                    <input type="password" className="form-control" id="newPassword_2" placeholder="Confirm Password"
                           onChange={(event) => this.onInputChangePass2(event)}
                    
                    />
                  </div>
                  
                  <div className="empty-xs-100 empty-md-100"></div>
                  <a href="#" className="btn btn-yellow2 width100" onClick={(event) => this.handleShow(event)}
                  >Update</a>
                  
                  {this.state.isClicked && (!this.state.newPass2 && !this.state.newPass1) ?
                    <div>
                      
                      {this.notify('All Fields are Required')}
                    
                    </div>
                    : ''}
                  {this.state.isClicked && (this.state.newPass2 !== this.state.newPass1) ?
                    <div>
                      
                      {this.notify('Passwords do not match')}
                    
                    </div>
                    : ''}
                  {this.state.isClicked && this.state.wasChanged
                    ?
                    <Notification
                      type='success'
                      text='Password Changed'
                      animateIn='zoomInLeft'
                      animateOut='zoomOutRight'
                      delay={2000}
                      shadow={false}
                      hide={true}
                      nonblock={false}
                      desktop={false}
                    />
                    : ''}
                  
                  
                  {this.state.message && this.state.isClicked
                    ?
                    <div>
                      {this.notify(this.state.message)}</div> : ''
                  }
                
                </form>
                
                <div className="empty-xs-10 empty-md-10"></div>
              </Modal.Body>
            </Modal> : ''}
        
        </div>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({resetPassword, verifyPassword, newPassword}, dispatch);
}

export default connect(null, mapDispatchToProps)(ResetPassword);
