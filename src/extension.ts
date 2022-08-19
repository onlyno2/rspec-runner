// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function runAll() {
  console.log('run All');
}

function runFile() {
  console.log('run File');
}

function runLine() {
  console.log('run Line');
}

export function activate(context: vscode.ExtensionContext) {	
	console.log('Congratulations, your extension "rspec-runner" is now active!');

  let runAllDisposable = vscode.commands.registerCommand('rspec-runner.runAll', () => {
    vscode.window.showInformationMessage('runAll');
  });
  context.subscriptions.push(runAllDisposable);

  let runFileDisposable = vscode.commands.registerCommand('rspec-runner.runFile', () => {
    vscode.window.showInformationMessage('runFile');
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
