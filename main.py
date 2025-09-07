from __future__ import annotations
import sys
from PySide6.QtWidgets import (
	QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
	QLineEdit, QPushButton, QLabel, QComboBox, QStatusBar
)
from PySide6.QtGui import QKeySequence
from PySide6.QtCore import Qt

from bst import BinarySearchTree
from widgets.tree_view import TreeGraphicsView
from themes import apply_modern_dark_palette, global_stylesheet


class MainWindow(QMainWindow):
	def __init__(self) -> None:
		super().__init__()
		self.setWindowTitle("Binary Search Tree Visualizer")
		self.setMinimumSize(960, 600)

		self.tree = BinarySearchTree()
		self.view = TreeGraphicsView(self.tree)

		self._build_ui()
		self._wire_actions()

	def _build_ui(self) -> None:
		container = QWidget()
		layout = QVBoxLayout(container)

		toolbar = QHBoxLayout()
		self.input_field = QLineEdit()
		self.input_field.setPlaceholderText("Enter integer value")
		self.input_field.setAccessibleName("Value input")

		self.btn_insert = QPushButton("Insert")
		self.btn_delete = QPushButton("Delete")
		self.btn_search = QPushButton("Search")
		self.btn_clear = QPushButton("Clear")

		self.combo_traverse = QComboBox()
		self.combo_traverse.addItems(["Inorder", "Preorder", "Postorder", "Levelorder"])
		self.btn_traverse = QPushButton("Traverse")

		for w in [self.btn_insert, self.btn_delete, self.btn_search, self.btn_clear, self.btn_traverse, self.combo_traverse, self.input_field]:
			w.setAccessibleName(w.__class__.__name__)

		toolbar.addWidget(QLabel("Value:"))
		toolbar.addWidget(self.input_field)
		toolbar.addWidget(self.btn_insert)
		toolbar.addWidget(self.btn_delete)
		toolbar.addWidget(self.btn_search)
		toolbar.addWidget(self.btn_clear)
		toolbar.addSpacing(20)
		toolbar.addWidget(QLabel("Traversal:"))
		toolbar.addWidget(self.combo_traverse)
		toolbar.addWidget(self.btn_traverse)
		toolbar.addStretch()

		layout.addLayout(toolbar)
		layout.addWidget(self.view)

		self.status_bar = QStatusBar()
		self.setStatusBar(self.status_bar)

		self.setCentralWidget(container)

	def _wire_actions(self) -> None:
		self.btn_insert.clicked.connect(self._on_insert)
		self.btn_delete.clicked.connect(self._on_delete)
		self.btn_search.clicked.connect(self._on_search)
		self.btn_clear.clicked.connect(self._on_clear)
		self.btn_traverse.clicked.connect(self._on_traverse)
		self.input_field.returnPressed.connect(self._on_insert)

		self.btn_insert.setShortcut(QKeySequence("Ctrl+I"))
		self.btn_delete.setShortcut(QKeySequence("Del"))
		self.btn_search.setShortcut(QKeySequence("Ctrl+F"))
		self.btn_clear.setShortcut(QKeySequence("Ctrl+L"))

	def _parse_value(self) -> int | None:
		text = self.input_field.text().strip()
		if not text:
			return None
		try:
			return int(text)
		except ValueError:
			self.status_bar.showMessage("Please enter a valid integer.", 3000)
			return None

	def _on_insert(self) -> None:
		value = self._parse_value()
		if value is None:
			return
		self.tree.insert(value)
		self.view.draw_tree()
		self.status_bar.showMessage(f"Inserted {value}")
		self.input_field.clear()

	def _on_delete(self) -> None:
		value = self._parse_value()
		if value is None:
			return
		self.tree.delete(value)
		self.view.draw_tree()
		self.status_bar.showMessage(f"Deleted {value}")
		self.input_field.clear()

	def _on_search(self) -> None:
		value = self._parse_value()
		if value is None:
			return
		found = self.tree.search(value)
		self.view.draw_tree(highlight=value if found else None)
		self.status_bar.showMessage("Found" if found else "Not found", 2000)

	def _on_traverse(self) -> None:
		mode = self.combo_traverse.currentText().lower()
		if mode == "inorder":
			seq = self.tree.inorder()
		elif mode == "preorder":
			seq = self.tree.preorder()
		elif mode == "postorder":
			seq = self.tree.postorder()
		else:
			seq = self.tree.levelorder()
		self.status_bar.showMessage(f"{mode.title()}: {seq}")

	def _on_clear(self) -> None:
		self.tree.clear()
		self.view.draw_tree()
		self.status_bar.showMessage("Cleared tree")


def main() -> None:
	app = QApplication(sys.argv)
	apply_modern_dark_palette(app)
	app.setStyleSheet(global_stylesheet())

	window = MainWindow()
	window.show()

	sys.exit(app.exec())


if __name__ == "__main__":
	main()
