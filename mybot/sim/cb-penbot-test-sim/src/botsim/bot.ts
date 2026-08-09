
const gearboxRatio: number = (32/9)*(22/11)*(26/9)*(31/10);
const stepsPerMotorRevolution: number = 32;
const stepsPerRevolution: number = gearboxRatio * stepsPerMotorRevolution;
// should be ~ 2037.885? - this is _whole_ steps

// the above are constants, because I only have these motors.
// those below are variable, either because I can manipulate them,
// or because I need to measure them.

export const LashState = {
    TBD: "tbd",
    CW: "cw",
    CCW: "ccw"
};
type Lash = typeof LashState.TBD | typeof LashState.CW | typeof LashState.CCW;

export interface BotProps {
        wheelDiameter?: number;
        axleWidth?: number;
        deadband?: number;
        penDistanceFromAxle?: number;
        penOffsetFromCenterline?: number;
}

const defaultBotProps: BotProps = {
    wheelDiameter: 36,
    axleWidth: 48,
    deadband: 10,
    penDistanceFromAxle: 55,
    penOffsetFromCenterline: 0.0
}

export class Bot {

    /**
     * TODO:
     * needs to track its position, orientation
     * needs to track pen up/down
     * needs to track gearbox lash/loaded flank
     * 
     * 
     **/

    // all real-world measurements are in millimeters.
    _wheelDiameter: number = 36;
    _axleWidth: number = 48;
    _deadband: number = 10; // whole-steps
    // TODO: measure irl deadband in terms of steps
    _penDistanceFromAxle: number = 55;
    _penOffsetFromCenterline: number = 0.0;

    _positionX: number = 0.0;
    _positionY: number = 0.0;
    _orientation: number = 0.0; // radians, ccw from x-axis

    _stepCounterLeft: number = 0;
    _stepCounterRight: number = 0;

    _lashLeft: Lash = LashState.TBD;
    _lashRight: Lash = LashState.TBD;

    constructor(props: BotProps|undefined = undefined){
        const {wheelDiameter, axleWidth, deadband, penDistanceFromAxle, penOffsetFromCenterline}
         = props === undefined ? defaultBotProps : 
         {...defaultBotProps, ...props};

        // Initialize the bot's state and properties here
        this._wheelDiameter = wheelDiameter!;
        this._axleWidth = axleWidth!;
        this._deadband = deadband!;
        this._penDistanceFromAxle = penDistanceFromAxle!;
        this._penOffsetFromCenterline = penOffsetFromCenterline!;
    }

    revolutionsToSteps(revolutions: number): number {
        return revolutions * stepsPerRevolution;
    }

    stepLeft() {
        this._stepCounterLeft++;
    }

    stepRight() {
        this._stepCounterRight++;
    }

    calculateStepMmAtWheel(): number {
        const wheelCircumference = Math.PI * this._wheelDiameter;
        const stepMmAtWheel = wheelCircumference / stepsPerRevolution;
        return stepMmAtWheel;
    }
}