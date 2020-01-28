import {FileType} from 'sartography-workflow-lib';
import { GetIconCodePipe } from './get-icon-code.pipe';

describe('GetIconCodePipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new GetIconCodePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should get an icon code for each file type', () => {
    Object.values(FileType).forEach(ft => expect(pipe.transform(ft)).toBeTruthy());
  });
});
