/**
 * @module DataStruct
 * @description Data structures
 * @version 1.0
 * @since 1.1
 * @license MIT
 * @author Maximilian Berkmann <maxieberkmann@gmail.com>
 * @copyright Maximilian Berkmann 2016
 * @requires essence
 * @requires DOM
 * @requires Maths
 * @requires Files
 * @type {Module}
 * @exports DataStruct
 */
var DataStruct = new Module("DataStruct", "Data structures", ["DOM", "Maths", "Files"]);

(function () {
    //DataStruct.complete = true;
})();

/* eslint no-undef: 0 */

/**
 * @description Linked list
 * @param {*} [pl=1] Payload
 * @param {LinkedList} [nx={payload: 1, next: ?LinkedList}] Next
 * @param {string} name Name of the linked list
 * @returns {LinkedList} Linked list
 * @this LinkedList
 * @constructor
 * @since 1.0
 * @property {NumberLike} LinkedList.payload Payload
 * @property {LinkedList|Object} LinkedList.next Next element
 * @property {string} LinkedList.name Name
 * @property {function(this:LinkedList): string} LinkedList.show Show the linked list
 * @property {function(this:LinkedList): string} LinkedList.next.show Show the linked list
 * @property {function(): string} LinkedList.toString String representation
 */
function LinkedList (pl, nx, name) {
    this.payload = pl || 1;
    this.next = nx || {payload: 1, next: null};
    this.next.show = function () {
        return this.name + ":" + this.next.payload + "->"
    };
    this.name = name;
    this.show = function () {
        return this.name + ":" + this.payload + "->" + this.next.show()
    };

    this.toString = function () {
        return "LinkedList(" + this.show() + ")"
    };
    return this
}

/**
 * @description Binary tree node
 * @param {*} [pl=0] Payload
 * @param {TreeNode} [l] Left child
 * @param {TreeNode} [r] Right child
 * @this TreeNode
 * @returns {TreeNode} Tree node
 * @interface
 * @constructor
 * @since 1.0
 * @property {TreeNode} TreeNode.left Left child
 * @property {TreeNode} TreeNode.right Right child
 * @property {NumberLike} TreeNode.payload Payload
 * @property {function(?TreeNode, ?TreeNode)} TreeNode.add Child adder
 * @property {function(TreeNode[])} TreeNode.addLeft Left child adder
 * @property {function(TreeNode[])} TreeNode.addRight Right child adder
 * @property {function(): TreeNode} TreeNode.traverse Tree traversal
 * @property {Function} TreeNode.printInOrder Console in-order printing
 * @property {Function} TreeNode.printPreOrder Console pre-order printing
 * @property {Function} TreeNode.printPostOrder Console post-order printing
 * @property {Function} TreeNode.printInOrder Console in-order printing
 * @property {Function} TreeNode.inOrder Window in-order printing
 * @property {Function} TreeNode.preOrder Window pre-order printing
 * @property {Function} TreeNode.postOrder Window post-order printing
 * @property {function(): string} TreeNode.getInOrder In-order getter
 * @property {function(): string} TreeNode.getPreOrder Pre-order getter
 * @property {function(): string} TreeNode.getPostOrder Post-order getter
 * @property {function(): boolean} TreeNode.isLeaf Leaf check
 * @property {function(*, string): number[]} TreeNode.find Look for a tree-node
 * @property {function(*): number[]} TreeNode.dfs Depth First Search
 * @property {function(*): number[]} TreeNode.bfs Breath First Search
 * @property {Function} TreeNode.sum Sum of the payloads
 * @property {Function} TreeNode.min Smallest payload
 * @property {Function} TreeNode.max Biggest payload
 * @property {function(number): number} TreeNode.nbOfBranches Branches counter
 * @property {function(): number} TreeNode.avg Average of the payloads
 * @property {function(): string} TreeNode.printBFS Print in the BFS order
 * @property {function(): string} TreeNode.toString String representation
 * @property {function(): Array} TreeNode.toArray Array representation
 */
function TreeNode (pl, l, r) { //Binary tree
    this.left = l;
    this.right = r;
    this.payload = pl || 0;

    this.add = function (l, r) {
        this.left = l;
        this.right = r;
    };
    this.addLeft = function (childs) {
        for (var i = 0; i < childs.length; i++) {
            if (i === 0) this.left = childs[0];
            else childs[i - 1].left = childs[i];
        }
    };
    this.addRight = function (childs) {
        for (var i in childs) {
            if(childs.hasOwnProperty(i)) {
                if (i === 0) this.right = childs[0];
                else childs[i-1].right = childs[i];
            }
        }
    };
    this.traverse = function () {
        if (this.left) this.left.traverse();
        if (this.right) this.right.traverse();
        return this
    };
    //Console printing
    this.printInOrder = function () {
        if (this.left) this.left.printInOrder();
        Essence.addToPrinter(this.payload + "->");
        if (this.right) this.right.printInOrder();
        Essence.addToPrinter("\r\n");
    };
    this.printPreOrder = function () {
        Essence.addToPrinter(this.payload + "->");
        if (this.left) this.left.printPreOrder();
        if (this.right) this.right.printPreOrder();
        Essence.addToPrinter("\r\n")
    };
    this.printPostOrder = function () {
        if (this.left) this.left.printPreOrder();
        if (this.right) this.right.printPreOrder();
        Essence.addToPrinter(this.payload + "->");
        Essence.addToPrinter("\r\n")
    };
    //Window printing
    this.inOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        if (this.left) this.left.inOrder(t + s, s, d + 1, sym);
        println(t + sym + this.payload + s+" (deepth=" + d+")");
        if (this.right) this.right.inOrder(t + s, s, d + 1, sym);
    };
    this.preOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        println(t + sym + this.payload + s+" (deepth=" + d+")");
        if (this.left) this.left.preOrder(t + s, s, d + 1, sym);
        if (this.right) this.right.preOrder(t + s, s, d + 1, sym)
    };
    this.postOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        if (this.left) this.left.postOrder(t + s, s, d + 1, sym);
        if (this.right) this.right.postOrder(t + s, s, d + 1, sym);
        println(t + sym + this.payload + s+" (deepth=" + d+")")
    };

    //Getter
    this.getInOrder = function (sym) {
        if (!sym) sym = "->";
        var order = "";

        if (this.left) order += this.left.getInOrder(sym);
        order += sym + this.payload;
        if (this.right) order += this.right.getInOrder(sym);
        return order
    };
    this.getPreOrder = function (sym) {
        if (!sym) sym = "->";
        var order = "";

        order += sym + this.payload;
        if (this.left) order += this.left.getPreOrder(sym);
        if (this.right) order += this.right.getPreOrder(sym);
        return order
    };
    this.getPostOrder = function (sym) {
        if (!sym) sym = "->";
        var order = "";

        if (this.left) order += this.left.getPostOrder(sym);
        if (this.right) order += this.right.getPostOrder(sym);
        return order + sym + this.payload
    };
    this.isLeaf = function () { //Is it an end of branch ?
        return !this.left && !this.right
    };
    this.find = function (n, method) {
        return (method.normal() === "bfs")? this.bfs(n): this.dfs(n)
    };
    this.dfs = function (n) { //Depth First Search
        var d = 0, td = 0; //Depth, total depth
        var stack = [];
        stack.push(this);
        while (stack != []) {
            d = 0;
            var cur = stack.pop();
            try {
                if (cur.payload === n) return [d, td]
            } catch (e) {
                return [-1, td]
            }
            if (cur.left) stack.push(cur.left);
            if (cur.right) stack.push(cur.right);
            d++;
            td++;
        }
    };
    this.bfs = function (n) { //Breadth First Search
        var b = 0, tb = 0; //Breadth, total breadth
        var queue = [];
        queue.unshift(this); //Add as the end
        while (queue != []) {
            b = 0;
            var cur = queue.pop(); //Get the first element of the queue
            try {
                if (cur.payload === n) return [b, tb]
            } catch(e) {
                return [-1, tb]
            }
            if (cur.left) queue.unshift(cur.left);
            if (cur.right) queue.unshift(cur.right);
            b++;
            tb++;
        }
    };
    this.sum = function () {
        var s = this.payload;
        if (this.left) s += this.left.sum();
        if (this.right) s += this.right.sum();
        return s
    };
    this.min = function () {
        var m = this.payload;
        if (this.left) m = Math.min(m, this.left.min());
        if (this.right) m = Math.min(m, this.right.min());
        return m
    };
    this.max = function () {
        var m = this.payload;
        if (this.left) m = Math.max(m, this.left.max());
        if (this.right) m = Math.max(m, this.right.max());
        return m
    };
    this.nbOfBranches = function (n) {
        if (!n) n = 0;
        if (this.left) n = this.left.nbOfBranches(n + 1);
        if (this.right) n = this.right.nbOfBranches(n + 1);
        return n
    };
    this.avg = function () {
        return this.sum() / this.nbOfBranches()
    };
    this.printBFS = function (sym) {
        if (!sym) sym = "->";
        var queue = [], res = "";
        queue.unshift(this); //Add as the end
        while (queue!=[]) {
            var cur = queue.pop(); //Get the first element of the queue
            res += cur + sym;
            try {
                if (cur.left) queue.unshift(cur.left);
                if (cur.right) queue.unshift(cur.right);
            } catch(e) {
                Essence.say(e + " caused " + this + ".printBFS(" + sym + ") to go wrong", "err");
            }
        }
        return sym
    };
    this.toString = function () {
        /* Essence.txt2print = "";
         this.printInOrder();
         return "Tree(" + Essence.txt2print + ")" */
        var str = "TreeNode(payload = " + this.payload + ", ";
        if (this.left) str += "left = " + this.left.toString();
        if (this.right) str += "right = " + this.right.toString();
        return str.substring(0, str.length) + ")"
    };
    this.toArray = function (singly) {
        var arr = [];
        if (this.left) singly? arr.push(this.left.toArray().toString().split(",")): arr.push(this.left.toArray());
        arr.push(this.payload);
        if (this.right) singly? arr.push(this.right.toArray().toString().split(",")): arr.push(this.right.toArray());
        return singly? arr.toString().split(","): arr
    };

    return this;
}

