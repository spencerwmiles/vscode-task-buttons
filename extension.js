const vscode = require("vscode");
const VsCodeTaskButton = require("./src/VsCodeTaskButton");

var vsCodeTaskButton = new VsCodeTaskButton(
  vscode.workspace.getConfiguration("VsCodeTaskButtons")
);

function activate(context) {
  vscode.workspace.onDidChangeConfiguration(() => {
    vsCodeTaskButton.updateConfiguration(
      vscode.workspace.getConfiguration("VsCodeTaskButtons")
    );
  });

  vsCodeTaskButton.activate();
}

function deactivate() {
  vsCodeTaskButton.deactivate();
}

module.exports = {
  activate,
  deactivate,
};
