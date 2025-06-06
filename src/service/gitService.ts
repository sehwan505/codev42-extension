import * as vscode from 'vscode';
import { exec } from 'child_process';
import { GitInfo } from '../types/response';

export async function handleGetGitInfo(panel: vscode.WebviewPanel) {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('워크스페이스 폴더가 없습니다.');
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    
    const response = await new Promise<GitInfo>((resolve, reject) => {
      exec('git rev-parse --abbrev-ref HEAD', { cwd: workspacePath }, (err, stdoutBranch) => {
        if (err) {
          reject(err.message);
          return;
        }
        const branch = stdoutBranch.trim();

        exec('git config --get remote.origin.url', { cwd: workspacePath }, (err, stdoutUrl) => {
          if (err) {
            reject(err.message);
            return;
          }
          const repository = stdoutUrl.trim();
          resolve({ branch, repository });
        });
      });
    });

    if (panel) {
      panel.webview.postMessage({ command: 'getGitInfo', data: response });
    }
    return response;
  } catch (error: any) {
    console.error('Error:', error);
    throw error;
  }
}