/**
 * @description Node
 * @param {*} [pl=1] Payload
 * @param {Node} [nx] Next node
 * @param {Node} [pv] Previous node
 * @this Node
 * @return {Node} Node
 * @constructor
 * @since 1.0
 * @property {NumberLike} Node.payload Payload
 * @property {Node} Node.next Next node
 * @property {function(): Node} Node.traverse Node traversal
 * @property {Function} Node.print Node printer
 * @property {Function} Node.printList Node list printer
 * @property {function(): Node} Node.last Get the last node
 * @property {function(NumberLike)} Node.append Append the list with a new node
 * @property {Function} Node.remove Node remover
 * @property {function(): Node} Node.reverse List reversal
 * @property {function(NumberLike, number): Nums} Node.find Look for a node
 * @property {function(Node): boolean} Node.equals Node comparator
 * @property {function(): string} Node.toString String representation
 */
function Node (pl, nx, pv) {
    this.payload = pl || 1;
    this.next = nx; //Or new node()
    this.prev = pv;

    this.traverse = function () {
        if (this.next) this.next.traverse();
        Essence.say("payload: " + this.payload);
    };

    this.print = function () {
        if (this.next != null) this.next.print();
        Essence.print(this.payload + "=>");
    };

    this.printList = function () {
        if (this.next === null) Essence.txt2print += "->" + this.v;
        else this.next.printList();
        Essence.print("");
    };

    this.last = function () {
        if (this.next === null) return this;
        else return this.next.last()
    };

    this.append = function (n) {
        if (this.next === null) {
            this.next = new Node(n); //If there is no next node, link the new one here
            this.next.prev = this;
        } else this.next.append(n); //Else, append to next node
    };

    this.remove = function () {
        var n = this.next;
        this.next = n.next;
        n.next.prev = this;
    };

    this.reverse = function () {
        if (this.next == null) return this;
        else {
            var newHead = this.next.reverse();
            newHead.next = this;
            newHead.prev = null;
            this.prev = newHead;
            this.next = null;
            return newHead
        }
    };

    this.toString = function () {
        return "Node(payload = " + this.payload + ", previous = " + this.prev + ", next = " + this.next + ")"
    };

    this.equals = function (node) {
        return this.payload === node.payload && this.next.equals(node.next) && this.prev.equals(node.prev)
    };

    this.find = function (n, d) {
        if (!d) d = 0;
        if (this.payload === n) return d;
        if (this.next) return this.next.find(n, d + 1);
        return [-1, d]
    };
    return this;
}

/**
 * @description Path node
 * @param {number} g Total current cost
 * @param {number} h Total current heuristic
 * @returns {PathNode} Path node
 * @this PathNode
 * @constructor
 * @since 1.0
 * @property {number} PathNode.f Cost of the path (g) + heuristic estimate
 * @property {?PathNode} PathNode.parent Parent of the path-node
 * @property {function(number): PathNode} PathNode.back Go n path-nodes back
 * @property {function(PathNode): boolean} PathNode.isCloser Check if the current path-node is closer than the other one
 * @property {function(): string} Node.toString String representation
 */
function PathNode (g, h) { //Nodes for path finding algs
    this.f = g + h || 1;
    this.parent = null;

    this.back = function (n) {
        return (isNon(n) || n <= 1)? this.parent: this.parent.back(n - 1);
    };

    this.isCloser = function (pn) {
        return this.f <= pn.f;
    };

    this.toString = function () {
        return "PathNode(f=" + this.f + ", parent=" + this.parent.toString() + ")";
    };
    return this;
}

NTreeNode.inheritsFrom(TreeNode);
/**
 * @description N-ary tree node
 * @see module:DataStruct~TreeNode
 * @param {*} pl Payload
 * @param {TreeNode[]} [ch=[]] Childs
 * @returns {NTreeNode} NTreeNode
 * @this NTreeNode
 * @implements {TreeNode}
 * @constructor
 * @since 1.0
 * @property {NTreeNode[]} NTreeNode.childs Childs
 * @property {NumberLike} NTreeNode.payload Payload
 * @property {function(NTreeNode)} NTreeNode.add Child adder
 * @property {function(): NTreeNode} NTreeNode.traverse Tree traversal
 * @property {Function} NTreeNode.printInOrder Console in-order printing
 * @property {Function} NTreeNode.printPreOrder Console pre-order printing
 * @property {Function} NTreeNode.printPostOrder Console post-order printing
 * @property {Function} NTreeNode.printInOrder Console in-order printing
 * @property {function(number, string, number, string)} NTreeNode.inOrder Window in-order printing
 * @property {function(number, string, number, string)} NTreeNode.preOrder Window pre-order printing
 * @property {function(number, string, number, string)} NTreeNode.postOrder Window post-order printing
 * @property {function(): string} NTreeNode.getOrder ??-order getter
 * @property {function(): boolean} NTreeNode.isLeaf Leaf check
 * @property {function(*, string): Nums} NTreeNode.find Look for a tree-node
 * @property {function(...number): Nums} NTreeNode.dfs Depth First Search
 * @property {function(...number): Nums} NTreeNode.bfs Breath First Search
 * @property {function(): number} NTreeNode.sum Sum of the payloads
 * @property {function(): number} NTreeNode.min Smallest payload
 * @property {function(): number} NTreeNode.max Biggest payload
 * @property {function(number): number} NTreeNode.nbOfBranches Branches counter
 * @property {function(): number} NTreeNode.avg Average of the payloads
 * @property {function(string)} NTreeNode.printBFS Print in the BFS order
 * @property {function(): string} NTreeNode.toString String representation
 * @property {function(): Array} NTreeNode.toArray Array representation
 */
