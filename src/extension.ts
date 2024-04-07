import { NotebookCellData, NotebookData, NotebookEditor, Position } from 'vscode';
import * as vscode from 'vscode';
import * as http from 'http';

var edit: vscode.TextEditor;
var editArr: vscode.TextEditor[] = [];

const driverCode: string = `from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import lavague
import os.path

chrome_options = Options()
chrome_options.add_argument("--headless")  # Ensure GUI is off
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1600,900")

homedir = os.path.expanduser("~")
chrome_options.binary_location = f"{homedir}/chrome-linux64/chrome"
webdriver_service = Service(f"{homedir}/chromedriver-linux64/chromedriver")

lavague.driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)
lavague.driver.get("")
driver = lavague.driver`

const requestListener: http.RequestListener = (req, res) => {
    const fullUrl = new URL(req.url || '', `http://${req.headers.host}`);

    if (fullUrl.pathname === '/push' && req.method === 'POST') {
        // Initialize an array to hold the chunks of data
        const chunks: Uint8Array[] = [];

        // Listen for 'data' event to receive data chunks
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        // 'end' event is emitted after all data is received
        req.on('end', () => {
            // Combine all chunks to get the complete request body
            const body = Buffer.concat(chunks).toString();
            console.log(body)
            try {
                // Parse the JSON data
                const jsonData = JSON.parse(body);
				edit.edit((editBuilder) => {
					editBuilder.insert(new Position(edit.document.lineCount, 0), jsonData.data);
				})
				.then(noop, noop);
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('Hello, this is the main page!');
            } catch (e) {
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found.');
    }
};

const server = http.createServer(requestListener);
const port = 8081;
server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});


function noop() {} 

function getActiveNotebookCell() {
    const activeEditor = vscode.window.activeNotebookEditor;
    return activeEditor;
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('lavague-test.initDocument', async () => {
        const cell1 = new NotebookCellData(vscode.NotebookCellKind.Code, 'import os\nos.environ["OPENAI_API_KEY"] = ""', "python")
        const cell2 = new NotebookCellData(vscode.NotebookCellKind.Code, driverCode, "python")
        const cell3 = new NotebookCellData(vscode.NotebookCellKind.Code, "%lavague_exec your_prompt", "python")
        const cell4 = new NotebookCellData(vscode.NotebookCellKind.Code, "", "python")
        var cells: NotebookCellData[];
        cells = [cell1, cell2, cell3, cell4];
        const notebook_data = new NotebookData(cells)
        const document = await vscode.workspace.openNotebookDocument(
            "jupyter-notebook",
            notebook_data
        );
        const editor = await vscode.window.showNotebookDocument(document, {
            viewColumn: vscode.ViewColumn.One,
            preserveFocus: false
        });
        console.log(vscode.window.activeTextEditor);
        while(vscode.window.activeTextEditor?.document.fileName != document.uri.path);
        editArr = [];
        vscode.window.visibleTextEditors.forEach((element) => {
            if (element.document.fileName == document.uri.path) {
                editArr.push(element);
                console.log(element.document.getText().length)
                if (element.document.getText().trim().length < 1) {
                    edit = element;
                }
            }
        }
        );
        console.log(edit);
	})

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
