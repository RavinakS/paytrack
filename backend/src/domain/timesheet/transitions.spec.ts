import { assertValidTransition } from './transitions';

describe('timesheet transitions', () => {
  it('allows only the specified state changes', () => expect(() => assertValidTransition('SUBMITTED', 'APPROVED', true)).not.toThrow());
  it('rejects an empty draft submission with an actionable message', () => expect(() => assertValidTransition('DRAFT', 'SUBMITTED', false)).toThrow('Add at least one line'));
  it('makes paid timesheets immutable', () => expect(() => assertValidTransition('PAID', 'DRAFT', true)).toThrow('already been paid'));
  it('rejects an unsupported transition', () => expect(() => assertValidTransition('DRAFT', 'PAID', true)).toThrow('cannot move'));
});
