from __future__ import annotations
from typing import Optional, Tuple
from PySide6.QtWidgets import QGraphicsView, QGraphicsScene, QGraphicsEllipseItem, QGraphicsTextItem
from PySide6.QtGui import QBrush, QPen, QColor
from PySide6.QtCore import QRectF, QPointF

from bst import BinarySearchTree, Node


class TreeGraphicsView(QGraphicsView):
	def __init__(self, tree: BinarySearchTree, parent=None) -> None:
		super().__init__(parent)
		self.tree = tree
		self.scene = QGraphicsScene(self)
		self.setScene(self.scene)
		self.setRenderHints(self.renderHints())
		self.setBackgroundBrush(QBrush(QColor(20, 20, 24)))
		self.node_radius = 22.0
		self.h_spacing = 36.0
		self.v_spacing = 72.0
		self.highlight_color = QColor(88, 101, 242)
		self.normal_color = QColor(240, 240, 245)
		self.edge_color = QColor(120, 120, 128)

	def sizeHint(self):
		from PySide6.QtCore import QSize
		return QSize(800, 480)

	def draw_tree(self, highlight: Optional[int] = None) -> None:
		self.scene.clear()
		if self.tree.root is None:
			return
		bounds = self._compute_subtree_bounds(self.tree.root)
		x, w = 0.0, bounds[1]
		start_x = -w / 2.0
		self._draw_node(self.tree.root, QPointF(start_x + w / 2.0, 0.0), w, highlight)
		self._fit_scene_rect()

	def _compute_subtree_bounds(self, node: Optional[Node]) -> Tuple[float, float]:
		if node is None:
			return (0.0, self.h_spacing)
		left_w = self._compute_subtree_bounds(node.left)[1]
		right_w = self._compute_subtree_bounds(node.right)[1]
		total_w = max(self.h_spacing, left_w + right_w)
		return (0.0, total_w)

	def _draw_node(self, node: Node, pos: QPointF, width: float, highlight: Optional[int]) -> None:
		if node.left:
			left_width = self._compute_subtree_bounds(node.left)[1]
			left_pos = QPointF(pos.x() - width / 2.0 + left_width / 2.0, pos.y() + self.v_spacing)
			self._draw_edge(pos, left_pos)
			self._draw_node(node.left, left_pos, left_width, highlight)
		if node.right:
			right_width = self._compute_subtree_bounds(node.right)[1]
			right_pos = QPointF(pos.x() + width / 2.0 - right_width / 2.0, pos.y() + self.v_spacing)
			self._draw_edge(pos, right_pos)
			self._draw_node(node.right, right_pos, right_width, highlight)
		self._draw_vertex(pos, node.value, highlight == node.value)

	def _draw_edge(self, a: QPointF, b: QPointF) -> None:
		pen = QPen(self.edge_color)
		pen.setWidth(2)
		self.scene.addLine(a.x(), a.y(), b.x(), b.y(), pen)

	def _draw_vertex(self, pos: QPointF, value: int, is_highlighted: bool) -> None:
		color = self.highlight_color if is_highlighted else self.normal_color
		border = QPen(QColor(70, 70, 78))
		border.setWidth(2)
		brush = QBrush(color if is_highlighted else QColor(42, 42, 48))
		ellipse = QGraphicsEllipseItem(QRectF(pos.x() - self.node_radius, pos.y() - self.node_radius, self.node_radius * 2, self.node_radius * 2))
		ellipse.setBrush(brush)
		ellipse.setPen(border)
		self.scene.addItem(ellipse)
		text = QGraphicsTextItem(str(value))
		text.setDefaultTextColor(QColor(245, 245, 250))
		text_rect = text.boundingRect()
		text.setPos(pos.x() - text_rect.width() / 2, pos.y() - text_rect.height() / 2)
		self.scene.addItem(text)

	def _fit_scene_rect(self) -> None:
		rect = self.scene.itemsBoundingRect()
		margin = 40
		rect.adjust(-margin, -margin, margin, margin)
		self.setSceneRect(rect)
		self.fitInView(rect, mode=1)
