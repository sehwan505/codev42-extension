import * as vscode from 'vscode';
import { exec } from 'child_process';

export interface GitInfo {
    branch: string;
    repository?: string;
    commitInfo?: string;
}

export function getGitInfo(): Promise<{ branch: string; commitInfo: string }> {
  return new Promise((resolve, reject) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return reject('워크스페이스 폴더가 없습니다.');
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;

    exec('git rev-parse --abbrev-ref HEAD', { cwd: workspacePath }, (err, stdoutBranch) => {
      if (err) {
        return reject(err.message);
      }
      const branch = stdoutBranch.trim();

      exec('git log -1 --pretty=format:"%h - %s"', { cwd: workspacePath }, (err, stdoutCommit) => {
        if (err) {
          return reject(err.message);
        }
        const commitInfo = stdoutCommit.trim();
        resolve({ branch, commitInfo });
      });
    });
  });
} 