function NTreeNode (pl, ch) {
    this.payload = pl || 0;
    this.childs = ch || [];
    this.add = function (c) {
        this.childs.push(c);
    };
    this.traverse = function () {
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) c.traverse();
        }
        return this
    };
    //Console printing
    this.printInOrder = function () {
        for (var i = 0; i < this.childs - 1; i++) {
            this.childs[i].printInOrder();
            Essence.addToPrinter(this.payload + "->");
            this.childs[i + 1].printInOrder();
            Essence.addToPrinter("\r\n");
        }
        Essence.addToPrinter("\b");
    };
    this.printPreOrder = function () {
        for (var i = 0; i < this.childs - 1; i++) {
            Essence.addToPrinter(this.payload + "->");
            this.childs[i].printInOrder();
            this.childs[i + 1].printInOrder();
            Essence.addToPrinter("\r\n");
        }
        Essence.addToPrinter("\b");
    };
    this.printPostOrder = function () {
        for (var i = 0; i < this.childs - 1; i++) {
            this.childs[i].printInOrder();
            this.childs[i + 1].printInOrder();
            Essence.addToPrinter(this.payload + "->");
            Essence.addToPrinter("\r\n");
        }
        Essence.addToPrinter("\b");
    };
    //Window printing
    this.inOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        for (var i = 0; i < this.childs - 1; i++) {
            this.childs[i].inOrder(t + s, s, d + 1, sym);
            println(t + sym + this.payload + s + " (deepth=" + d+")");
            this.childs[i].inOrder(t + s, s, d + 1, sym);
        }
    };
    this.preOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        for (var i = 0; i < this.childs - 1; i++) {
            println(t + sym + this.payload + s + " (deepth=" + d+")");
            this.childs[i].inOrder(t + s, s, d + 1, sym);
            this.childs[i].inOrder(t + s, s, d + 1, sym);
        }
    };
    this.postOrder = function (t, s, d, sym) {
        if (!t) t = "";
        if (!s) s = "&nbsp;&nbsp;";
        if (!d) d = 0;
        if (!sym) sym = "|-";

        for (var i = 0; i < this.childs - 1; i++) {
            this.childs[i].inOrder(t + s, s, d + 1, sym);
            this.childs[i].inOrder(t + s, s, d + 1, sym);
            println(t + sym + this.payload + s + " (deepth=" + d+")");
        }
    };
    //Getter
    this.getOrder = function (sym) {
        return this.payload + (sym || "->") + this.childs.map(function (child) {
                return child.payload
            }).join(sym || "->");
    };

    this.isLeaf = function () { //Is it an end of branch ?
        return !isNon(this.childs)
    };

    this.find = function (n, method) {
        return (method.normal() === "bfs")? this.bfs(n): this.dfs(n)
    };
    this.dfs = function (n, d, td) { //Depth First Search
        if (!d) d = 0; //Depth
        if (!td) td = 0; //Total depth
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) c.dfs(n, d + 1, td++);
        }
        return [-1, td]
    };
    this.bfs = function (n, b, tb) { //Breadth First Search
        if (!b) b = 0; //Breadth
        if (!tb) tb = 0; //Total breadth
        var queue = [];
        queue.unshift(this); //Add as the end
        while (queue != []) {
            b = 0;
            var cur = new NTreeNode(queue.pop()); //Get the first element of the queue
            if (cur.payload === n) return [b, tb];
            if (cur.left) queue.unshift(cur.left);
            if (cur.right) queue.unshift(cur.right);
            b++;
            tb++;
        }
        return [-1, tb]
    };
    this.sum = function () {
        var s = this.payload;
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) s += c.payload;
        }
        return s
    };
    this.min = function () {
        var m = this.payload;
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) m = Math.min(m, c.payload);
        }
        return m
    };
    this.max = function () {
        var m = this.payload;
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) m = Math.max(m, c.payload);
        }
        return m
    };
    this.nbOfBranches = function (n) {
        if (!n) n = 0;
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) n = c.nbOfBranches(n + 1);
        }
        return n
    };
    this.avg = function () {
        return this.sum() / this.nbOfBranches()
    };
    this.printBFS = function (t) {
        var queue = [this], tab = t || "-"; //Better and easier than a Queue/QueueList
        while (!queue.isEmpty()) {
            var cur = new NTreeNode(queue.pop()); //Get the first element of the queue
            println(tab + ">" + cur.payload);
            tab += "-";
            for (var c in this.childs) {
                if (this.childs.hasOwnProperty(c)) queue.unshift(c);
            }
        }
    };
    this.toString = function () {
        /* Essence.txt2print = "";
         this.printInOrder();
         return "Tree(" + Essence.txt2print + ")" */
        var str = "NTreeNode(payload=" + this.payload + ", childs=";
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) str += c.toString();
        }
        return str.substring(0, str.length) + ")"
    };
    this.toArray = function (singly) {
        var arr = [];
        arr.push(this.payload);
        for (var c in this.childs) {
            if (this.childs.hasOwnProperty(c)) singly? arr.push(c.toArray().toString().split(",")): arr.push(c.toArray());
        }
        return singly? arr.toString().split(","): arr
    };

    return this;
}

/**
 * @description Mathematical set.<br />
 * It's depreciated in the next version (in favour of ES6) and will have the following methods instead:
 *   add(*), has(*), delete(*), size()->size, values(), clear()
 * @param {Array} [arr=[]] Array or element
 * @returns {Set} Set
 * @constructor
 * @this Set
 * @since 1.0
 * @property {number[]} Set.value Values
 * @property {function(): number} Set.size Size of the set
 * @property {function(*)} Set.add Add an item to the set
 * @property {function(*)} Set.remove Remove an item from the set
 * @property {function(number)} Set.clear Clear the set or an item of it
 * @property {function(): boolean} Set.isEmpty Check the emptiness of the set
 * @property {Function} Set.contains Check if the set contains an item (or more)
 * @property {function(Set): boolean} Set.equals Check if two sets are identical
 * @property {function(Set): boolean} Set.isSame Check if two sets contains the same values
 * @property {function(): string} Set.toString String representation
 * @property {function(...number): Array} Set.subset Subset of the set
 * @property {function(number): *} Set.get Get an item of the set
 * @property {function(*): number} Set.indexOf Index of an item in the set
 * @property {function(number, *)} Set.set Set an item's value
 * @property {function(): *} Set.first Get the first item of the set
 * @property {function(): *} Set.last Get the last item of the set
 * @property {function(...number): ?number} Set.min Smallest item of the set
 * @property {function(...number): ?number} Set.max Biggest item of the set
 * @property {function(): ?number} Set.median Median item of the set
 * @property {function(function(*))} Set.forEach Act on each items of the set
 */
function Set (arr) {
    this.value = (isType(arr, "Array")? rmDuplicates(arr): [arr]) || [];
    this.size = function () {
        return this.value.length
    };

    this.add = function (item) {
        if (isType(item, "array")) {
            for (var i = 0; i < item.length; i++) this.add(item[i]);
        }
        if (this.value.indexOf(item) === -1) this.value.push(item)
    };

    this.remove = function (item) {
        if (this.value.has(item)) {
            if (isType(item, "array")) {
                for(var i = 0; i < item.length; i++) this.remove(item[i]);
            } else this.value = this.value.remove(item)
        }
    };

    this.clear = function (index) {
        index? this.value = this.value.remove(this.value[index]): this.value = []
    };

    this.isEmpty = function () {
        return this.value.length === 0
    };

    this.contains = function (item) {
        if (isType(item, "array")) {
            var c = true;
            for (var i = 0; i < item.length; i++) {
                if (!c) return false; //Reduce the cost of the operation by not doing any unnecessary work
                c = c && this.contains(item[i]);
            }
            return c
        } else return this.value.has(item)
    };

    this.equals = function (s) {
        return this.value.toString() === s.value.toString()
    };

    this.isSame = function (s) { //Check if both sets have the same elements but not necessarily in the same order
        if (this.equals(s)) return true;
        var same = true;
        for (var i = 0; i < s.size(); i++) {
            if (!same) return false;
            same = same && this.contains(s.value[i]);
        }
        return same
    };

    this.toString = function () {
        return "Set(" + this.value.toString() + ")"
    };

    this.subset = function (s, e) {
        return this.value.slice(s, e + 1)
    };

    this.get = function (i) {
        return this.value[i]
    };

    this.indexOf = function (val) {
        return this.value.indexOf(val);
    };

    this.set = function (i, val) {
        this.value[i] = val;
    };

    this.first = function () {
        return this.value[0]
    };

    this.last = function () {
        return this.value.last()
    };

    this.min = function (s, e) {
        return this.value.min(s, e)
    };

    this.max = function (s, e) {
        return this.value.max(s, e)
    };

    this.median = function () {
        return this.value.median()
    };

    this.forEach = function (act) {
        for (var i = 0; i < this.size(); i++) act(this.get(i));
    };

    return this;
}

