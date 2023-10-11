/**
 * @imports
 */
import { useEffect, useState } from 'react';
import * as GeoLib from 'geolib';
import NavigationModes from 'react-native-maps-navigation/src/constants/NavigationModes';

let pointIndex = 0;
let simulatorNavMode = NavigationModes.IDLE

type useSimuatorType = {
  navRoute: any;
  setPosition: any;
  navigationMode: keyof typeof NavigationModes
}



const useSimulator = ({ navRoute, setPosition, navigationMode }: useSimuatorType) => {
  const [turnSpeed, setTurnSpeed] = useState(700);
  const [speed, setSpeed] = useState(30);
  const [points, setPoints] = useState<any[]>([]);
  const [lastBearing, setLastBearing] = useState<any>(null);

  let timeoutId: any = null;


  useEffect(()=>{
    simulatorNavMode = navigationMode;


    return () => clearTimeout(timeoutId)
  },[navigationMode])

  /**
   * start
   * @param route
   */

  // console.log('NAV MODE => ', navigationMode)

  const start = () => {
    const steps = navRoute?.steps;

    let pointsArray: any[] = [];
    let result: any[] = [];

    steps.map((step) =>
      step.polyline.coordinates.map((coordinate) =>
        pointsArray.push(Object.assign({}, coordinate))
      )
    );


    pointsArray.forEach((point, index) => {
      const nextPoint = pointsArray[index + 1];

      if (nextPoint && !nextPoint.final == true) {
        // calculate distance between each point
        const distance = Math.round(GeoLib.getDistance(point, nextPoint));
        const bearing = GeoLib.getGreatCircleBearing(point, nextPoint);

        if (bearing !== 0) {
          if (distance > 1) {
            for (var x = 1; x < distance; x++) {
              result.push(
                Object.assign(
                  {},
                  { bearing },
                  GeoLib.computeDestinationPoint(point, x, bearing)
                )
              );
            }
          } else {
            result.push(Object.assign({}, { bearing }, point));
          }
        }
      }
    });

    setPoints(result);
    setLastBearing(false);

    drive();
  };

  const drive = () => {

    const point = points[pointIndex];

    pointIndex++;

    if (point && point.bearing) {
      let allowPositionUpdate = true;

      if (lastBearing != point.bearing) {
        // check if it's just a small bump
        if (
          point.bearing > lastBearing - 10 &&
          point.bearing < lastBearing + 10
        ) {
          setPosition(point);
        } else {
          allowPositionUpdate = false;
          setSpeed(turnSpeed);
          setPosition(point, speed);
        }

        setLastBearing(point.bearing);
      }

      if (allowPositionUpdate) {
        setPosition(point, speed);
      }



      if(simulatorNavMode === NavigationModes.NAVIGATION){
        timeoutId = setTimeout(() => {

            console.log('DRIVE CALLED');
            drive();
          }, 500);
      }
    }
  };

  return { start, drive };
};

export default useSimulator;
