import { NoDotPipe } from './no-dot.pipe';

describe('NoDotPipe', () => {
  it('create an instance', () => {
    const pipe = new NoDotPipe();
    expect(pipe).toBeTruthy();
  });
});
