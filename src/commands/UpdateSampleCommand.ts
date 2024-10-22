import { window } from 'vscode';
import { command } from '../decorator';
import { Command } from '../base';

@command({ identifier: 'update.sample.name' })
export class UpdateSampleCommand extends Command {
  handle(): void {
    window.showInformationMessage('update sample name');
  }
}