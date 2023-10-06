/**
 * @imports
 */
import { useState } from "react";
import * as GeoLib from "geolib";

const useSimulator = ({ instance }: any) => {
  const [turnSpeed, setTurnSpeed] = useState(700);
  const [speed, setSpeed] = useState(30);
  const [simulatorInstance, setSimulatorInstance] = useState(instance);
  const [pointIndex, setPointIndex] = useState(0);
  const [points, setPoints] = useState<any[]>([]);
  const [lastBearing, setLastBearing] = useState<any>(null);

  /**
   * start
   * @param route
   */
  const start = (route: any) => {
    setPointIndex(0);

    const steps = route.steps;

    let pointsArray: any[] = [];
    let result: any[] = [];

    steps.map((step: any) =>
      step.polyline.coordinates.map((coordinate: any) =>
        points.push(Object.assign({}, coordinate))
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

    setPointIndex(0);
    setPoints(result);
    setLastBearing(false);

    drive();
  };

  const drive = () => {
    const point = points[pointIndex];

    if (point && point.bearing) {
      let allowPositionUpdate = true;

      if (lastBearing != point.bearing) {
        // check if it's just a small bump
        if (
          point.bearing > lastBearing - 10 &&
          point.bearing < lastBearing + 10
        ) {
          instance.updateBearing(point.bearing, turnSpeed);
        } else {
          allowPositionUpdate = false;
          setSpeed(turnSpeed);
          instance.updateBearing(point.bearing, turnSpeed);
        }

        setLastBearing(point.bearing);
      }

      if (allowPositionUpdate) {
        instance.setPosition({
          ...point,
          heading: point.bearing,
        });

        setPointIndex(pointIndex + 1);
      }

      setTimeout(() => drive(), speed);
    }
  };

  return { start, drive };
};

export default useSimulator;
