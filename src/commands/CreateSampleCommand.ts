import { window } from 'vscode';
import { command } from '../decorator';
import { Command } from '../base';

@command({
  identifier: 'create.sample',
  handler: createSampleHandler,
})
export class CreateSampleCommand extends Command<CreateSampleParams, CreateSampleResult> {
  register() {
    // something
    super.register();
  }

  async executeAsync(params: CreateSampleParams) {
    // something
    return await super.executeAsync(params);
  }

  dispose(): void {
    // somegthing
    super.dispose();
  }
}

type CreateSampleParams = { someghing: string };
type CreateSampleResult = { done: boolean };
function createSampleHandler(params: CreateSampleParams): CreateSampleResult {
  window.showInformationMessage('create sample');
  return { done: true };
}
