import { Pipe, PipeTransform } from '@angular/core';
import {FileType} from 'sartography-workflow-lib';

@Pipe({
  name: 'getIconCode'
})
export class GetIconCodePipe implements PipeTransform {

  transform(value: FileType, ...args: any[]): any {
    switch (value) {
      case FileType.BPMN:
        return 'account_tree';
      case FileType.SVG:
        return 'image';
      case FileType.DMN:
        return 'view_list';
    }
  }
}