SortedSet.inheritsFrom(Set);
/**
 * @description Sorted mathematical set
 * @this SortedSet
 * @see module:DataStruct~Set
 * @param {Array} arr Array
 * @returns {SortedSet} Sorted set
 * @constructor
 * @inheritdoc
 * @since 1.0
 * @property {number[]} SortedSet.value Values
 * @property {function(*)} SortedSet.add Add an item to the set and sort it
 * @property {function(): string} SortedSet.toString String representation
 */
function SortedSet (arr) {
    this.value = Copy(arr).quickSort() || [];
    this.add = function (item) {
        isType(item, "array")? this.value.multiPlace(item): this.value.place(item);
        this.value = rmDuplicates(this.value);
    };

    this.toString = function () {
        return "SortedSet(" + this.value.toString() + ")"
    };

    return this;
}

/**
 * @description Stack
 * @param {Array|*} [arr] Array
 * @param {?number} [lim=null] Limit
 * @returns {Stack} Stack
 * @this Stack
 * @constructor
 * @since 1.0
 * @property {number[]} Stack.value Values
 * @property {?number} Stack.limit Limit
 * @property {function(): *} Stack.peek Returns the top value
 * @property {function(): *} Stack.ground Returns the bottom value
 * @property {function(*)} Stack.push Add items at the top
 * @property {function(): *} Stack.pop Remove the top item
 * @property {function(): boolean} Stack.isEmpty Emptiness check
 * @property {function(): boolean} Stack.isFull Fullness check
 * @property {function(): number} Stack.size Size
 * @property {function(): string} Stack.toString String representation
 */
function Stack (arr, lim) {
    this.value = isType(lim, "Number")? new Array(lim): [];
    this.limit = lim || null;
    if (arr) this.value.push(arr);

    this.peek = function () {
        return this.value.last()
    };

    this.ground = function () {
        return this.value[0]
    };

    /**
     * @throws {Error} Stack overflow
     * @param {*} item Item
     */
    this.push = function (item) {
        if (this.isFull()) throw new Error("Stack overflow !");
        isType(item, "array")? this.value.append(item): this.value.push(item);
    };

    /**
     * @throws {Error} Stack underflow
     * @return {*} Item
     */
    this.pop = function () {
        if (this.isEmpty()) throw new Error("Stack underflow !");
        return this.value.pop();
    };

    this.isEmpty = function () {
        return this.value.length === 0
    };

    this.isFull = function () {
        return this.limit != null? this.value.length >= this.limit: false
    };

    this.size = function () {
        return this.value.length
    };

    this.toString = function () {
        return "Stack(" + this.value.toString() + ")"
    };

    return this;
}

/**
 * @description Stack array
 * @param {number} sz Array size
 * @returns {StackArray} Stack array
 * @this StackArray
 * @constructor
 * @since 1.0
 * @property {number[]} StackArray.value Values
 * @property {number} StackArray.top Top index
 * @property {function(): *} StackArray.peek Returns the top value
 * @property {function(): *} StackArray.ground Returns the bottom value
 * @property {function(*)} StackArray.push Add items at the top
 * @property {function(): *} StackArray.pop Remove the top item
 * @property {function(): boolean} StackArray.isEmpty Emptiness check
 * @property {function(): boolean} StackArray.isFull Fullness check
 * @property {function(): number} StackArray.size Size
 * @property {function(): string} StackArray.toString String representation
 * @see module:DataStruct~Stack
 */
function StackArray (sz) {
    this.value = new Array(sz);
    /** @default */
    this.top = -1;

    this.peek = function () {
        return this.value[this.top]
    };

    this.ground = function () {
        return this.value[0];
    };

    /**
     * @throws {Error} Stack overflow
     * @param {*} item Item
     */
    this.push = function (item) {
        if (this.isFull()) throw new Error("Stack overflow !");
        if (isType(item, "array")) {
            for(var i = 0; i < item.length; i++) this.push(item[i]);
        } else {
            this.top++;
            this.value[this.top] = item;
        }
    };

    /**
     * @throws {Error} Stack underflow
     * @param {*} item Item
     * @returns {*} Item
     */
    this.pop = function (item) {
        if (this.isEmpty()) throw new Error("Stack underflow !");
        if (isType(item, "array")) {
            for(var i = 0; i < item.length; i++) this.pop(item[i]);
        } else {
            var el = this.peek();
            this.top--;
            return el
        }
    };

    this.isEmpty = function () {
        return this.top <= -1
    };

    this.isFull = function () {
        return this.top >= this.value.length
    };

    this.size = function () {
        return this.top + 1
    };

    this.toString = function () {
        return "Stack(" + this.value.toString() + ")"
    };

    return this;
}

/**
 * @description Stack list
 * @param {Array|*} [arr] Array or payloads
 * @returns {StackList} Stack list
 * @this StackList
 * @constructor
 * @since 1.0
 * @property {number[]} StackList.top Top node
 * @property {function(): *} StackList.peek Returns the top value
 * @property {function(): *} StackList.ground Returns the bottom value
 * @property {function(*)} StackList.push Add items at the top
 * @property {function(): *} StackList.pop Remove the top item
 * @property {function(): boolean} StackList.isEmpty Emptiness check
 * @property {function(): boolean} StackList.isFull Fullness check
 * @property {function(): number} StackList.size Size
 * @property {function(): string} StackList.toString String representation
 * @see module:DataStruct~Stack
 */
function StackList (arr) {
    this.top = new Node();

    this.peek = function () {
        return (this.isEmpty() || this.top === null)? null: this.top.next.payload
    };

    this.ground = function () {
        return this.top.payload;
    };

    this.push = function (item) {
        if (isType(item, "array")) {
            for(var i = 0; i < item.length; i++) this.push(item[i]);
        } else {
            var n = new Node(item, this.top);
            this.top = n;
        }
        return this
    };
    if (arr) this.push(arr);

    /**
     * @throws {Error} Stack underflow
     * @param {number} [n] Number of pops to do
     * @returns {Node} Item
     */
    this.pop = function (n) {
        if (!this.isEmpty()) throw new Error("I can't pop from an empty stack list");
        if (n) {
            for(var i = 0; i < n; i++) this.pop();
        } else {
            var el = this.top.payload;
            this.top = this.top.next;
            return el
        }
    };

    this.isEmpty = function () {
        return this.top == null
    };

    this.size = function (n) {
        return this.top != null? this.size(n + 1): n
    };

    return this;
}

/**
 * @description Queue
 * @param {Array|*} [arr] Array or element
 * @param {?number} [lim=null] Limit
 * @returns {Queue} Queue
 * @this Queue
 * @constructor
 * @since 1.0
 * @property {number[]} Queue.value Values
 * @property {?number} Queue.limit Limit
 * @property {function(): *} Queue.head Returns the first value
 * @property {function(): *} Queue.tail Returns the last value
 * @property {function(*)} Queue.enqueue Add items at the end
 * @property {function(): *} Queue.dequeue Remove the first item
 * @property {function(): boolean} Queue.isEmpty Emptiness check
 * @property {function(): boolean} Queue.isFull Fullness check
 * @property {function(): number} Queue.size Size
 * @property {function(): string} Queue.toString String representation
 */
