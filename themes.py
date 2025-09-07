from PySide6.QtGui import QPalette, QColor
from PySide6.QtCore import Qt


def apply_modern_dark_palette(app):
	palette = QPalette()
	palette.setColor(QPalette.Window, QColor(24, 24, 27))
	palette.setColor(QPalette.WindowText, Qt.white)
	palette.setColor(QPalette.Base, QColor(18, 18, 20))
	palette.setColor(QPalette.AlternateBase, QColor(32, 32, 36))
	palette.setColor(QPalette.ToolTipBase, Qt.white)
	palette.setColor(QPalette.ToolTipText, Qt.white)
	palette.setColor(QPalette.Text, Qt.white)
	palette.setColor(QPalette.Button, QColor(32, 32, 36))
	palette.setColor(QPalette.ButtonText, Qt.white)
	palette.setColor(QPalette.BrightText, Qt.red)
	palette.setColor(QPalette.Highlight, QColor(88, 101, 242))
	palette.setColor(QPalette.HighlightedText, Qt.white)
	app.setPalette(palette)


def global_stylesheet() -> str:
	return """
	QWidget { font-size: 14px; }
	QLineEdit { padding: 8px 10px; border-radius: 8px; border: 1px solid #3a3a3f; background: #1f1f23; color: #f5f5f6; }
	QPushButton { padding: 8px 12px; border-radius: 8px; background: #2a2a30; color: #f5f5f6; border: 1px solid #3a3a3f; }
	QPushButton:hover { background: #33333a; }
	QPushButton:pressed { background: #3a3a42; }
	QComboBox { padding: 8px 10px; border-radius: 8px; border: 1px solid #3a3a3f; background: #1f1f23; color: #f5f5f6; }
	QStatusBar { color: #c8c9cc; }
	"""
