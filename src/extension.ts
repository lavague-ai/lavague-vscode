import { NotebookCellData, NotebookData, NotebookEditor, Position, Range } from 'vscode';
import * as vscode from 'vscode';
import * as http from 'http';

let edit: vscode.TextEditor | undefined;
let expected_name: string = "";
let editArr: vscode.TextEditor[] = [];

const driverCode: string = `from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import lavague
import os.path

chrome_options = Options()

# Turns off GUI
# chrome_options.add_argument("--headless")

chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1600,900")

homedir = os.path.expanduser("~")

# Paths for your chrome and chromedriver binaries
chrome_options.binary_location = f"{homedir}/chrome-linux64/chrome"
webdriver_service = Service(f"{homedir}/chromedriver-linux64/chromedriver")

driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)

# Add your target URL as a string argument in the command below
driver.get([YOUR_TARGET_URL])
lavague.driver = driver`

const requestListener: http.RequestListener = (req, res) => {
    const fullUrl = new URL(req.url || '', `http://${req.headers.host}`);

    if (fullUrl.pathname === '/push' && req.method === 'POST') {
        const chunks: Uint8Array[] = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            try {
                const jsonData = JSON.parse(body);
                if (edit != undefined) {
                    edit.edit((editBuilder) => {
                        const wholeDoc = new Range(
                            edit!.document.positionAt(0),
                            edit!.document.positionAt(edit!.document.getText().length)
                        );
                        editBuilder.delete(wholeDoc)
                        editBuilder.insert(new Position(edit!.document.lineCount, 0), jsonData.data);
                    })
                    .then(noop, noop);
                }
                else {
                    vscode.window.showErrorMessage("You don't have any empty cell in your notebook, the generated code can't be inserted.")
                }
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('');
            } catch (e) {
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('');
    }
};

const server = http.createServer(requestListener);
const port = 8081;
server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

let prev_name = ""

function noop() {} 

function getActiveNotebookCell() {
    const activeEditor = vscode.window.activeNotebookEditor;
    return activeEditor;
}

export function activate(context: vscode.ExtensionContext) {
    let editorChangeDisposable = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
                editArr = [];
                edit = undefined;
                let found_magic = false;
                console.log(vscode.window.visibleTextEditors.length)
                vscode.window.visibleTextEditors.forEach((element) => {
                    console.log(element)
                    editArr.push(element);
                    if (element.document.getText().trim().length < 1) {
                        console.log("found cell?")
                        edit = element;
                    }
                    else if (element.document.getText().startsWith("%lavague_exec")) {
                        console.log("found magic command")
                        found_magic = true;
                    }
                }
                );
                if (!found_magic) {
                    edit = undefined;
                }
        }
    });

	let disposable = vscode.commands.registerCommand('lavague.initDocument', async () => {
        // const cell1 = new NotebookCellData(vscode.NotebookCellKind.Markup, "DRIVER", "")
        const cell2 = new NotebookCellData(vscode.NotebookCellKind.Code, driverCode, "python")
        const cell3 = new NotebookCellData(vscode.NotebookCellKind.Code, "%lavague_exec your_prompt", "python")
        let cell4 = new NotebookCellData(vscode.NotebookCellKind.Code, "", "python")
        var cells: NotebookCellData[];
        cells = [cell2, cell3, cell4];
        const notebook_data = new NotebookData(cells)
        const document = await vscode.workspace.openNotebookDocument(
            "jupyter-notebook",
            notebook_data
        );
        expected_name = document.uri.path
        const editor = await vscode.window.showNotebookDocument(document, {
            viewColumn: vscode.ViewColumn.One,
            preserveFocus: false
        });
	})

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