function Queue (arr, lim) {
    this.value = isType(lim, "Number")? new Array(lim): [];
    this.limit = lim || null;
    if (arr) this.value.push(arr);

    /**
     * @throws {Error} Queue overflow
     * @param {*} item Item
     */
    this.enqueue = function (item) {
        if (this.isFull()) throw new Error("Queue overflow !");
        isType(item, "array")? this.value.prepend(item): this.value.unshift(item);
    };

    /**
     * @throws {Error} Queue undeflow
     * @returns {*} Item
     */
    this.dequeue = function () {
        if (this.isEmpty()) throw new Error("Queue underflow !");
        var it = this.head();
        this.value.pop();
        return it
    };

    this.head = function () {
        return this.value.last()
    };

    this.tail = function () {
        return this.value[0]
    };

    this.isEmpty = function () {
        return this.value.length === 0
    };

    this.isFull = function () {
        return this.limit != null? this.value.length >= this.limit: false
    };

    this.size = function () {
        return this.value.length
    };

    this.toString = function () {
        return "Queue(head=" + this.head() + ", tail=" + this.tail() + ", value=" + this.value.toString() + ")"
    };

    return this;
}

/**
 * @description Queue array
 * @param {Array|*} [arr=[]] Array or element
 * @returns {QueueArray} QueueArray
 * @this QueueArray
 * @constructor
 * @since 1.1
 * @see module:DataStruct~Queue
 * @property {number[]} QueueArray.value Values
 * @property {number} QueueArray.front Front index
 * @property {number} QueueArray.back Back index
 * @property {function(): *} QueueArray.head Returns the first value
 * @property {function(): *} QueueArray.tail Returns the last value
 * @property {function(*)} QueueArray.enqueue Add items at the end
 * @property {function(): *} QueueArray.dequeue Remove the first item
 * @property {function(): boolean} QueueArray.isEmpty Emptiness check
 * @property {function(): boolean} QueueArray.isFull Fullness check
 * @property {function(): number} QueueArray.size Size
 * @property {function(): string} QueueArray.toString String representation
 */
function QueueArray (arr) {
    /** @default */
    this.value = arr || [];
    /** @default */
    this.front = -1;
    /** @default */
    this.back = -1;

    /**
     * @throws {Error} Queue full
     * @param {*} item Item
     */
    this.enqueue = function (item) {
        if (isType(item, "array")) {
            for(var i = 0; i < item.length; i++) this.enqueue(item[i]);
        } else {
            if (this.isFull()) throw new Error("The queue is full");
            if (this.isEmpty()) {
                this.front++;
                this.back++;
                this.value[this.back] = item;
            } else {
                this.back = (this.back + 1) % this.value.length;
                this.value[this.back] = item;
            }
        }
    };

    /**
     * @throws {Error} Queue empty
     * @returns {*}
     */
    this.dequeue = function () {
        var val;
        if (this.isEmpty()) throw new Error("I can't dequeue from an empty queue");
        if (this.front === this.back) {
            val = this.value[this.front];
            this.front = this.back = -1;
        }else {
            val = this.value[this.front];
            this.front = (this.front + 1) % this.value.length;
        }
        return val
    };

    this.isEmpty = function () {
        return this.front === -1 && this.back === -1
    };

    this.isFull = function () {
        return this.back>(this.front + 1) % this.value.length
    };

    this.size = function () {
        return this.value.length
    };

    this.toString = function () {
        return "Queue(front=" + this.front + ", back=" + this.back + ", value=" + this.value.toString() + ")"
    };

    return this;
}

/**
 * @description Queue list
 * @this QueueList
 * @returns {QueueList} QueueList
 * @todo Probably add the pre-init similar to StackList() ?
 * @constructor
 * @since 1.0
 * @property {number[]} QueueList.value Values
 * @property {?Node} QueueList.front Front node
 * @property {?Node} QueueList.back Back node
 * @property {number} QueueList.len Length of the list
 * @property {function(): *} QueueList.head Returns the first value
 * @property {function(): *} QueueList.tail Returns the last value
 * @property {function(*)} QueueList.enqueue Add items at the end
 * @property {function(): *} QueueList.dequeue Remove the first item
 * @property {function(): boolean} QueueList.isEmpty Emptiness check
 * @property {function(): boolean} QueueList.isFull Fullness check
 * @property {function(): number} QueueList.size Size
 * @property {function(): string} QueueList.toString String representation
 * @property {function(*)} QueueList.remove Node removal
 * @property {function(number, *)} QueueList.insertAt Positional node insertion
 */
function QueueList () {
    this.front = null;
    this.back = null;
    this.len = 0;

    this.enqueue = function (item) {
        if (isType(item, "array")) {
            for(var i = 0; i < item.length; i++) this.enqueue(item[i]);
        } else {
            var n = this.back != null? new Node(item, this.back, null): new Node(item);
            if (this.back.prev != null) this.back.prev = n;
            this.back = n;
            this.len++;
        }
        return this
    };

    /**
     * @throws {Error} Queue underflow
     * @returns {?Node}
     */
    this.dequeue = function () {
        if (this.isEmpty()) throw new Error("I can't dequeue an empty queue list");
        this.front = this.front.prev;
        this.len--;
        return this.front
    };

    this.isEmpty = function () {
        return this.len === 0 || this.back === null
    };

    this.size = function () {
        return this.len
    };

    this.toString = function () {
        var str = "", crt = this.front;
        while (crt != null) {
            str += "<-"+ crt.payload;
            crt = crt.prev;
        }
        return str
    };

    this.remove = function (pl) {
        var crt = this.front;
        while (crt != null) {
            if (crt.payload != null && (crt.payload == pl || crt.payload.equals(pl))) crt = null;
            crt = crt.next;
        }
    };

    this.insertAt = function (i, pl) {
        this.back.next = new Node(pl);
        if (i === 0) this.front = new Node(pl);
        else if (i === this.len) this.back = new Node(pl);
        else if (i > this.len) this.enqueue(pl);
    };

    return this;
}

/**
 * @description A* path finding algorithm inspired from {@link http://Heyes-jones.com/pseudocode.php|this pseudo-code}
 * @todo Make sure it works properly
 * @param {PathNode} start Starting node
 * @param {PathNode} goal Ending node
 * @returns {undefined}
 * @since 1.0
 * @func
 */
function Astar (start, goal) {
    //PathNode.f (score) = g (sum of all cost to get at this point) + h (heuristic: estimate of what it will take to get the goal)
    var nodeGoal = goal, nodeCurrent, nodeSuccessor, _h;
    var openList = [start], closedList = [];
    while (openList.length > 0) {
        var scores = [], minScore = openList[0].f;
        for (var i in openList) {
            if (openList.hasOwnProperty(i)) {
                scores.push(openList[i].f);
                minScore = Math.min(minScore, openList[i].f);
            }
        }
        nodeCurrent = openList.filter(function (x) {
            if (x.f === minScore) return x
        })[0];
        openList = openList.filter(function (x) {
            if (x.f != minScore) return x
        });
        if (nodeCurrent === nodeGoal) {
            //Generate each states nodeSucessor that can come after nodeCurrent
            for (nodeSucessor in nodeCurrent) {
                if (nodeCurrent.hasOwnProperty(nodeSuccessor)) {
                    nodeSuccessor.f = nodeCurrent.f + h(nodeSuccessor, nodeCurrent);
                    var l = lookfor(nodeSuccessor, openList);
                    if (l != -1) {
                        l = l[0];
                        //If the current node is better then continue
                        if (nodeCurrent.f < openList[l] || (lookfor(nodeSuccessor, closedList) != -1 && nodeCurrent.f < openList[lookfor(nodeSuccessor, closedList)][0].f)) continue;
                        openList = openList.remove(nodeSuccessor);
                        closedList = closedList.remove(nodeSuccessor);
                        nodeSuccessor.parent = nodeCurrent;
                        _h = h(nodeSuccessor, nodeGoal);
                        openList.push(nodeSuccessor);
                    }
                    closedList.push(nodeCurrent);
                }
            }
            throw "Solution found ! With h=" + _h;
        }
    }
}

