import React, { useState, useEffect, useImperativeHandle } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Circle, Polygon, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import NavigationModes from '../../constants/NavigationModes';
import useTraps from '../../modules/useTraps';
import useSimulator from '../../modules/useSimulator';
import TravelModes from '../../constants/TravelModes';
import { POSITION_ARROW } from '../../constants/MarkerTypes';
import PositionMarker from '../PositionMarker/PositionMarker';
import RoutePolyline from '../RoutePolyline/RoutePolyline';
import { toArcPolygon } from '../../modules/Tools';
import RouteMarker from '../RouteMarker/RouteMarker';
import useGeocoder from '../../modules/useGeocoder';
import useDirections from '../../modules/useDirections';
import connectTheme from '../../themes';

interface MapViewNavigationProps {
  apiKey: string;
  language?: string;
  map?: any;
  travelMode?: string;
  maxZoom?: number;
  minZoom?: number;
  animationDuration?: number;
  navigationMode?: keyof typeof NavigationModes;
  navigationViewingAngle?: number;
  navigationZoomLevel?: number;
  directionZoomQuantifier?: number;
  onRouteChange?: any;
  onStepChange?: any;
  onNavigationStarted?: any;
  onNavigationCompleted?: any;
  routeStepDistance?: number;
  routeStepInnerTolerance?: number;
  routeStepCenterTolerance?: number;
  routeStepCourseTolerance?: number;
  displayDebugMarkers?: boolean;
  simulate?: boolean;
  options?: any;
  origin?: any;
  destination?: any;
  theme?: any;
}

export type MapViewNavigationRef = {
  navigateRoute: (origin: any, destination: any, options?: boolean) => any;
};

