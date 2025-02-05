import * as vscode from 'vscode';
import { registerCommands } from './core/commands';

/**
 * 확장 프로그램이 활성화될 때 호출됩니다.
 */
export function activate(context: vscode.ExtensionContext) {
  // 명령어 등록
  registerCommands(context);
}

export function deactivate() {}