const vscode = require('vscode');
const VsCodeTaskButton = require('./src/VsCodeTaskButton');

var vsCodeTaskButton = new VsCodeTaskButton(vscode.workspace.getConfiguration('VsCodeTaskButtons'));

function activate(context) {
    // create a new word counter
    vsCodeTaskButton.activate();
}

function deactivate() {
    vsCodeTaskButton.deactivate();
}

module.exports = {
    activate,
    deactivate
}