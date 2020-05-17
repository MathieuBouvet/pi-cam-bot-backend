import { Gpio } from "onoff";
import {
  gpiosToActivate,
  activate,
  deactivate,
  Movement,
  RobotWheels,
} from "../utils/wheels";

const robotWheels: RobotWheels = {
  left: [new Gpio(23, "out"), new Gpio(24, "out")],
  right: [new Gpio(27, "out"), new Gpio(17, "out")],
};

const allGpios = [...robotWheels.left, ...robotWheels.right];

function update(newMovement: Movement): void {
  allGpios.forEach(deactivate);
  gpiosToActivate(newMovement, robotWheels).forEach(activate);
}

export default {
  update,
};
