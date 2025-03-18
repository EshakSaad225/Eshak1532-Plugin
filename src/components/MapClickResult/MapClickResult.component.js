import React from 'react';
import { withLocalize , componentRegistry } from '@penta-b/ma-lib';
import { connect } from 'react-redux';
import { components } from '@penta-b/grid';
import { selectFeatures } from '../../selectors/selectors';
import { getBuffer , removeData } from '../../services/mapUtils';
import { setFeatures } from '../../actions/actions';
import { selectorsRegistry , systemAddNotification } from '@penta-b/ma-lib';

const Grid = components.Grid ;


class MapClickResult extends React.Component {

    constructor(props) {
        super(props);
        // console.log("CONSTRUCTOR");
        // console.log(this.props) ;
        // console.log(`this.props.features   : ${this.props.features}`) ;
        this.onChangeSizeBuffer = this.onChangeSizeBuffer.bind(this);
        this.onChangeUnite = this.onChangeUnite.bind(this);
        this.onClickReset = this.onClickReset.bind(this);

        this.state = {
            sizeBuffer: 100,
            uniteBuffer: "kilometers",
          };
    }

    componentDidMount() {
        console.log("COMPONENT DID MOUNT");
        // console.log(this.props.settings);
        const LAYER = this.props.settings.dataSettings ;
        // console.log("LAYER:", LAYER);
        // console.log(this.props.settings.dataSettings);

        getBuffer(this.props ,this.props.projection , this.state);
        this.forceUpdate();      
        console.log("this.props.projection : ", this.props.projection);
    }

    componentWillUnmount() {
        removeData(this.props);
      }

      onChangeSizeBuffer(e) {
        //   this.setState({ sizeBuffer : e.target.value });
        if(Number(e.target.value) > 0 ){
            removeData(this.props);
            this.setState({ sizeBuffer: Number(e.target.value) }, () => {
                console.log("this.state.sizeBuffer : ", this.state.sizeBuffer);
                getBuffer(this.props ,this.props.projection , this.state);
              });  
        };
      }

      onChangeUnite(e) {
        this.setState({ uniteBuffer: e.target.value }, () => {
            removeData(this.props);
            getBuffer(this.props ,this.props.projection , this.state);
          });  
      }

      onClickReset() {
        removeData(this.props);
        getBuffer(this.props ,this.props.projection , this.state);
      }

    render() {
        const {t , features} = this.props ;
        const featuresProps = features.map((f) => f.properties ); 
        return (

            <div>
                <div className="penta-container-space-between">
                    <div className="penta-textbox penta-width61">
                        <input
                            type="number"
                            onChange={this.onChangeSizeBuffer}
                            placeholder={t("Buffer Size")}
                            value={this.state.sizeBuffer}
                            maxLength="4"
                        />
                    </div>
                    <div className="penta-drop-select penta-width37">
                        <select
                        value={this.state.uniteBuffer}
                        onChange={this.onChangeUnite}
                        >
                        <option value="meters">{t("meters")}</option>
                        <option value="kilometers">{t("kilometers")}</option>
                        </select>
                    </div>
                    <button
                        className="penta-main-button penta-main-button"
                        onClick={this.onClickReset}
                    >
                        {t("Reset")}
                    </button>
                </div>

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
