import { NotebookCellData, NotebookData, NotebookEditor, Position, Range } from 'vscode';
import * as vscode from 'vscode';
import * as http from 'http';
import {Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout} from 'async-mutex';


let edit: vscode.TextEditor | undefined;
let expected_name: string = "";
let editArr: vscode.TextEditor[] = [];

let first = false;
let txt = ""
let target: vscode.TextEditor | undefined = undefined;
let over = false;
let endPosition = undefined
let doc: vscode.TextDocument

const mutex = new Mutex();

const driverCode: string = `from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from lavague import vscode_extension
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
lavague.vscode_extension.driver = driver`

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const requestListener: http.RequestListener = (req, res) => {
    const fullUrl = new URL(req.url || '', `http://${req.headers.host}`);

    if (fullUrl.pathname === '/push' && req.method === 'POST') {
        const chunks: Uint8Array[] = [];
        
        req.on('data', async (chunk) => {
            await mutex.runExclusive(async () => {
                const data = chunk.toString()
                const jsonData = JSON.parse(data);
                if (jsonData.over == true) {
                    const wholeDoc = new Range(
                        edit!.document.positionAt(0),
                        edit!.document.positionAt(edit!.document.getText().length)
                    );
                    const ret = await target!.edit(async (editBuilder) => {
                        editBuilder.delete(wholeDoc)
                        endPosition = target!.document.lineAt(target!.document.lineCount - 1).range.end;
                        console.log(jsonData.full_code)
                        editBuilder.insert(endPosition!, jsonData.full_code);
                    })
                    over = true;
                }
                else {
                    if (target == undefined) {
                        target = edit;
                    }
                    if (target != undefined) {
                        const ret = await target.edit(async (editBuilder) => {
                            if (!first) {
                                const wholeDoc = new Range(
                                    doc.positionAt(0),
                                    doc.positionAt(doc.getText().length)
                                );
                                editBuilder.delete(wholeDoc)
                                first = true;
                            }
                            endPosition = doc.lineAt(target!.document.lineCount - 1).range.end;
                            editBuilder.insert(endPosition!, jsonData.data);
                        })
                    }
                    chunks.push(chunk);
                }
            });
        });

        req.on('end', async () => {
            await mutex.runExclusive(async () => {
                if (over) {
                    over = false;
                    console.log("stop")
                    first = false;
                    target = undefined;
                    txt = "";
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('');
        })
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
                    if (element!.document.fileName == expected_name) {
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
                }
                );
                if (!found_magic) {
                    edit = undefined;
                }
                else if (edit != undefined) {
                    console.log(edit.document)
                    doc = edit.document
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
