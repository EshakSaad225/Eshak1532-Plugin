import React from 'react';
import { withLocalize , componentRegistry } from '@penta-b/ma-lib';
import { connect } from 'react-redux';
import { components } from '@penta-b/grid';
import { selectFeatures } from '../../selectors/selectors';
import { getBuffer , removeData } from '../../services/mapUtils';
import { setFeatures } from '../../actions/actions';
import { selectorsRegistry, actionsRegistry , systemAddNotification } from '@penta-b/ma-lib';

const Grid = components.Grid ;


class MapClickResult extends React.Component {

    constructor(props) {
        super(props);
        // console.log("CONSTRUCTOR");
        // console.log(this.props) ;
        // console.log(`this.props.features   : ${this.props.features}`) ;
    }

    componentDidMount() {
        console.log("COMPONENT DID MOUNT");
        // console.log(this.props.settings);
        const LAYER = this.props.settings.dataSettings ;
        // console.log("LAYER:", LAYER);
        // console.log(this.props.settings.dataSettings);

        getBuffer(this.props);
        this.forceUpdate();      

    }

    componentWillUnmount() {
        removeData(this.props);
      }

    render() {
        const {t , features} = this.props ;
        const featuresProps = features.map((f) => f.properties ); 
        return (
            <div>
                <Grid
                    settings={{
                        name : "buffer data",
                        rowIdentifier : "id",
                        selectable : false,
                        sortable : true ,
                        filterable:true,
                        enableLargeView : true,
                        maxComponenet:3,
                        resizable:true,
                        columns:[
                            {
                                id:"id",
                                name:t("id"),
                                type:"string",
                                display: "basic",
                                filterable:true,
                                sortable:false,
                            },
                            {
                                id: "name_en",
                                name: t("name_en"),
                                // id: "marker_name",
                                // name: t("marker_name"),
                                type: "string",
                                display: "basic",
                                filterable: true,
                                sortable: false,
                            },
                            {
                                id:"features",
                                name:"",
                                type:"component",
                                display:"basic",
                                fillterable:false,
                                sortable:false,
                            }
                        ],
                        data : featuresProps,
                    }}
                    trComponents = {trComponents} 
                    gridComponent = {gridComponent} 
                />
            </div>            
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return{

        projection: selectorsRegistry.getSelector(
            "selectMapProjection",
            state,
            ownProps.reducerId
          ),

        features : selectFeatures(state) ,
    };
};

const ZoomToFeatureButton = componentRegistry.getComponent(
    'ZoomToFeatureButton'
);

const HighlightFeatureButton = componentRegistry.getComponent(
    'HighlightFeatureButton'
);

const trComponents = [
    {component : ZoomToFeatureButton , settings:{}},
    {component : HighlightFeatureButton , settings:{}},
];

const gridComponent = [
    {component : ZoomToFeatureButton , settings:{}},
    {component : HighlightFeatureButton , settings:{}},
];


const mapDispatchToProps = (dispatch) => {
    return {
        notify: (message, type) => dispatch(systemAddNotification({message, type})),
        setFeatures: (features) => dispatch(setFeatures(features)),
    }
}

export default withLocalize (connect(mapStateToProps , mapDispatchToProps)(MapClickResult));
