'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { Modal, Button, Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

export default function ( ComposedComponent ) {
    class UsernameInput extends Component {
        constructor( props ) {
            super( props );

            let uData = this.props.user,
                name = uData.name || localStorage.getItem('username');
            if ( name ) {
                this.props.setUserName( name )
            } else if ( !uData.modal ) {
                this.props.openUsernameModal();
            }

            this.submitUserName = this.submitUserName.bind(this);
        }

        submitUserName() {
            const name = this.props.user.value;
            localStorage.setItem('username', name );
            this.props.setUserName( name )
        }
        renderModal() {
            console.log('render')
            return (
                <Modal
                  show={this.props.user.modal}
                  onHide={this.props.closeUsernameModal}
                  aria-labelledby="ModalHeader"
                >
                  <Modal.Header closeButton>
                  </Modal.Header>
                  <Modal.Body>
                    
                    <Form horizontal onSubmit={this.submitUserName}>
                        <FormGroup controlId="formHorizontalEmail">
                          <Col>
                            <FormControl type="text" placeholder="Enter your name" onChange={this.props.updateNameValue} />
                          </Col>
                        </FormGroup>
                    </Form>

                  </Modal.Body>
                  <Modal.Footer>
                    <button className='btn btn-primary' onClick={this.submitUserName}>
                      Save
                    </button>
                  </Modal.Footer>
                </Modal>
            )
        }

        render() {
        	return (
                <ComposedComponent {...this.props}>
                    {!this.props.user.name && this.renderModal()}
                </ComposedComponent>
            )
        }
    }
    UsernameInput.propTypes = {
        series: React.PropTypes.array
    }

    function mapStateToProps(state) {
        return {
            user: state.user
        };
    }

    return connect(mapStateToProps, actions)(UsernameInput);
}
