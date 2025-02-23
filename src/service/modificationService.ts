import * as vscode from 'vscode';

export function applyModification(data: any): void {
  const filePath: string = data.file;
  const modifications: any[] = data.modifications;

  const uri = vscode.Uri.file(filePath);
  vscode.workspace.openTextDocument(uri).then(document => {
    console.log(document);
    const edit = new vscode.WorkspaceEdit();

    modifications.forEach(mod => {
      const start = new vscode.Position(mod.range.start.line, mod.range.start.character);
      const end = new vscode.Position(mod.range.end.line, mod.range.end.character);
      const range = new vscode.Range(start, end);
      edit.replace(uri, range, mod.newText);
    });

    vscode.workspace.applyEdit(edit).then(success => {
      if (success) {
        vscode.window.showInformationMessage('수정사항이 성공적으로 적용되었습니다.');
      } else {
        vscode.window.showErrorMessage('수정사항 적용에 실패했습니다.');
      }
    }, err => {
      vscode.window.showErrorMessage(`수정사항 적용에 실패했습니다: ${err}`);
    });
  }, err => {
    vscode.window.showErrorMessage(`파일 열기에 실패했습니다: ${err}`);
  });
} 