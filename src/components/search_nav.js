import React, {Component} from 'react';
import {ButtonToolbar, DropdownButton, MenuItem, Dropdown} from 'react-bootstrap';

class SearchMap extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filterName: 'all categories'
    };
  }
  
  deliveryReport = () => {
  
  }
  find_address = () => {
  
  }
  logout = () => {
  }
  
  render() {
    return (
      
      
      <div className="row search-fixed m-t">
        <div className="col-md-1"></div>
        <div className="col-md-8" style={{zIndex:9}}>
          
          <div className="typeahead-container">
            <div className="typeahead-container filter">
              <div className="typeahead-field">
								<span className="typeahead-query">
									<input id="categories"
                         className="form-control"
                         name="q"
                         type="search"
                         autoComplete="off" placeholder="Search..."/>
								</span>
                
                <span className="typeahead-filter">
                        <ButtonToolbar >
                   <Dropdown id={1} >
                        <Dropdown.Toggle >
     <span className="typeahead-filter-value">{this.state.filterName}</span>
                             </Dropdown.Toggle>
                        <Dropdown.Menu className="typeahead-dropdown">
                      <MenuItem onClick={() => {
                        this.setState({filterName: 'drivers'})
                      }}>drivers </MenuItem>
                          <MenuItem onClick={() => {
                            this.setState({filterName: 'address'})
                          }}>address </MenuItem>

                      <MenuItem onClick={() => {
                        this.setState({filterName: 'routes'})
                      }}>routes </MenuItem>
                        <MenuItem divider/>
                      <MenuItem active onClick={() => {
                        this.setState({filterName: 'all categories'})
                      }}>all categories </MenuItem>
                              </Dropdown.Menu>

                      </Dropdown>
                      
                      
                    </ButtonToolbar>
                    
                    </span>
                <span className="typeahead-button" onClick={this.find_address()}>
									<button type="submit" >
										<span className="font-icon-search"></span>
									</button>
								</span>
              </div>
            </div>
          </div>
          
          <div className="empty-xs-20"></div>
        
        </div>
        
        <div className="col-md-3 p-x-0 p-mobile">
          <div className="settings-fixed relative">
            
            
            <div className="dropdown">
              <a className="dropdown-toggle btn" id="dd-header-form-builder" data-target="#"
                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span
                className=" glyphicon glyphicon-cog"></span>
              </a>
              
              <div className="dropdown-menu" aria-labelledby="dd-header-form-builder">
                <a className="dropdown-item" id="menu_item_new_order" href="#" data-toggle="modal"
                   data-target="#new_task"><span
                  className="font-icon scoo-icon scoo-icon-9"></span>New Order</a>
                
                <a className="dropdown-item" id="menu_item_delivery_report" href="javascript:void(0);"
                   onClick={this.deliveryReport()}><span
                  className="font-icon scoo-icon scoo-icon-14"></span>Delivery Report</a>
                
                <a className="dropdown-item" href="javascript:void(0);" onClick={this.logout()}><span
                  className="font-icon scoo-icon scoo-icon-14"></span>Logout</a>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    
    )
  }
  
}

export default SearchMap;

