import { apiRegistry, actionsRegistry } from '@penta-b/ma-lib';

import * as turf from "@turf/turf";
import {callQueryService} from './queryService';


let VL = null;
let drawing = null;

export const getBuffer = async (props , projection , state) => {

  console.log("state.sizeBuffer  : ", state.sizeBuffer);

    actionsRegistry.dispatch("clearHighlight", props.reducerId);

    apiRegistry
    .getApis(["Drawing", "VectorLayer"])
    .then(([Drawing, VectorLayer]) => {
      if (VL) {
        console.log("VL.clear()");
        VL.clear();
      }
      VL = new VectorLayer();
      actionsRegistry.dispatch("addVectorLayer", VL , props.reducerId);
      drawing = new Drawing({
        type: "point",
        vectorLayer: VL,                                                                                                                                                                
      });

      actionsRegistry.dispatch("addInteraction", drawing , props.reducerId);

      drawing.setOnDrawFinish((feature) => {
        actionsRegistry.dispatch("removeInteraction", drawing , props.reducerId);
        console.log("feature.getGeometry().coordinates : ",feature.getGeometry().coordinates);
        var point = turf.point(feature.getGeometry().coordinates);
        let buffered = null;
        buffered = turf.buffer(
          point,
          state.sizeBuffer,
          {units : state.uniteBuffer}
        );
        console.log("buffered : ", buffered);

        apiRegistry
          .getApis(["Feature", "Fill", "Style", "Stroke"])
          .then(async ([Feature, Fill, Style, Stroke]) => {
            const featureStyle = new Style(
              new Fill("#8400004A"),
              new Stroke("pink", 1),
              null,
              null
            );
            const featureBuffer = new Feature(buffered, featureStyle);

            // console.log("featureBuffer : ", featureBuffer.getGeometry());

            const res = await callQueryService(
              featureBuffer.getGeometry(),
              projection.code
            );
            VL.addFeature(featureBuffer);
            const features = res.map((item) => item);
            console.log("features : ");
            console.log(features);
            props.setFeatures(features);

          });
      });
    });
    
};

export const removeData = async (props) => {
  props.setFeatures("");
  actionsRegistry.dispatch("removeVectorLayer", VL , props.reducerId);
  actionsRegistry.dispatch("clearHighlight", props.reducerId);
  actionsRegistry.dispatch("removeInteraction", drawing , props.reducerId);
};
