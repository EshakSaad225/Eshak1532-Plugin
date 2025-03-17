import {
    store,
    query,
    systemShowLoading,
    systemHideLoading,
} from '@penta-b/ma-lib';

const genQueryBody = (layer) => {
  // console.log("layerrrr : ",layer);
  // let layerID = layer.key.id;
  // console.log("layer key : ",layerID);

    return [
        {
            dataSource: {
        id:"653fcc89-b3ae-4f01-9ae3-f83bfc4a5922",
        // id: layer.key.id ,
      },
            crs: layer.crs ,
        }
    ];
};

export const callQueryService = async (layer) => {
  console.log("callQueryService");

    store.dispatch(systemShowLoading());
    return await query
        .queryFeatures(genQueryBody(layer))
        .then((response)=> {
          return JSON.parse(response.data[0].features).features;
        })
        .catch((error) => {
          console.error('Error in callQueryService:', error);
          console.log('Error in callQueryService:', error);
          console.log("error");
          return false;
      })
        .finally(() => {
            store.dispatch(systemHideLoading());
        });
};
