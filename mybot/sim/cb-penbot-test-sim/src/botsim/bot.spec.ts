import { describe, it, expect } from 'vitest';
import { Bot } from './bot';

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
})

describe('Bot step counting', () => {
    it('should correctly count steps for left and right motors', () => {
        const bot = new Bot();
        expect(bot._stepCounterLeft).toBe(0);
        expect(bot._stepCounterRight).toBe(0);

        // Simulate some steps
        bot.stepLeft();
        expect(bot._stepCounterLeft).toBe(1);
        expect(bot._stepCounterRight).toBe(0);
        bot.stepRight();
        expect(bot._stepCounterLeft).toBe(1);
        expect(bot._stepCounterRight).toBe(1);
    });
});