from __future__ import annotations
from dataclasses import dataclass
from typing import Optional, List, Callable, Deque
from collections import deque


@dataclass
class Node:
	value: int
	left: Optional["Node"] = None
	right: Optional["Node"] = None


class BinarySearchTree:
	def __init__(self) -> None:
		self.root: Optional[Node] = None

	def insert(self, value: int) -> None:
		if self.root is None:
			self.root = Node(value)
			return
		current = self.root
		while True:
			if value == current.value:
				return
			if value < current.value:
				if current.left is None:
					current.left = Node(value)
					return
				current = current.left
			else:
				if current.right is None:
					current.right = Node(value)
					return
				current = current.right

	def search(self, value: int) -> bool:
		current = self.root
		while current is not None:
			if value == current.value:
				return True
			current = current.left if value < current.value else current.right
		return False

	def delete(self, value: int) -> None:
		self.root = self._delete_rec(self.root, value)

	def _delete_rec(self, node: Optional[Node], value: int) -> Optional[Node]:
		if node is None:
			return None
		if value < node.value:
			node.left = self._delete_rec(node.left, value)
		elif value > node.value:
			node.right = self._delete_rec(node.right, value)
		else:
			if node.left is None:
				return node.right
			if node.right is None:
				return node.left
			successor = self._min_node(node.right)
			node.value = successor.value
			node.right = self._delete_rec(node.right, successor.value)
		return node

	def _min_node(self, node: Node) -> Node:
		while node.left is not None:
			node = node.left
		return node

	def inorder(self) -> List[int]:
		result: List[int] = []
		self._traverse(self.root, lambda n: result.append(n.value), order="in")
		return result

	def preorder(self) -> List[int]:
		result: List[int] = []
		self._traverse(self.root, lambda n: result.append(n.value), order="pre")
		return result

	def postorder(self) -> List[int]:
		result: List[int] = []
		self._traverse(self.root, lambda n: result.append(n.value), order="post")
		return result

	def levelorder(self) -> List[int]:
		result: List[int] = []
		if self.root is None:
			return result
		q: Deque[Node] = deque([self.root])
		while q:
			node = q.popleft()
			result.append(node.value)
			if node.left:
				q.append(node.left)
			if node.right:
				q.append(node.right)
		return result

	def _traverse(self, node: Optional[Node], visit: Callable[[Node], None], order: str = "in") -> None:
		if node is None:
			return
		if order == "pre":
			visit(node)
		self._traverse(node.left, visit, order)
		if order == "in":
			visit(node)
		self._traverse(node.right, visit, order)
		if order == "post":
			visit(node)

	def clear(self) -> None:
		self.root = None
