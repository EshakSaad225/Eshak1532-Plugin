/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - An example of a plugin that listens to another 
 *    plugin's state changes (Map plugin), and log that state.
 */


import React from 'react';
import { connect } from 'react-redux';
import { selectorsRegistry, actionsRegistry , systemAddNotification } from '@penta-b/ma-lib';



class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Description: 
     *  - React lifecycle method, here we check for state changes.
     */

    componentDidUpdate(prevProps) {

        if (this.props.isActive && prevProps.isActive != this.props.isActive ){
            this.props.showMapClickResult({
                removeCurrentComponent: this.removeCurrentComponent,
            },(id) => {
                this.id = id;
            })
        }
        else if (!this.props.isActive){
            this.id && this.props.removeComponent(this.id);
            this.props.removeComponent(this.currentCID);
            this.currentCID = null;
        }

    }

    render() {
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        singleClick: selectorsRegistry.getSelector('selectMapSingleClick', state, ownProps.reducerId)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showMapClickResult: (props, onAdd) => dispatch(actionsRegistry.getActionCreator('showComponent', 'eshak1532', 'MapClickResult', props, onAdd)),
        removeComponent: (id) => dispatch(actionsRegistry.getActionCreator('removeComponent', id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);


