import React from 'react';
import {Modal} from 'react-bootstrap';
import {progress_statics} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class ProgressStatistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false
    };
  }
  
  componentDidMount() {
    this.props.progress_statics()
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  
  render() {
    return (
      <div>
        <a href="#" onClick={(e) => this.handleShow(e)}>
          <i className="scoo-icon scoo-icon-4"></i>
          <span className="lbl">Progress Statics</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="progress_statics"
               aria-hidden="true">
          <Modal.Header closeButton>
            <Modal.Title>Daily Report</Modal.Title>
          </Modal.Header>
          <Modal.Body id="progressStatistics">
            <div dangerouslySetInnerHTML={{__html: this.props.dailyReport.html}}/>
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

function mapStateToProps(state) {
  return {
    dailyReport: state.dailyReport,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({progress_statics}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressStatistics);
