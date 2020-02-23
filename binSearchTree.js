function BinSearchTree(){
         this.root = null;

         function Node(key){
            this.key = key;
            this.left = null;
            this.right = null;
         }
         //1.对外插入方法 
         BinSearchTree.prototype.insert = function(key){
            //1根据key创建节点
            var newNode = new Node(key);
            //2.判断根节点是否存在
            if(this.root == null) {this.root = newNode;}
            else{
               this.insertNode(this.root,newNode);
            } 
         }

         //2.对内插入函数  递归调用 使得newNode最终正确挂载到相应的位置
         BinSearchTree.prototype.insertNode = function(node,newNode){
            if(newNode.key < node.key){//向左查找
               if(node.left == null){
                  node.left = newNode;
               }else{
                  this.insertNode(node.left,newNode)
               }
            }else{                     //向右查找
               if(node.right == null){
                  node.right = newNode
               }else{
                  this.insertNode(node.right,newNode);
               }
            }
         }

         //3.先序遍历
         BinSearchTree.prototype.preOrderTraversal = function(handler){
            this.preOrderTraversalNode(this.root,handler)
         }
         //3.1先序遍历内部递归函数
         BinSearchTree.prototype.preOrderTraversalNode = function(node,handler){
            if(node != null){
               //1.处理经过的节点
               handler(node.key);
               //2.处理经过节点的左子节点
               this.preOrderTraversalNode(node.left,handler)
               //3.处理经过节点的右子节点
               this.preOrderTraversalNode(node.right,handler)
            }
         }


      }