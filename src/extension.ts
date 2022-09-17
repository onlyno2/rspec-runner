import * as vscode from 'vscode';

let terminals: { [id: string]: vscode.Terminal } = {};
let TERMINAL_NAME = "Rspec Runner";

const RSPEC_RUNNER_EXECUTABLE_PATH: string = 'rspec-runner.executePath';
const DEFAULT_EXECUTABLE_PATH: string = 'rspec';

const RSPEC_RUNNER_OUTPUT_FORMAT: string = 'rspec-runner.outputFormat';
const DEFAULT_OUTPUT_FORMAT: string = 'progress';

const RSPEC_RUNNER_USE_BUNDLER: string = 'rspec-runner.useBundler';

function getExecutablePath(): string {
  return vscode.workspace.getConfiguration().get(RSPEC_RUNNER_EXECUTABLE_PATH) || DEFAULT_EXECUTABLE_PATH;
}

function getUseBundler(): boolean {
  return vscode.workspace.getConfiguration().get(RSPEC_RUNNER_USE_BUNDLER) || true;
}

function getOutputFormat(): string {
  return vscode.workspace.getConfiguration().get(RSPEC_RUNNER_OUTPUT_FORMAT) || DEFAULT_OUTPUT_FORMAT;
}

function buildCommand(): string {
  const executablePath = getExecutablePath();
  const bundler = getUseBundler() ? 'bundle exec' : '';
  const outputFormat = getOutputFormat();

  if (executablePath === 'rspec') {
    return `${bundler} ${executablePath} -f ${outputFormat}`;
  } else {
    return `${executablePath} -f ${outputFormat}`;
  }
}

function getTerminal() {
  let currentTerminal: vscode.Terminal = terminals[TERMINAL_NAME];

  if (!currentTerminal) {
    terminals[TERMINAL_NAME] = vscode.window.createTerminal(TERMINAL_NAME);
  }

  return terminals[TERMINAL_NAME];
}

function clearTerminal() {
  if (!vscode.window.activeTextEditor) return;

  vscode.window.activeTextEditor.document.save();
  return vscode.commands.executeCommand("workbench.action.terminal.clear");
}

function execCommand(command: string) {
  let terminal = getTerminal();

  terminal.sendText(command);
  terminal.show();
}

function runAll() {
  execCommand(buildCommand());
}

function getFilePath(): string {
  if (!vscode.window.activeTextEditor) {
    return '';
  }

  return vscode.window.activeTextEditor?.document.uri.path;
}

function getWorkspacePath(): string {
  if (!vscode.workspace.workspaceFolders) {
    return '';
  }

  const workspacePaths: string[] = vscode.workspace.workspaceFolders.map(workspaceFolder => workspaceFolder.uri.path);
  return workspacePaths.find(path => getFilePath().includes(path)) || '';
}

function runFile() {
  const filePath = getFilePath();
  const workspacePath = getWorkspacePath();

  if (filePath === '' || workspacePath === '') {
    vscode.window.showErrorMessage('No file');
    return;
  }

  if (!/_spec.rb/.test(filePath)) {
    vscode.window.showErrorMessage('Not rspec file');
    return;    
  }

  const file = filePath.replace(`${workspacePath}/`, "");
  const command = buildCommand();
  execCommand(`${command} ${file}`);
}

function getActiveLine(): number {
  if (!vscode.window.activeTextEditor) {
    return -1;
  }

  return vscode.window.activeTextEditor.selection.active.line + 1;
}

function runLine() {
  const filePath = getFilePath();
  const workspacePath = getWorkspacePath();
  const activeLine = getActiveLine();

  if (filePath === '' || workspacePath === '' || activeLine === -1) {
    vscode.window.showErrorMessage('Invalid spec');
    return;
  }

  if (!/_spec.rb/.test(filePath)) {
    vscode.window.showErrorMessage('Not rspec file');
    return;    
  }

  const file = filePath.replace(`${workspacePath}/`, "");
  const command = buildCommand();
  execCommand(`${command} ${file}:${activeLine}`);
}

export function activate(context: vscode.ExtensionContext) {	
	console.log('Congratulations, your extension "rspec-runner" is now active!');

  let runAllDisposable = vscode.commands.registerCommand('rspec-runner.runAll', () => {
    clearTerminal()?.then(() => runAll());
  });
  context.subscriptions.push(runAllDisposable);

  let runFileDisposable = vscode.commands.registerCommand('rspec-runner.runFile', () => {
    clearTerminal()?.then(() => runFile());
  });
  context.subscriptions.push(runFileDisposable);

  let runLineDisposable = vscode.commands.registerCommand('rspec-runner.runLine', () => {
    clearTerminal()?.then(() => runLine());
  });
  context.subscriptions.push(runLineDisposable);
}

export function deactivate() {}
