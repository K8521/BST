# Binary Search Tree Visualizer (PySide6)

A modern, accessible GUI to interact with a Binary Search Tree: insert, delete, search, and traverse (inorder, preorder, postorder, levelorder) with a live visualization.

## Requirements
- Python 3.9+
- Windows (works cross-platform too)

## Setup
```powershell
cd "C:\Users\Karan\OneDrive\Desktop\GUI"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run
```powershell
python main.py
```

## Shortcuts
- Ctrl+I: Insert
- Delete: Delete
- Ctrl+F: Search
- Ctrl+L: Clear

## Notes
- Enter an integer and press Insert (or Enter) to add.
- Select a traversal and click Traverse to see the order in the status bar.
- Search highlights the found node in the tree.
