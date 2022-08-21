import * as vscode from 'vscode';

let terminals: { [id: string]: vscode.Terminal } = {};
let TERMINAL_NAME = "Rspec Runner";

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
  execCommand('bundle exec rspec');
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
  execCommand(`bundle exec rspec ${file}`);
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
  execCommand(`bundle exec rspec ${file}:${activeLine}`);
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