/**
 * @description A* algorithm v2.<br />
 * JS version of: {@link https://en.wikipedia.org/wiki/A*_search_algorithm}
 * @param {number[]} start Starting node
 * @param {number[]} goal Ending node
 * @param {Array} grid Grid
 * @returns {?Array}
 * @since 1.0
 * @func
 */
function A(start, goal, grid) {
    var closedSet = [], openSet = [start], cameFrom = [], gScore = [0], fScore = [euclidianDist(start, goal)];

    while (openSet.length > 0) {
        var current = openSet[fScore.indexOf(fScore.min())];
        if (current === goal) return reconPath(cameFrom, current, grid);
        openSet = openSet.remove(current);
        closedSet.push(current);
        var n = grid.neighbour(current[0], current[1]);
        Essence.say("neighbour of " + current + ":\n" + n.toStr(true), "info");
        for (var i = 0; i < n; i++) {
            if (closedSet.has(n[i])) continue;
            var tentativeGScore = gScore[closedSet.indexOf(current)] + 1;
            if (closedSet.indexOf(n[i]) === -1) openSet.push(n[i]);
            else if (tentativeGScore >= gScore[i]) break;
        }

        cameFrom[i] = current;
        gScore[i] = tentativeGScore;
        fScore[i] = gScore[i] + euclidianDist(n[i], goal);
    }
}

/**
 * @description Path reconstructor
 * @param {Array} cameFrom List of visited nodes
 * @param {Array} current Current node
 * @param {Array} grid Grid
 * @returns {Array} Reconstructed path
 * @since 1.0
 * @func
 */
function reconPath(cameFrom, current, grid) {
    var totalPath = [current];
    while (current in keyList(cameFrom)) {
        current = cameFrom[grid.lookFor(current)];
        totalPath.append(current);
    }
    return totalPath;
}

/**
 * @description Iterative Depending A* path finding algorithm
 * @returns {undefined}
 * @since 1.0
 * @func
 * @see module:DataStruct~Astar
 * @todo Do it !
 */
function IDAstar () {

}

/**
 * @description Sort alphabetically an string|array
 * @param {string|Array} x String|array to alphabetically sort
 * @returns {string|Array} Sorted string|array
 * @since 1.0
 * @func
 * @throws {TypeError} x isn't iterable
 */
function alphabetSort (x) {
    if (!x.isIterable()) throw new TypeError("alphabetSort cannot sort non iterable objects");
    if (isType(x, "String")) return x.split("").quickSort().join("");

    var res = x.uniform(), s = true, j = 1;
    while (s) {
        s = false;
        for (var k = 0; k < res.maxLength(); k++) {
            for (var i = 0; i < res.length - j; i++) {
                if (k == 0 && res[i].charAt(k) > res[i + 1].charAt(k)) { //Sort the by the first letter
                    swap(res, i, i + 1);
                    s = true;
                } else if (res[i].charAt(k - 1) === res[i + 1].charAt(k - 1) && res[i].charAt(k) > res[i + 1].charAt(k)) {
                    swap(res, i, i + 1);
                    s = true;
                }
            }
            j++;
        }
    }
    return res.trimAll("r")
}

/**
 * @description Sort the array from the most occurring items to the least occurring ones
 * @param {Array} arr Array to sort
 * @returns {Array} Sorted array <i>(by occurrence obviously)</i>
 * @func
 * @since 1.1
 */
function occurrenceSort (arr) {
    var counts = arr.map(function (x) {
        return arr.count(x);
    }), vals = rmDuplicates(arr);
    var lookup = new Map(counts), res = []; //Tablify(counts, vals);
    vals.map(function (x) {
        lookup.add(arr.count(x), x);
    });
    //lookup.forEach(function (x, i) { console.log(lookup.keys.get(i), x.toStr(true)); }, true)
    lookup.forEach(function (x) {
        res.prepend(x);
    }, true);
    return res;
}

/**
 * @description Find if x is in the list
 * @param {Array} list List
 * @param {*} x Element/term to find
 * @returns {boolean} Found or not
 * @since 1.0
 * @todo Make it right
 * @func
 */
function binarySearch (list, x) {
    list.quickSort();
    var i = 2, term = list[Math.floor(list.length / i)], l = 0;
    while (term != x && i < list.length) {
        if (term === x) return true;
        else {
            i *= 2;
            term = term < x? list[Math.floor(list.length / i)]: list[3 * Math.floor(list.length / i)];
        }
        if (debugging) Essence.say("i=" + i + "\nterm=" + term + "\nloops=" + l);
        l++;
    }
    return term === x
}

/**
 * @description Binary search.<br />
 * Source: {@link https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/implementing-binary-search-of-an-array|KhanAcademy}
 * @param {number[]} arr Array
 * @param {NumberLike} target Target of the search
 * @return {number}
 */
function search (arr, target) {
    var min = 0, max = arr.length - 1, guess = Math.floor((max - min) / 2);
    if (arr[guess] === target) return guess;
    while (arr[guess] != target) {
        if (max < min) return -1;
        (arr[guess] < target)? min = guess + 1: max = guess - 1;
        guess = Math.floor((max - min) / 2);
    }
}

/**
 * @description Compressed data using Huffman's approach while differentiating uppercase from lowercase letters
 * @param {string} [name="Archive"] Name of the archive
 * @param {string} [data=""] Data to compress
 * @returns {Archive} Archive
 * @constructor
 * @this {Archive}
 * @since 1.0
 * @property {string} Archive.name Name of the archive
 * @property {string} Archive.data Data to compress
 * @property {string[]} Archive.dictionary Dictionary (values formatted as: letter=bitcode)
 * @property {Function} Archive.updateDict Update the dictionary
 * @property {function(): Str} Archive.getResult Get the result
 */
function Archive (name, data) {
    this.name = name || "Archive";
    this.data = data || "";
    this.dictionary = [];
    this.result = [];
    this.updateDict = function () {
        var lexiq = [], count, tmp = alphabetSort(data);
        for (var i = 0; i < this.data.length - 1; i++) {
            if (tmp[i] != tmp[i+ 1]) lexiq.push(tmp[i]);
        }
        lexiq = rmDuplicates(lexiq);
        //lexiq.debug();
        //console.log(lexiq.getOccurrences());
        count = new Array(lexiq.length);
        tmp = [];
        for (i = 0; i < lexiq.length; i++) {
            count[i] = data.count(lexiq[i]);
            //Essence.say("lexiq[" + i + "]=" + lexiq[i] + " is present " + timesLiteral(count[i]), "inf");
            tmp[i] = lexiq[i] + count[i];
        }
        //Essence.say("Lexiq of " + this.name + ": " + lexiq + "\ncounts: " + count);

        this.dictionary = occurrenceSort(this.data);

        for (i = 0; i < this.dictionary.length; i++) this.result[i] = conv(i, 10, 2);
    };

    this.getResult = function () {
        this.updateDict();
        var res = this.data;
        for (var i = 0; i < this.data.length; i++) {
            console.log(i + "// " + this.dictionary[this.dictionary.indexOf(this.data[i])]);
            res = res.replace(RegExpify(this.dictionary[this.dictionary.indexOf(this.data[i])]), this.result[i]);
        }

        return res;
    };
    return this
}

/**
 * @description State history allowing undos and redos on the element while keeping track of the previous and following states
 * @param {*} elm Element
 * @this {virtualHistory}
 * @constructor
 * @returns {virtualHistory} Virtual history
 * @since 1.0
 * @property {*} virtualHistory.src Source
 * @property {*} virtualHistory.DEFAULT_STATE Default state of the source
 * @property {number} virtualHistory.state State number
 * @property {Function} virtualHistory.reset Reset the current state
 * @property {function(*)} virtualHistory.update Update the current state if needed
 * @property {function(*)} virtualHistory.add Add the new state to the list
 * @property {function(number): *} virtualHistory.get Get the i-th state
 * @property {Function} virtualHistory.undo Go the the previous state
 * @property {Function} virtualHistory.redo Go the following state
 * @property {function(): string} virtualHistory.getStates List the states
 * @property {*} virtualHistory.isStateDefault Check if the current state is the default one
 */
