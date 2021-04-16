import { Component, OnInit } from '@angular/core';
import { ApiService } from 'sartography-workflow-lib';

@Component({
  selector: 'app-test-markdown-dialog',
  templateUrl: './test-markdown-dialog.component.html',
  styleUrls: ['./test-markdown-dialog.component.scss']
})
export class TestMarkdownDialogComponent {
data  = '{}';
template = '';
result = '';
  constructor(
    private api: ApiService) { }

  render() {
    this.api.renderMarkdown(this.template, this.data).subscribe(data => this.result = data);
  }
}