const MapViewNavigation = React.forwardRef<any, MapViewNavigationProps>(
  (
    {
      origin = false,
      destination = false,
      travelMode = TravelModes.DRIVING,
      maxZoom = 21,
      minZoom = 5,
      animationDuration = 750,
      navigationViewingAngle = 60,
      navigationZoomLevel = 14,
      directionZoomQuantifier = 1.5,
      routeStepDistance = 15,
      routeStepInnerTolerance = 0.75,
      routeStepCenterTolerance = 0.1,
      routeStepCourseTolerance = 30, // in degress
      displayDebugMarkers = false,
      simulate = false,
      options = {},
      apiKey,
      language,
      map,
      navigationMode = NavigationModes.IDLE,
      onNavigationCompleted,
      onNavigationStarted,
      onRouteChange,
      onStepChange,
      theme,
    },
    ref
  ) => {
    const simulator = useSimulator({ instance: undefined });

    let directionsCoder = useDirections({ apiKey, options });

    const navTheme = connectTheme(theme);

    const props = {
      origin,
      destination,
      travelMode,
      maxZoom,
      minZoom,
      animationDuration,
      navigationViewingAngle,
      navigationZoomLevel,
      directionZoomQuantifier,
      routeStepDistance,
      routeStepInnerTolerance,
      routeStepCenterTolerance,
      routeStepCourseTolerance, // in degress
      displayDebugMarkers,
      simulate,
      options,
      apiKey,
      language,
      map,
      navigationMode,
      onNavigationCompleted,
      onNavigationStarted,
      onRouteChange,
      onStepChange,
    };

    const { width, height } = useWindowDimensions();

    let aspectRatio = width / height;

    const [navMode, setNavMode] = useState(NavigationModes.IDLE);

    const geoCoder = useGeocoder({ apiKey, options });

    const traps = useTraps(props);
    const [nextStep, setNextStep] = useState();
    const [stepIndex, setStepIndex] = useState<any>(null);
    const [step, setStep] = useState<any>(0);
    const [route, setRoute] = useState<any>(null);
    const [navPosition, setNavPosition] = useState<any>({});
    useEffect(() => {
      const watchId = Geolocation.watchPosition((position: any) => {
        setPosition(position);
      });

      return () => Geolocation.clearWatch(watchId);
    }, []);

    /**
     * updateBearing
     * @param bearing
     * @param duration
     */
    const updateBearing = (bearing: any, duration = false) => {
      props
        .map()
        .animateToBearing(bearing, duration || props.animationDuration);
    };

    const clearRoute = () => {
      setRoute(false);
      setStep(false);
      setStepIndex(false);
    };

    /**
     * updatePosition
     * @param coordinate
     * @param duration
     */
    const updatePosition = (coordinate: any, duration = 0) => {
      props.map().animateToCoordinate(coordinate, duration);
    };

    const setPosition = (position: any) => {
      const { latitude, longitude, heading } = position.coords;

      position.coordinate = { latitude, longitude };

      // process traps on setPosition
      traps.execute(position);

      // update position on map
      if (navigationMode == NavigationModes.NAVIGATION) {
        updatePosition(position);

        updateBearing(heading);
      }

      setNavPosition(position);
    };

    const getPositionMarker = (position: any, navigationMode: any) => {
      const type =
        navigationMode == NavigationModes.NAVIGATION
          ? POSITION_ARROW
          : undefined;

      return (
        <PositionMarker
          key={'position'}
          theme={navTheme}
          type={type}
          {...position}
        />
      );
    };

    const getRoutePolylines = (route: any) => {
      if (!route || route.polylines.constructor !== Array) return null;

      return route.polylines.map((params: any, index: number) => {
        return params ? (
          <RoutePolyline key={index} theme={navTheme} {...params} />
        ) : null;
      });
    };

    const getDebugShapes = (route: any) => {
      let result: any[] = [];

      if (!route || !displayDebugMarkers) return result;

      const steps = route.steps;

      let c = 0;

      steps.forEach((step: any, index: number) => {
        const coordinate = step.start;

        [
          { radius: routeStepDistance, color: 'blue' },
          {
            radius: routeStepDistance * routeStepInnerTolerance,
            color: 'red',
          },
          {
            radius: routeStepDistance * routeStepCenterTolerance,
            color: 'green',
          },
        ].forEach((d) => {
          result.push(
            <Circle
              key={c}
              strokeColor={d.color}
              strokeWidth={2}
              center={step.start}
              radius={d.radius}
            />
          );
          c++;
        });

        [{ radius: routeStepDistance, color: 'blue' }].forEach((d) => {
          let bearing = step.bearing; // - 180 > 0 ? step.bearing - 180 : 360 - step.bearing - 180;

          let coords = toArcPolygon(
            coordinate,
            bearing - routeStepCourseTolerance,
            bearing + routeStepCourseTolerance,
            routeStepDistance
          );

          result.push(
            <Polyline
              key={c}
              strokeColor={d.color}
              strokeWidth={8}
              coordinates={coords}
            />
          );
          c++;
        });
      });

      return result;
    };

    const prepareRoute = (
      origin: any,
      destination: any,
      options: any = false,
      testForRoute = false
    ) => {
      if (testForRoute && route) {
        return Promise.resolve(route);
      }
      options = Object.assign(
        {},
        { mode: travelMode }, // this was from state
        { mode: props.travelMode }
      );

      return directionsCoder
        .fetchDirections(origin, destination, options)
        .then((routes: any) => {
          if (routes?.length) {
            const route = routes[0];

            // onRouteChange && onRouteChange(route);

            // onStepChange && onStepChange(false);

            setRoute(route);
            setStep(false);

            return Promise.resolve(route);
          }

          return Promise.reject();
        });
    };

    const updateRoute = (
      origin: any = false,
      destination: any = false,
      navigationMode: any = false,
      options: any = null
    ) => {
      origin = origin || props.origin;
      destination = destination || props.destination;
      navigationMode = navigationMode || props.navigationMode;
      options = options || props.options;

      switch (navigationMode) {
        case NavigationModes.ROUTE:
          displayRoute(origin, destination, options);
          break;

        case NavigationModes.NAVIGATION:
          navigateRoute(origin, destination, options);
          break;
      }
    };

    const getCoordinates = (address: any, raw = false) => {
      return geoCoder.getFromLocation(address).then((results) => {
        let coordinates = raw ? results : geoCoder.minimizeResults(results);

        return coordinates.length == 1 ? coordinates[0] : coordinates;
      });
    };

    const getZoomValue = (level: any) => {
      const value = 0.00001 * (maxZoom - (level < minZoom ? minZoom : level));

      return {
        latitudeDelta: value,
        longitudeDelta: value * aspectRatio,
      };
    };

    const navigateRoute = (origin: any, destination: any, options = false) => {
      return prepareRoute(origin, destination, options, true).then(
        (route: any) => {
          const region = {
            ...route.origin.coordinate,
            ...getZoomValue(props.navigationZoomLevel),
          };
          console.log(region, 'REGIONNNNNNNNNNNNNNNNNN');
          // console.log(props.map().current, 'MAPPPPPPPPP');
          props.map().current?.animateToRegion(region, 1000);
          // props?.map()?.animateToRegion(region, props.animationDuration);
          //   props
          //     .map()
          //     .animateToViewingAngle(
          //       props.navigationViewingAngle,
          //       props.animationDuration
          //     );
          //   //updatePosition(route.origin.coordinate);
          //   updateBearing(route.initialBearing);
          //   setNavMode(NavigationModes.NAVIGATION);
          //   updateStep(0);
          //   props.onNavigationStarted && props.onNavigationStarted();
          //   if (props.simulate) {
          //     console.log('SIMULATING ROUTE');
          //     // simulator = new Simulator(this);
          //     setTimeout(
          //       () => simulator.start(route),
          //       props.animationDuration * 1.5
          //     );
          //   } else {
          //     console.log('NOT SIMULATING');
          //   }
          //   return Promise.resolve(route);
        }
      );
    };

    useImperativeHandle(ref, () => ({
      navigateRoute,
    }));

    const updateStep = (stepIndex = 0) => {
      const step = route.steps[stepIndex < 0 ? 0 : stepIndex];

      const nextStep = route.steps[stepIndex + 1];

      props.onStepChange && props.onStepChange(step, nextStep);

      traps.watchStep(
        step,
        nextStep,
        {
          distance: props.routeStepDistance,
          innerRadiusTolerance: props.routeStepInnerTolerance,
          centerRadiusTolerance: props.routeStepCenterTolerance,
          courseTolerance: props.routeStepCourseTolerance,
        },
        (trap: any, event: any, state: any) => {
          if (!nextStep && trap.isCenter()) {
            props.onNavigationCompleted && props.onNavigationCompleted();

            //   return setState({
            //     navigationMode: NavigationModes.IDLE,
            //     stepIndex: false,
            //   });
            setNavMode(NavigationModes.IDLE);
            setStepIndex(false);
          }

          if (trap.isLeaving()) {
            updateStep(stepIndex);
          }
        }
      );

      setStepIndex(stepIndex + 1); // ensures that this is a real number
    };

    const getBoundingBoxZoomValue = (b: any, quantifier = 1) => {
      if (b.length != 2) return {};

      const latitudeDelta =
        (b[0].latitude > b[1].latitude
          ? b[0].latitude - b[1].latitude
          : b[1].latitude - b[0].latitude) * quantifier;

      return {
        latitudeDelta,
        longitudeDelta: latitudeDelta * aspectRatio,
      };
    };

    const displayRoute = (
      origin: any,
      destination: any,
      options: any = false
    ) => {
      return prepareRoute(origin, destination, options)
        .then((route: any) => {
          const region = {
            ...route.bounds.center,
            ...getBoundingBoxZoomValue(
              route.bounds.boundingBox,
              directionZoomQuantifier
            ),
          };

          map().animateToRegion(region, animationDuration);

          if (navMode == NavigationModes.ROUTE) {
            setNavMode(NavigationModes.ROUTE);
          }

          return Promise.resolve(route);
        })
        .catch((err: any) => console.log(err));
    };

    const getRouteMarkers = (route: any) => {
      if (!route || route.markers.constructor !== Array) return null;

      return route.markers.map((params: any, index: number) => {
        return <RouteMarker key={index} theme={navTheme} {...params} />;
      });
    };

    console.log(navPosition);

    const result = [
      getRouteMarkers(route),
      getRoutePolylines(route),
      getPositionMarker(navPosition, navMode),
      getDebugShapes(route),
    ];

    return <>{result}</>;
  }
);

export default MapViewNavigation;
