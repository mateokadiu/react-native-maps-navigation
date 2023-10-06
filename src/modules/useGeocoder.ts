import React from "react";
import { View, Text } from "react-native";
import { toQueryParams } from "./Tools";

/**
 * AddressComponentMapping
 * @type {{street_number: string, route: string, postal_code: string, country: string, locality: string, administrative_area_level_1: string, administrative_area_level_2: string}}
 */
const AddressComponentMapping = {
  street_number: "number",
  route: "street",
  postal_code: "zip",
  country: "country",
  locality: "city",
  administrative_area_level_1: "state",
  administrative_area_level_2: "county",
};

const useGeocoder = ({ apiKey, options }: any) => {
  const getFromLocation = async (...params: any[]) => {
    let queryParams: any =
      params.length === 1 && typeof params[0] === "string"
        ? { address: params[0] }
        : params;

    if (!params) return Promise.reject("Not enough parameters");

    queryParams.key = apiKey;

    if (options.language) queryParams.language = options.language;

    // build url
    const url = `https://maps.google.com/maps/api/geocode/json?${toQueryParams(
      queryParams
    )}`;

    let response, data;

    // fetch
    try {
      response = await fetch(url);
    } catch (error) {
      return Promise.reject(error);
    }

    // parse
    try {
      data = await response.json();
    } catch (error) {
      return Promise.reject(error);
    }

    // check response's data
    if (data.status !== "OK") {
      return Promise.reject(data);
    }

    return data.results;
  };

  const getFromLatLng = (lat: any, lng: any) => {
    return getFromLocation({ latlng: `${lat},${lng}` });
  };

  const minimizeResults = (results: any) => {
    if (results.constructor != Array) return [];

    return results.map((result) => {
      let { lat, lng } = result.geometry.location;

      return {
        components: minimizeAddressComponents(result.address_components),
        address: result.formatted_address,
        coordinate: {
          latitude: lat,
          longitude: lng,
        },
      };
    });
  };

  const minimizeAddressComponents = (components: any) => {
    let results: any = {};

    const ids = Object.keys(AddressComponentMapping);

    components.forEach((component: any) => {
      let index = ids.indexOf(component.types[0]);

      if (index != -1) {
        //@ts-ignore
        results[AddressComponentMapping[ids[index]]] = {
          short: component.short_name,
          long: component.long_name,
        };
      }
    });

    return results;
  };

  return {
    getFromLocation,
    getFromLatLng,
    minimizeResults,
    minimizeAddressComponents,
  };
};

export default useGeocoder;
