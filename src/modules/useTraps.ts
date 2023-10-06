import React, { useState } from "react";
import { View, Text } from "react-native";
import * as GeoLib from "geolib";

import TrapTypes from "../constants/TrapTypes";
import { toNameId } from "./Tools";

const useTraps = ({ instance }: any) => {
  const [traps, setTraps] = useState<any>({});
  const [counter, setCounter] = useState(0);
  const [trapInstance, setTrapInstance] = useState(instance);

  const isWithinCourse = (bearing: any, heading: any, tolerance = 0) => {
    const low = bearing - tolerance;
    const high = bearing + tolerance;

    return (
      ((low < 0 && heading > 360 - -1 * low) || heading > low) &&
      ((high > 360 && heading < high - 360) || heading < high)
    );
  };

  /**
   * Add
   * @param trap
   * @param callback
   * @returns {*}
   */
  const add = (trap: any, callback: () => any) => {
    setCounter(counter + 1);

    setTraps(
      traps.map((trapData: any, index: any) => {
        if (counter === index) {
          return Object.assign({}, trap, {
            index: counter,
            state: TrapTypes.States.OUTSIDE,
            callback: callback,
          });
        }
        return trap;
      })
    );

    setTraps(
      traps.map((trap: any, index: any) => {
        if (counter === index) {
          return Object.keys(TrapTypes.States).forEach(
            (state) =>
              (traps[counter][toNameId(state, "is")] = () =>
                traps[counter].state === state)
          );
        }
        return trap;
      })
    );

    return traps[counter];
  };

  /**
   * getArray
   * @returns {any[]}
   */
  const getArray = () => {
    return Object.keys(traps).map((id) => traps[id]);
  };

  /**
   * watchStep
   * @param step
   * @param nextStep
   * @param options
   * @param callback
   * @returns {*}
   */
  const watchStep = (step: any, nextStep: any, options: any, callback: any) => {
    options = Object.assign(
      {},
      {
        distance: 15,
        innerRadiusTolerance: 0.75,
        centerRadiusTolerance: 0.5,
        courseTolerance: 30,
      },
      options
    );

    const distanceToNextPoint = options.distance || step.distance.value; // in meters

    const coordinate = step.start;

    return add(
      {
        type: TrapTypes.Types.STEP,
        innerRadius: distanceToNextPoint * options.innerRadiusTolerance,
        centerRadius: distanceToNextPoint * options.centerRadiusTolerance,
        outerRadius: distanceToNextPoint,
        courseTolerance: options.courseTolerance,
        coordinate,
        step,
        nextStep,
      },
      callback
    );
  };

  const __matches = (coordinate: any, heading: any) => {
    const trapKeys = Object.keys(traps);

    return trapKeys.map((index) => {
      const trap = traps[index];

      if (trap.state != TrapTypes.States.EXPIRED) {
        switch (trap.type) {
          case TrapTypes.Types.CIRCLE:
            if (
              GeoLib.isPointWithinRadius(
                coordinate,
                trap.coordinate,
                trap.radius
              )
            ) {
            }

            break;

          case TrapTypes.Types.STEP:
            const insideOuter = GeoLib.isPointWithinRadius(
              coordinate,
              trap.coordinate,
              trap.outerRadius
            );

            const insideInner = GeoLib.isPointWithinRadius(
              coordinate,
              trap.coordinate,
              trap.innerRadius
            );

            const stateMap = {
              [TrapTypes.States.OUTSIDE]: [
                TrapTypes.States.ENTERED,
                () => {
                  const isWithinCourseConstant = isWithinCourse(
                    trap.step.bearing,
                    heading,
                    trap.courseTolerance
                  );

                  return insideOuter
                    ? isWithinCourseConstant
                      ? TrapTypes.Events.ENTERING_ON_COURSE
                      : TrapTypes.Events.ENTERING_OFF_COURSE
                    : false;
                },
              ],

              [TrapTypes.States.ENTERED]: [
                TrapTypes.States.INSIDE,
                () => {
                  return insideOuter ? TrapTypes.Events.INSIDE : false;
                },
              ],

              [TrapTypes.States.INSIDE]: [
                TrapTypes.States.CENTER,
                () => {
                  return insideInner ? TrapTypes.Events.INSIDE_CENTER : false;
                },
              ],

              [TrapTypes.States.CENTER]: [
                TrapTypes.States.LEAVING,
                () => {
                  const isWithinCourseConstant = isWithinCourse(
                    trap.nextStep ? trap.nextStep.bearing : trap.step.bearing,
                    heading,
                    trap.courseTolerance
                  );

                  return insideOuter && !insideInner
                    ? isWithinCourseConstant
                      ? TrapTypes.Events.LEAVING_ON_COURSE
                      : TrapTypes.Events.LEAVING_OFF_COURSE
                    : false;
                },
              ],

              [TrapTypes.States.LEAVING]: [
                TrapTypes.States.LEFT,
                () => {
                  return !insideOuter && !insideInner
                    ? TrapTypes.Events.LEAVING
                    : false;
                },
              ],

              [TrapTypes.States.LEFT]: [
                TrapTypes.States.EXPIRED,
                () => {
                  return true;
                },
              ],
            };

            if (stateMap[trap.state]) {
              const func = stateMap[trap.state];
              const event = (func[1] as any)();

              if (event) {
                nextState(trap, event, func[0]);

                return true;
              }
            }

            break;
        }
      }
    });
  };

  const nextState = (trap: any, event: any, state: any) => {
    // set new status
    // traps[trap.index].state = state;
    const newTraps = traps.map((trapData: any) => {
      if (trapData.index === trap.index) {
        return { ...trapData, state };
      }
      return trapData;
    });
    setTraps(newTraps);

    // resolve with status
    //TODO!: check this logic
    if (event.constructor == String) {
      trap.callback && trap.callback(trap, event, state);
    }
  };

  const execute = (position: any) => {
    const { coordinate, heading, altitude } = position;
    __matches(coordinate, heading);
  };

  return {
    execute,
    add,
    nextState,
    watchStep,
    getArray,
    isWithinCourse,
  };
};

export default useTraps;