function virtualHistory (elm) {
    this.src = elm;
    this.DEFAULT_STATE = elm;
    this.states = new Set(this.src);
    this.state = 0;

    this.reset = function () {
        this.src = this.DEFAULT_STATE;
    };

    this.update = function (elm) {
        if (this.src != elm) this.add(elm);
    };

    this.add = function (val) { //Add a state
        if (isType(val, "array")) {
            for (var i = 0; i < val.length; i++) this.add(val[i]);
        } else {
            this.src = val;
            this.states.add(this.src);
            this.state++;
        }
    };

    this.get = function (i) {
        return this.states.get(i)
    };

    /**
     * @throws {Error} Set underflow
     */
    this.undo = function () {
        if (this.state === 0) throw new Error("Set underflow, it's not possible to undo to a non-existent state.");
        this.state--;
        this.src = this.get(this.state);
    };

    /**
     * @throws {Error} Set overflow
     */
    this.redo = function () {
        if (this.state === (this.states.size() - 1)) throw new Error("Set overflow, it's not possible to redo to a non-existent state.");
        this.state++;
        this.src = this.get(this.state);
    };

    this.getStates = function () {
        return this.states.toString()
    };

    this.isStateDefault = function () { //Check if the current state is the default
        return this.src === this.DEFAULT_STATE
    };

    return this;
}

/**
 * @description Get the occurrence list
 * @param {string} list String
 * @returns {{}} Occurring object list
 * @since 1.0
 * @throws {TypeError} list must be iterable
 */
function occurrenceList (list) {
    if (!list.isIterable()) throw new TypeError("It must be an iterable object !");
    var nums = list.getOccurrences(true), chars = [], oc = list.getOccurrences(), res = {};
    for (var i = 0; i < oc.length; i++) chars[i] = oc[i].split(":")[0];
    for (i = 0; i < nums.length; i++) res[chars[i]] = nums[i];
    return res;
}

/**
 * @description Stream
 * @param {number} [initVal=0] Initial value
 * @param {string} [formula="x + 1"] Formula
 * @param {number} [nbVals] Number of values
 * @this {Stream}
 * @returns {Stream} Stream
 * @constructor
 * @since 1.0
 * @property {number} Stream.start Initial value
 * @property {string} Stream.formula Formula
 * @property {number[]} Stream.data Data
 * @property {Function} Stream.next Add an other value to the data
 * @property {function(): string} Stream.toString String representation
 */
function Stream (initVal, formula, nbVals) {
    this.start = initVal || 0;
    this.formula = formula || "x + 1";
    this.data = [this.start];

    this.next = function () { //use PEG.js to solve the issue ?
        this.data.push(eval(this.formula.multiReplace([
            [/x/g, this.data.last()], [/x0/g, this.start],
            [/pi/ig, Math.PI], [/e/ig, Math.E], [/sqrt(2)/ig, Math.SQRT2],
            [/(pow|max|min)\((.*?),(| )(.*?)\)/, "Math.$1($2, $3)"],
            [/(sqrt|cbrt|cos|sin|tan|acos|asin|cosh|sinh|tanh|acosh|asinh|atanh|exp|abs)\((.*?)\)/, "Math.$1($2)"],
            [/(ln|log|nthroot|clampTop|clampBottom)\((.*?),(| )(.*?)\)/, "$1($2, $3)"],
            [/(clamp)\((.*?),(?:| )(.*?),(?:| )(.*?)\)/, "$1($2, $3, $4)"]
        ])));
    };

    if (nbVals) {
        for (var i = 1; i < nbVals; i++) this.next();
    }

    this.toString = function () {
        return "Stream(start=" + this.start + ", formula=" + this.formula + ", data=" + this.data.toStr(true) + ")";
    };

    return this;
}

/**
 * @description Stream with multiple variables
 * @param {number} [initVal=0] Initial value
 * @param {string} [formula="x + y"] Formula
 * @param {number} [nbVals] Number of values
 * @returns {MultiStream} Multi-variable stream
 * @this {MultiStream}
 * @constructor
 * @since 1.0
 * @property {number} MultiStream.start Initial value
 * @property {string} MultiStream.formula Formula
 * @property {number[]} MultiStream.results Results
 * @property {number[]} MultiStream.data Data
 * @property {Function} MultiStream.next Add an other value to the data
 * @property {function(): string} MultiStream.toString String representation
 * @property {function(NumberLike): number} MultiStream.compute Compute a value
 */
function MultiStream (initVal, formula, nbVals) {
    this.start = initVal || 0;
    this.formula = formula || "x + y";
    this.data = [this.start];
    this.results = [];

    this.next = function () { //use PEG.js to solve the issue ?
        this.data.push(this.data.last().map(function (x) {
            return x + 1;
        }));
        this.results.push(this.compute(this.data.last()));
    };

    this.compute = function (data) { //Turn an expression into a number
        return eval(this.formula.multiReplace([
            [/x/g, data[0]], [/x0/g, this.start[0]],
            [/y/g, data[1]], [/y0/g, this.start[1]],
            [/z/g, data[2]], [/z0/g, this.start[2]],
            [/pi/ig, Math.PI], [/e/ig, Math.E], [/sqrt(2)/ig, Math.SQRT2],
            [/(pow|max|min)\((.*?),(| )(.*?)\)/, "Math.$1($2, $3)"], //fails on first occurrence
            [/(sqrt|cbrt|cos|sin|tan|acos|asin|cosh|sinh|tanh|acosh|asinh|atanh|exp|abs|e\^)\((.*?)\)/, "Math.$1($2)"],
            [/(ln|log|nthroot|clampTop|clampBottom)\((.*?),(| )(.*?)\)/, "$1($2, $3)"],
            [/(clamp)\((.*?),(| )(.*?),(| )(.*?)\)/, "$1($2, $3, $4)"]
        ]))
    };

    this.results = [this.compute(this.start)];

    if (nbVals > 1) {
        for (var i = 1; i < nbVals; i++) this.next();
    }

    this.toString = function () {
        return "MultiStream(start=" + this.start.toStr(true) + ", formula=" + this.formula + ", data=" + this.data.toStr(true) + ", results=" + this.results.toStr(true) + ")";
    };

    return this;
}

/**
 * @description Numerical graph
 * @param {string} formula Formula
 * @param {number[]} [dims=[50, 50]] Dimensions
 * @param {string[]} [lbls=["x", "y"]] Axis labels
 * @param {string} [name="Graph"] Name
 * @param {number} precision Precision
 * @returns {Graph} Numerical graph
 * @this {Graph}
 * @constructor
 * @since 1.0
 * @property {string[]} Graph.labels Labels
 * @property {string} Graph.name Name
 * @property {number[]} Graph.dimension Dimension
 * @property {Equation} Graph.equation Name
 * @property {number[]} Graph.data Data
 * @property {function(): string} Graph.toString String representation
 */
function Graph (formula, dims, lbls, name, precision) { //N-dimensional graph
    this.labels = lbls || ["x", "y"];
    this.name = name || "Graph";
    this.dimension = dims || new Array(this.labels.length).fill(50);
    this.equation = new Equation(formula); //y=...
    // this.stream = new Stream(0, this.formula.split("=")[1], this.dimension[0]);
    this.data = precision? range(0, precision, this.dimension[0], (Number(precision)).length()[1]): range(this.dimension[0]);
    for (var i = 0; i < this.data.length; i++) this.data[i] = [this.data[i], this.equation.compute({x: this.data[i]})];

    this.toString = function () {
        return "Graph(name=" + this.name + ", labels=" + this.labels.toStr(true) + ", dimension=" + this.dimension + ", this.equation=" + this.equation.toString() + ", data=" + this.data + ")";
    };

    return this;
}

