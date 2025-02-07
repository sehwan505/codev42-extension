import * as vscode from 'vscode';
import { registerCommands } from './core/commands';

export function activate(context: vscode.ExtensionContext) {
  console.log("codev42 extension activated.");
  registerCommands(context);
}

export function deactivate() {}
