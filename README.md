<div align="center">
  <img src="./assets/logo.png" width=140px: alt="LaVague Logo">
  <h1>Welcome to the LaVague VsCode Extension</h1>
  <p>🪄 Copilot for automating automation</p>
<h1></h1>
</div>

## 🌊 What is LaVague?

The LaVague VsCode extension is an **open-source** project designed to automate automation for devs! 

It enables you to leverage AI to turn your **natural language instructions** into Python code for automation leveraging **Selenium**.

Behind the scenes, we use **advanced AI techniques** (RAG, Few-shot learning, Chain of Thought) to enhance performance - check out [our documentation to find out more](https://docs.lavague.ai/en/latest/)!

## 🔧 Pre-requisites

To use our VsCode extension you will need:

- A version of VsCode >= 1.80

- The Jupyter notebooks VsCode extension
![jupyter-extension](./assets/jupter-extension.png)

- You will also need to install the chrome webdriver & LaVague. You can do this by running our `setup.sh` LaVague installation script [available here](https://github.com/lavague-ai/LaVague)

See the LaVague installation instructions [for more details](https://docs.lavague.ai/en/latest/docs/get-started/setting-up-la-vague/)!

## 🏄‍♀️ Getting started

To get started with LaVague:

- Open a new LaVague project. You can do this by opening the VSCode Command Palette with Ctrl+Shift+P

- Type or search and find the 'LaVague: New project' command
![new-project](./assets/command-2.png)

This will open a new LaVague Jupyter notebook file in VsCode with some pre-filled cells of code.

- Add the URL you wish to generate automation code for in the first cell block
![add-target-URL](./assets/add-url.png)

If we run this first block of code, we can see a new VsCode window opens displaying our target site:
![target-site](./assets/window-1.png)

We're now ready to add an instruction for the action we'd like to automate:
![add-instruction](./assets/instruction.png)

> Note you will need to have an OpenAI API key set in your notebook environment. If you don't have yours set in this environment, you can add the following code into a cell:
![add-API-key](./assets/add-key.png)

Your automation code will populate the next cell.

By running this cell, we can now see the result of our automation code:
![result](./assets/ret.png)

> Note, it is possible to put a sequence of actions into one set of instructions as follows:

![chain](./assets/double-instructions.png)

⚠️ Note the extension always expects the cell following the cell with our `%lavague-exec` command to be empty so it can populate it with the generated automation code. 

If you don't have an empty cell, you will see the following error:

![empty-cell-error](./assets/empty-cell-warning.png)


Therefore, to run a new command now, we can move the previous generated code above our `%lavague-exec` command:
![next-command](./assets/move-old-code-up.png)

## 🙋 Get support

You can report a bug by opening a [new issue](https://github.com/lavague-ai/lavague-vscode/issues) on our GitHub repo. We regularly track bug reports and try to respond as soon as possible!

You can also chat with us on our [Discord server](https://discord.com/invite/SDxn9KpqX9)!