import {LOCALIZATION_NAMESPACE} from "../constants/constants";
export const SET_FEATURES = `${LOCALIZATION_NAMESPACE}_SET_FEATURES`;

export const setFeatures = (features) => {
    return {
        type : SET_FEATURES,
        payload : features
    };
};