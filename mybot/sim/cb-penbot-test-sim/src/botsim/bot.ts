
const gearboxRatio: number = (32/9)*(22/11)*(26/9)*(31/10);
const stepsPerMotorRevolution: number = 32;
const stepsPerRevolution: number = gearboxRatio * stepsPerMotorRevolution;
// should be ~ 2037.885? - this is _whole_ steps

// the above are constants, because I only have these motors.
// those below are variable, either because I can manipulate them,
// or because I need to measure them.

export type Polar = {
    r: number;
    t: number;
}
export type Coords = {
    x: number;
    y: number;
}

export type BotPosition = {
    pen: Coords;
    orientation: number;
}

const p2c = (p: Polar): Coords => {
    return {
        x: p.r * Math.cos(p.t),
        y: p.r * Math.sin(p.t)
    }
}

const c2p = (c: Coords): Polar => {
    return {
        r: Math.sqrt(c.x * c.x + c.y * c.y),
        t: Math.atan2(c.y, c.x)
    }
}

export const LashState = {
    TBD: "tbd",
    CW: "cw",
    CCW: "ccw"
};
type Lash = typeof LashState.TBD | typeof LashState.CW | typeof LashState.CCW;

type breselhamChar = 'L' | 'l' | 'R' | 'r' | 'B' | 'b' | 'C' | 'c';
type stepper = () => void;
type breselhamMap = {
    [char in breselhamChar]: stepper;
};

export interface BotProps {
        wheelDiameter?: number;
        axleWidth?: number;
        deadband?: number;
        penDistanceFromAxle?: number;
        penOffsetFromCenterline?: number;
}

export const defaultBotProps: BotProps = {
    wheelDiameter: 36,
    axleWidth: 84,
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

    _stepCounter: number = 0;

    _lashLeft: Lash = LashState.TBD;
    _lashRight: Lash = LashState.TBD;

    _wheelStepMm: number = 0.0; // mm per step at the wheel

    _leftWheelPolarFromPen: Polar = {r: 0, t: 0};
    _rightWheelPolarFromPen: Polar = {r: 0, t: 0};
    _axleMidpointPolarFromPen: Polar = {r: 0, t: 0};
    _singleStepAngle: number = 0.0;

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

        // bot starts with pen at origin, facing along positive x.
        this._wheelStepMm = this.calculateStepMmAtWheel();

        const wheelX = -this._penDistanceFromAxle;
        const leftWheelY = this._axleWidth / 2 + this._penOffsetFromCenterline;
        const rightWheelY = - this._axleWidth / 2 + this._penOffsetFromCenterline;

        this._leftWheelPolarFromPen = c2p({x: wheelX, y: leftWheelY});
        this._rightWheelPolarFromPen = c2p({x: wheelX, y: rightWheelY});
        this._axleMidpointPolarFromPen = c2p({x: wheelX, y: (leftWheelY+rightWheelY)/2});

        this._singleStepAngle = this._wheelStepMm / this._axleWidth;
    }

    revolutionsToSteps(revolutions: number): number {
        return revolutions * stepsPerRevolution;
    }

    _rotateAroundLeftWheel = (angle: number) => this._rotateAroundWheel(angle, this._leftWheelPolarFromPen);

    _rotateAroundRightWheel = (angle: number) => this._rotateAroundWheel(angle, this._rightWheelPolarFromPen);

    _rotateAroundAxleMidpoint = (angle: number) => this._rotateAroundWheel(angle, this._axleMidpointPolarFromPen);

    _rotateAroundWheel = (angle: number, wheelPolarFromPen: Polar) => {
        // we already know left wheel polar from pen
        // to get its current position, rotate by orientation, get cart, translate to pen posn
        const lwp:Polar = {... wheelPolarFromPen};
        lwp.t += this._orientation;
        const lwc = p2c(lwp);
        lwc.x += this._positionX;
        lwc.y += this._positionY;

        // this is the position of the wheel. So translate the pen so the wheel as at zero!
        const pen:Coords = {'x': this._positionX, 'y': this._positionY};
        pen.x -= lwc.x;
        pen.y -= lwc.y;
        // rotate
        const penp = c2p(pen);
        penp.t += angle;
        const penc = p2c(penp);
        // untranslate
        penc.x += lwc.x;
        penc.y += lwc.y;
        // set the position and new angle:
        this._positionX = penc.x;
        this._positionY = penc.y;
        this._orientation += angle;
    }

    stepLeft() {
        this._rotateAroundRightWheel(-this._singleStepAngle);
        this._stepCounter++;
    }

    stepBackLeft() {
        this._rotateAroundRightWheel(this._singleStepAngle);
        this._stepCounter++;
    }

    stepRight() {
        this._rotateAroundLeftWheel(this._singleStepAngle);
        this._stepCounter++;
    }

    stepBackRight() {
        this._rotateAroundLeftWheel(-this._singleStepAngle);
        this._stepCounter++;
    }

    stepBoth() {
        this._stepCounter++;
        const x = this._wheelStepMm * Math.cos(this._orientation);
        const y = this._wheelStepMm * Math.sin(this._orientation);
        this._positionX += x;
        this._positionY += y;
    }

    stepBackBoth() {
        this._stepCounter++;
        const x = -this._wheelStepMm * Math.cos(this._orientation);
        const y = -this._wheelStepMm * Math.sin(this._orientation);
        this._positionX += x;
        this._positionY += y;
    }

    stepCw(){
        this._stepCounter++;
        this._rotateAroundAxleMidpoint(-this._singleStepAngle*2);
    }

    stepCcw(){
        this._stepCounter++;
        this._rotateAroundAxleMidpoint(this._singleStepAngle*2);
    }

    calculateStepMmAtWheel(): number {
        const wheelCircumference = Math.PI * this._wheelDiameter;
        const stepMmAtWheel = wheelCircumference / stepsPerRevolution;
        return stepMmAtWheel;
    }

    bMap = ():breselhamMap => {
        return {
            'L': this.stepLeft.bind(this),
            'l': this.stepBackLeft.bind(this),
            'R': this.stepRight.bind(this),
            'r': this.stepBackRight.bind(this),
            'B': this.stepBoth.bind(this),
            'b': this.stepBackBoth.bind(this),
            'C': this.stepCw.bind(this),
            'c': this.stepCcw.bind(this),
        };
    };

    bresenham = (s: string):BotPosition[] => {
        if(s.match(/[^LlRrBbCc]/)){ // eventually Pp will be pen up/down
            throw Error("bresenham string expected only to contain LlRrBb");
        }
        const bm = this.bMap();
        const list:BotPosition[] = [];
        for(const c of s.split('') as breselhamChar[]){
            bm[c]();
            list.push({
                'orientation': this._orientation,
                'pen': {'x': this._positionX, 'y': this._positionY}
            })
        }
        return list;
    }
}