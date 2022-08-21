// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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

function runLine() {
  console.log('run Line');
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
    vscode.window.showInformationMessage('runLine');
  });
  context.subscriptions.push(runLineDisposable);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('rspec-runner.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from rspec-runner!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