/**
 * @description Generate an array with all permutations of <code>data</code> in a 1x(<code>data</code>.length!) array.
 * @param {Str} data Data
 * @return {Array} Permutations
 * @since 1.1
 * @func
 */
function Perm (data) {
    if (data.length <= 1) return data;
    else if (data.length === 2) return [data, Copy(data).reverse()];
    else if (data.length === 3) return Perm(data.get(1)).map(function (x) {
            return data[0] + x;
        }).append(Perm(data.get(-1)).map(function (x) {
            return data.last() + x;
        })).append(Perm(data.remove(data[1])).map(function (x) {
            return data[1] + x;
        }));
    else {
        var perm = Perm(data.get(1)).map(function (x) {
            return data[0] + x;
        });
        for (var i = 1; i < data.length; i++) {
            perm.append(Perm(data.remove(data[i])).map(function (x) {
                return data[i] + x;
            }));
        }
        return rmDuplicates(perm);
    }
}

/**
 * @description Get the combinations of the <code>n*<code>set</code>
 * @param {number} n Length of each terms
 * @param {string[]} set Set of words
 * @return {Str} Combinations
 * @since 1.1
 * @func
 * @todo Make it work right
 */
function Comb (n, set) {
    var res = new Array(n * factorial(set.length)), p = Perm(set.join("")), lIdx = set.lastIndex();
    for (var i = 0; i < set.length * 2; i += 2) {
        if (i > lIdx + 1) break;
        set.splice(i + 1, set.binaryIndexOf(set[i]), set[i].repeat(n));
    }
    p.append(complement(set, p));
    console.log(res.length, p, "\nset=" + set);

    return alphabetSort(p);
}

/**
 * @description Event-trace table
 * @param {string} [name="Event table"] Name
 * @param {string[]} [srcs=[getFilename(true)]] Sources
 * @returns {EventTable} Event table
 * @constructor
 * @this {EventTable}
 * @since 1.0
 * @property {string} EventTable.name Name
 * @property {string[]} EventTable.sources Sources
 * @property {Array[]} EventTable.table Event table
 * @property {function(number, number)} EventTable.make Make the table
 * @property {function(string, string)} EventTable.fill Fill in the table
 * @property {function(): Array[]} EventTable.getCleanTable Get a clean empty-cell-less table
 * @property {function(Date): string} EventTable.loookAt Look at what happened at a particular time
 */
function EventTable (name, srcs) {
    this.name = name ||"Event table";
    this.sources = srcs || [getFilename(true)];
    this.table = [["Source", "Event", "Timestamp"]];
    this.add = function (evt) {
        this.table.push([evt.source || getFilename(true), evt.event, evt.timestamp || (new Date()).getTime()]);
        this.sources.uniquePush(evt.source || getFilename(true));
    };

    this.make = function (nb, space) {
        var ts = (new Date()).getTime();
        if(!space) space = 1;
        for (var i = 0; i < (nb || 1e3); i += space) {
            this.add({
                timestamp: ts + i
            });
        }
    };

    this.fill = function (src, desc) {
        var ts = (new Date()).getTime();
        var pos = lookfor(ts, this.table);
        if (pos === -1 && ts > this.table.last()[2]) this.add({source: src, event: desc, timestamp: ts});
        else {
            this.table[pos[0]][0] = src;
            this.table[pos[0]][1] = desc;
        }
    };

    this.getCleanTable = function () {
        var table = [];
        for (var i = 0; i < this.table.length; i++) {
            if (!isNon(this.table[i][1])) table.push(this.table[i]);
        }

        return table;
    };

    this.lookAt = function (ts) {
        var pos = lookfor(ts || (new Date()).getTime(), this.table)[0];
        return "'" + this.table[pos][1] + "' at " + this.table[pos][0];
    };

    return this;
}

/**
 * @description Map (Hashless Hashmap).<br />
 * It's depreciated in the next version (in favour of ES6) and will have the following methods instead:
 * size(), clear(), delete(key), entries(), forEach(cb, args), get(key), has(key), keys(), values()
 * @param {*} [keys=[]] Keys
 * @constructor
 * @this {Map}
 * @returns {Map} Map
 * @since 1.1
 * @property {SortedSet} Map.keys Keys
 * @property {Object} Map.values Mapped values
 * @property {function(NumberLike, *)} Map.add Add a key/value
 * @property {function(*): boolean} Map.has Check if a map has a value
 * @property {function(NumberLike)} Map.clear Clear a bucket or all of them
 * @property {function(NumberLike): boolean} Map.hasKey Check if a map has a key
 * @property {function(): number} Map.size Size of the map
 * @property {function(): boolean} Map.isEmpty Emptiness check
 * @property {function(NumberLike): Array} Map.get Get the mapped values of a key
 * @property {function(NumberLike, *)} Map.remove Remove a key or a value
 * @property {function(): string} Map.toString String representation
 * @property {function(function(*), boolean)} Map.forEach Act on each "buckets"
 * @property {function(NumberLike, *)} Map.set Set a new value to a key
 * @property {function(NumberLike, *, *)} Map.replace Replace the value of a key with a new one
 * @property {function(*, *)} Map.replaceAll Replace all the value of all the keys with a new one
 * @property {function(Map)} Map.merge Merge the two maps
 * @property {function(boolean): string} Map.elements Elements of the map
 */
function Map (keys) {
    this.keys = new SortedSet(keys || []);
    this.values = Tablify(this.keys.value);
    /*this.keys.forEach(function (k) {
     this.values[k] = [];
     });*/
    this.add = function (key, value) {
        if (isType(key, "Array")) {
            for (var i = 0; i < key; i++) this.add(key[i], isType(value, "Array")? value[i]: value);
        }
        this.keys.add(key);
        if (this.values[key] === undefined) this.values[key] = [];
        this.values[key].push(value || null);
    };
    this.clear = function (key) {
        key? this.values[key] = []: this.keys = new Set();
    };
    this.has = function (val) {
        for (var k in this.keys) {
            if (this.keys.hasOwnProperty(k) && this.keys[k].has(val)) return true;
        }
        return false;
    };
    this.hasKey = function (key) {
        return this.keys.contains(key);
    };
    this.size = function () {
        var el = this.values;
        return this.keys.value.map(function (k) {
            return el[k].length;
        });
    };
    this.elements = function (spaced) {
        var el = this.values;
        return this.keys.value.map(function (k) {
            return spaced? el[k].toStr(true): el[k].toString();
        }).toStr(true);
    };
    this.isEmpty = function () {
        return this.keys.isEmpty(); //No need to check the values
    };
    this.get = function (key) {
        return this.values[key];
    };
    this.remove = function (key, value) {
        value? this.values[key] = this.values[key].remove(value): this.keys.remove(key);
    };
    this.toString = function () {
        return "Map(key/values=" + this.values.toArray().toStr(true) + ")";
    };
    this.forEach = function (act, valuesInstead) {
        for (var i = 0; i < this.keys.size(); i++) valuesInstead? act(this.values[this.keys.get(i)], i): act(this.keys.get(i), i);
    };
    this.merge = function (map) {
        this.keys.add(map.keys.value, map.values);
    };
    this.set = function (key, value) {
        this.keys.set(this.keys.indexOf(key), value);
    };
    this.replace = function (key, oldVal, newVal) {
        if (this.values[key].has(oldVal)) this.values[key] = this.values[key].replace(oldVal, newVal);
    };
    this.replaceAll = function (oldVal, newVal) {
        var self = this;
        this.forEach(function (k) {
            self.replace(k, oldVal, newVal);
        });
    };
    return this;
}

function DomGraph () {
    var current = document.children[0];
    var dom = new NTreeNode(current.tagName.toLowerCase(), current.children.toArray().map(function (child) {
        return new NTreeNode(child.tagName.toLowerCase());
    }));
    dom.add();

    return dom;
}