import { window } from 'vscode';
import { command } from '../decorator';
import { Command } from '../base';

@command({ identifier: 'create.sample' })
export class CreateSampleCommand extends Command {
  handle(): void {
    window.showInformationMessage('create sample');
  }
}
