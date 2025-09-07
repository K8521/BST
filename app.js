class Node {
	constructor(value) { this.value = value; this.left = null; this.right = null; }
}
class BST {
	constructor() { this.root = null; }
	insert(value) { if(this.root===null){ this.root=new Node(value); return; } let c=this.root; while(true){ if(value===c.value) return; if(value<c.value){ if(!c.left){ c.left=new Node(value); return; } c=c.left; } else { if(!c.right){ c.right=new Node(value); return; } c=c.right; } } }
	search(value){ let c=this.root; while(c){ if(value===c.value) return true; c=value<c.value?c.left:c.right; } return false; }
	delete(value){ this.root=this.#rec(this.root,value); }
	#rec(n,v){ if(!n) return null; if(v<n.value) n.left=this.#rec(n.left,v); else if(v>n.value) n.right=this.#rec(n.right,v); else { if(!n.left) return n.right; if(!n.right) return n.left; let s=this.#min(n.right); n.value=s.value; n.right=this.#rec(n.right,s.value);} return n; }
	#min(n){ while(n.left) n=n.left; return n; }
	inorder(){ const r=[]; this.#trav(this.root,n=>r.push(n.value),'in'); return r; }
	preorder(){ const r=[]; this.#trav(this.root,n=>r.push(n.value),'pre'); return r; }
	postorder(){ const r=[]; this.#trav(this.root,n=>r.push(n.value),'post'); return r; }
	levelorder(){ const r=[]; if(!this.root) return r; const q=[this.root]; while(q.length){ const n=q.shift(); r.push(n.value); if(n.left) q.push(n.left); if(n.right) q.push(n.right); } return r; }
	#trav(n,visit,ord){ if(!n) return; if(ord==='pre') visit(n); this.#trav(n.left,visit,ord); if(ord==='in') visit(n); this.#trav(n.right,visit,ord); if(ord==='post') visit(n); }
	clear(){ this.root=null; }
	count(){ let c=0; this.#trav(this.root,()=>c++,'in'); return c; }
	height(node=this.root){ if(!node) return 0; return 1+Math.max(this.height(node.left), this.height(node.right)); }
}

// Elements
const svg = document.getElementById('treeSvg');
const statusBar = document.getElementById('statusBar');
const valueInput = document.getElementById('valueInput');
const insertBtn = document.getElementById('insertBtn');
const deleteBtn = document.getElementById('deleteBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const traversalSelect = document.getElementById('traversalSelect');
const traverseBtn = document.getElementById('traverseBtn');
const animateBtn = document.getElementById('animateBtn');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const statCount = document.getElementById('statCount');
const statHeight = document.getElementById('statHeight');
const randomBtn = document.getElementById('randomBtn');
const balancedBtn = document.getElementById('balancedBtn');
const themeToggle = document.getElementById('themeToggle');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.getElementById('closeHelp');

const tree = new BST();

function updateStatus(msg, timeout=0){ statusBar.textContent=msg; if(timeout>0) setTimeout(()=>statusBar.textContent='Ready', timeout); }

function computeWidth(node){ if(!node) return 48; const l=computeWidth(node.left); const r=computeWidth(node.right); return Math.max(48, l+r); }

function ensureDefs(){
	let defs = svg.querySelector('defs');
	if(!defs){ defs = document.createElementNS('http://www.w3.org/2000/svg','defs'); svg.appendChild(defs); }
	defs.innerHTML = '';
	const nodeGrad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
	nodeGrad.id = 'nodeGradient'; nodeGrad.setAttribute('x1','0%'); nodeGrad.setAttribute('y1','0%'); nodeGrad.setAttribute('x2','0%'); nodeGrad.setAttribute('y2','100%');
	const s1 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','rgba(139,92,246,0.85)');
	const s2 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','rgba(6,182,212,0.85)');
	nodeGrad.appendChild(s1); nodeGrad.appendChild(s2);
	const nodeHi = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
	nodeHi.id = 'nodeHighlight'; nodeHi.setAttribute('x1','0%'); nodeHi.setAttribute('y1','0%'); nodeHi.setAttribute('x2','0%'); nodeHi.setAttribute('y2','100%');
	const h1 = document.createElementNS('http://www.w3.org/2000/svg','stop'); h1.setAttribute('offset','0%'); h1.setAttribute('stop-color','#8b5cf6');
	const h2 = document.createElementNS('http://www.w3.org/2000/svg','stop'); h2.setAttribute('offset','100%'); h2.setAttribute('stop-color','#06b6d4');
	nodeHi.appendChild(h1); nodeHi.appendChild(h2);
	const edgeGrad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
	edgeGrad.id='edgeGradient'; edgeGrad.setAttribute('x1','0%'); edgeGrad.setAttribute('y1','0%'); edgeGrad.setAttribute('x2','100%'); edgeGrad.setAttribute('y2','0%');
	const e1 = document.createElementNS('http://www.w3.org/2000/svg','stop'); e1.setAttribute('offset','0%'); e1.setAttribute('stop-color','#8ea0ff');
	const e2 = document.createElementNS('http://www.w3.org/2000/svg','stop'); e2.setAttribute('offset','100%'); e2.setAttribute('stop-color','#06b6d4');
	edgeGrad.appendChild(e1); edgeGrad.appendChild(e2);
	defs.appendChild(nodeGrad); defs.appendChild(nodeHi); defs.appendChild(edgeGrad);
}

function drawTree(highlight=null){
	while(svg.firstChild) svg.removeChild(svg.firstChild);
	ensureDefs();
	if(!tree.root){ updateStats(); return; }
	const totalW = computeWidth(tree.root);
	const centerX = 800;
	drawNode(tree.root, centerX, 70, totalW, highlight);
	updateStats();
}

function drawNode(node, x, y, width, highlight){
	const vSpacing = 110; const radius=24;
	if(node.left){ const lw = computeWidth(node.left); const cx = x - width/2 + lw/2; drawCurve(x, y, cx, y+vSpacing, radius); drawNode(node.left, cx, y+vSpacing, lw, highlight); }
	if(node.right){ const rw = computeWidth(node.right); const cx = x + width/2 - rw/2; drawCurve(x, y, cx, y+vSpacing, radius); drawNode(node.right, cx, y+vSpacing, rw, highlight); }
	drawVertex(x, y, node.value, highlight===node.value, radius);
}

function drawCurve(x1,y1,x2,y2,r){
	// Offset start/end points so the curve touches circle edges, not centers
	const dx = x2 - x1, dy = y2 - y1;
	const len = Math.hypot(dx, dy) || 1;
	const ux = dx / len, uy = dy / len;
	const sx = x1 + ux * r, sy = y1 + uy * r;      // start at parent circle edge
	const ex = x2 - ux * r, ey = y2 - uy * r;      // end at child circle edge
	const mx = (sx + ex) / 2, my = sy + (ey - sy) * 0.4; // control point based on trimmed points
	const d = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
	const path = document.createElementNS('http://www.w3.org/2000/svg','path');
	path.setAttribute('d', d); path.setAttribute('class','link'); path.setAttribute('fill','none');
	svg.appendChild(path);
}

function drawVertex(x,y,value,isHighlighted,r){
	const g = document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','node'+(isHighlighted?' highlight':''));
	g.setAttribute('filter','drop-shadow(0 2px 6px rgba(0,0,0,0.45))');
	const c = document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',r);
	const t = document.createElementNS('http://www.w3.org/2000/svg','text'); t.setAttribute('x',x); t.setAttribute('y',y+1); t.textContent=String(value);
	g.appendChild(c); g.appendChild(t); svg.appendChild(g);
}

function parseValue(){ const v=valueInput.value.trim(); if(v==='') return null; const n=Number(v); if(!Number.isInteger(n)) return null; return n; }

function handleInsert(){ const v=parseValue(); if(v===null){ updateStatus('Please enter a valid integer.',2000); return; } tree.insert(v); drawTree(); updateStatus(`Inserted ${v}`); valueInput.value=''; }
function handleDelete(){ const v=parseValue(); if(v===null){ updateStatus('Please enter a valid integer.',2000); return; } tree.delete(v); drawTree(); updateStatus(`Deleted ${v}`); valueInput.value=''; }
async function handleSearch(){ const v=parseValue(); if(v===null){ updateStatus('Please enter a valid integer.',2000); return; } animAbort.cancelled=true; await animatedSearch(v); }
function handleTraverse(){ const m=traversalSelect.value.toLowerCase(); let seq=[]; if(m==='inorder')seq=tree.inorder(); else if(m==='preorder')seq=tree.preorder(); else if(m==='postorder')seq=tree.postorder(); else seq=tree.levelorder(); updateStatus(`${m[0].toUpperCase()+m.slice(1)}: ${seq.join(', ')}`); }

// Animation
let animAbort={cancelled:false};
async function animatedSearch(value){
	animAbort.cancelled=false;
	let cur = tree.root;
	while(cur){
		if(animAbort.cancelled) return;
		drawTree(cur.value);
		if(cur.value===value){ updateStatus('Found',1500); return; }
		await waitMs(Number(speedRange.value));
		cur = value < cur.value ? cur.left : cur.right;
	}
	drawTree(null);
	updateStatus('Not found',1500);
}

async function animateTraversal(){ const m=traversalSelect.value.toLowerCase(); let seq=[]; if(m==='inorder')seq=tree.inorder(); else if(m==='preorder')seq=tree.preorder(); else if(m==='postorder')seq=tree.postorder(); else seq=tree.levelorder(); animAbort.cancelled=false; for(const v of seq){ if(animAbort.cancelled) break; drawTree(v); await waitMs(Number(speedRange.value)); } if(!animAbort.cancelled) updateStatus('Animation complete',1500); }
function waitMs(ms){ return new Promise(r=>setTimeout(r,ms)); }

// Random and balanced
function randomTree(n=12,min=0,max=99){ tree.clear(); for(let i=0;i<n;i++){ tree.insert(Math.floor(Math.random()*(max-min+1))+min); } drawTree(); updateStatus(`Random tree with ${n} nodes`); }
function balancedTree(n=15){ tree.clear(); const arr=Array.from({length:n},(_,i)=>i+1); (function add(a){ if(!a.length) return; const mid=Math.floor(a.length/2); tree.insert(a[mid]); add(a.slice(0,mid)); add(a.slice(mid+1)); })(arr); drawTree(); updateStatus(`Balanced tree with ${n} nodes`); }

// Stats
function updateStats(){ statCount.textContent=String(tree.count()); statHeight.textContent=String(tree.height()); }

// Theme
function applyTheme(theme){ document.documentElement.dataset.theme=theme; themeToggle.textContent = theme==='dark'?'🌙':'☀️'; localStorage.setItem('theme', theme); }
function initTheme(){ const s=localStorage.getItem('theme'); if(s) applyTheme(s); else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'); }

// Help
function openHelp(){ helpModal.setAttribute('aria-hidden','false'); closeHelp.focus(); }
function closeHelpModal(){ helpModal.setAttribute('aria-hidden','true'); helpBtn.focus(); }

// Wiring
insertBtn.addEventListener('click', handleInsert);
valueInput.addEventListener('keydown', e=>{ if(e.key==='Enter') handleInsert(); });
deleteBtn.addEventListener('click', handleDelete);
searchBtn.addEventListener('click', ()=>{ handleSearch(); });
clearBtn.addEventListener('click', ()=>{ animAbort.cancelled=true; tree.clear(); drawTree(); updateStatus('Cleared tree'); });
traverseBtn.addEventListener('click', handleTraverse);
animateBtn.addEventListener('click', ()=>{ animAbort.cancelled=true; animateTraversal(); });
speedRange.addEventListener('input', ()=>{ speedValue.textContent = `${speedRange.value} ms`; updateStatus(`Speed: ${speedRange.value}ms`,800); });
randomBtn.addEventListener('click', ()=>randomTree(12));
balancedBtn.addEventListener('click', ()=>balancedTree(15));

themeToggle.addEventListener('click', ()=>{ const cur=document.documentElement.dataset.theme||'dark'; applyTheme(cur==='dark'?'light':'dark'); });
helpBtn.addEventListener('click', openHelp);
closeHelp.addEventListener('click', closeHelpModal);
helpModal.addEventListener('click', e=>{ if(e.target===helpModal) closeHelpModal(); });
window.addEventListener('keydown', e=>{ if(e.key==='Escape' && helpModal.getAttribute('aria-hidden')==='false') closeHelpModal(); });

// keyboard shortcuts
window.addEventListener('keydown', e=>{
	if(e.ctrlKey && (e.key==='i'||e.key==='I')){ e.preventDefault(); handleInsert(); }
	if(e.key==='Delete'){ e.preventDefault(); handleDelete(); }
	if(e.ctrlKey && (e.key==='f'||e.key==='F')){ e.preventDefault(); handleSearch(); }
	if(e.ctrlKey && (e.key==='l'||e.key==='L')){ e.preventDefault(); animAbort.cancelled=true; tree.clear(); drawTree(); updateStatus('Cleared tree'); }
});

// Init
initTheme();
drawTree();
updateStatus('Ready');
speedValue.textContent = `${speedRange.value} ms`;
