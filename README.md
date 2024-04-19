<div align="center">
  <img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/logo.png" width=140px: alt="LaVague Logo">
  <h1>Welcome to the LaVague VSCode Extension</h1>
  <p>🪄 Copilot for automating automation</p>
<h1></h1>
</div>

## 🌊 What is LaVague?

The LaVague VSCode extension is an **open-source** project designed to automate automation for devs! 

It enables you to leverage AI to turn your **natural language instructions** into Python code for automation leveraging **Selenium**.

Behind the scenes, we use **advanced AI techniques** (RAG, Few-shot learning, Chain of Thought) to enhance performance - check out [our documentation to find out more](https://docs.lavague.ai/en/latest/)!

### LaVague VSCode Extension in Action

Check out what the LaVague VSCode Extension looks like in action:

<div>
    <img src="https://raw.githubusercontent.com/lavague-ai/lavague/main/docs/assets/vscode-demo.gif" alt="LaVague VSCode Extension Example" style="margin-left: 0px;">
</div>

## 🔧 Pre-requisites

To use our VSCode extension you will need:

  - A version of VSCode >= 1.80
  - The Jupyter notebooks VSCode extension
  - To install a webdriver & LaVague: You can install them with the following command: `wget https://raw.githubusercontent.com/lavague-ai/LaVague/main/setup.sh && sudo bash setup.sh`

  See the LaVague installation instructions [for more details](https://docs.lavague.ai/en/latest/docs/get-started/setting-up-la-vague/)!

## 🏄‍♀️ Getting started

Let's now take a look at how to get started with the LaVague VSCode extension.

### Opening a new project

Firstly, you'll need to download the [LaVague extension from VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=LaVagueAI.lavague).

Now, you can open your first LaVague project:

- Open the VSCode Command Palette with Ctrl+Shift+P

- Type or search and find the 'LaVague: New project' command
<img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/command-2.png?raw=true" alt="open new project" width=60%>

- Next you'll be asked to input the URL of the site you wish to perform web actions on.
<img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/URL.webp?raw=true" alt="add project URL" width=60%>

### Running your instruction

We're now ready to add an instruction for the action we'd like to automate following the `%lavague-exec` magic command:

<img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/instruction.png?raw=true" alt="add instruction" width=75%>

<img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/instruction.png?raw=true" alt="add instruction" width=75%>

> Note you will need to have an OpenAI API key set in your notebook environment. If you don't have yours set in this environment, you can add the following code into a cell:

  ```
  import os
  os.environ['OPENAI_API_Key'] = ''
  ```

Your automation code will populate the next cell.

<img src="https://github.com/lavague-ai/lavague/blob/main/vscode-assets/instruction-and-code.png?raw=true" alt="generated code" width=75%>

## 🙋 Get support

You can report a bug by opening a [new issue](https://github.com/lavague-ai/lavague/issues) on our GitHub repo. We regularly track bug reports and try to respond as soon as possible!

You can also chat with us on our [Discord server](https://discord.com/invite/SDxn9KpqX9)!