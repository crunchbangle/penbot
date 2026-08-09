import { describe, it, expect } from 'vitest';
import { Bot } from './bot';
import type { Coords } from './bot';

describe('28BYJ-48 geometry', () => {
    it('give the correct whole steps per revolution', () => {
        const bot = new Bot();
        expect(bot.revolutionsToSteps(1)).toBeCloseTo(2037.885);
    });
});

describe('Bot core calulations', () => {
    it('should calculate the correct step size in mm at the wheel', () => {
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({"wheelDiameter": testWheelDiameter});
        const stepMmAtWheel = bot.calculateStepMmAtWheel();
        expect(stepMmAtWheel).toBeCloseTo(1);
    })
    it('should calculate the correct x,y translation for right-step', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = -25; // puts pen in-line with left wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the left wheel
        bot.stepRight();
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(1);
    })
    it('should calculate the correct x,y translation for left-step', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = 25; // puts pen in-line with right wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the right wheel
        bot.stepLeft();
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(-1);
    })
    it('should calculate the correct x translation for both-step', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.stepBoth();
        expect(bot._positionX).toBeCloseTo(1);
        expect(bot._positionY).toBeCloseTo(0);
    })
    it('should calculate the correct x translation for both-step heading north', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        bot._orientation = Math.PI/2; // facing north
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.stepBoth();
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(1);
    })
})

describe('Bot step counting', () => {
    it('should correctly count steps for left and right motors', () => {
        const bot = new Bot();
        expect(bot._stepCounter).toBe(0);

        // Simulate some steps
        bot.stepLeft();
        expect(bot._stepCounter).toBe(1);
        bot.stepRight();
        expect(bot._stepCounter).toBe(2);
        bot.stepBoth();
        expect(bot._stepCounter).toBe(3);
        bot.stepBackLeft();
        expect(bot._stepCounter).toBe(4);
        bot.stepBackRight();
        expect(bot._stepCounter).toBe(5);
        bot.stepBackBoth();
        expect(bot._stepCounter).toBe(6);
    });
});

describe('Bot Bresenham processing', ()=>{
    
    it('should calculate the correct x,y translation for R', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = -25; // puts pen in-line with left wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the left wheel
        bot.bresenham('R');
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(1);
    })
    it('should calculate the correct x,y translation for L', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = 25; // puts pen in-line with right wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the right wheel
        bot.bresenham('L');
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(-1);
    })
    it('should calculate the correct x,y translation for r', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = -25; // puts pen in-line with left wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the left wheel
        bot.bresenham('r');
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(-1);
    })
    it('should calculate the correct x,y translation for l', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const wheelSeparation = 50;
        const penFromAxle = 50; // puts pen same distance from wheel as other wheel, so they should travel same distance
        const penOffset = 25; // puts pen in-line with right wheel... should end up same x (ish), and about y=1
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
            "axleWidth": wheelSeparation,
            "penDistanceFromAxle": penFromAxle,
            "penOffsetFromCenterline": penOffset
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        
        // should rotate around the right wheel
        bot.bresenham('l');
        expect(bot._positionX).toBeCloseTo(-0.005);
        expect(bot._positionY).toBeCloseTo(1);
    })
    it('should calculate the correct x translation for B', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.bresenham('B');
        expect(bot._positionX).toBeCloseTo(1);
        expect(bot._positionY).toBeCloseTo(0);
    })
    it('should calculate the correct x translation for b', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.bresenham('b');
        expect(bot._positionX).toBeCloseTo(-1);
        expect(bot._positionY).toBeCloseTo(0);
    })
    it('should calculate the correct x translation for B heading north', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        bot._orientation = Math.PI/2; // facing north
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.bresenham('B');
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(1);
    })
    it('should calculate the correct x translation for b heading north', () =>{
        const testWheelDiameter = 2037.885 / Math.PI;
        const bot = new Bot({
            "wheelDiameter": testWheelDiameter,
        });
        bot._orientation = Math.PI/2; // facing north
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(0);
        bot.bresenham('b');
        expect(bot._positionX).toBeCloseTo(0);
        expect(bot._positionY).toBeCloseTo(-1);
    })
})