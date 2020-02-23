function HashTable() {
         this.storage = [];
         this.count = 0;//记录当前已存放元素个数==加载因子>0.75 需要扩容 <0.25 需要缩容
         this.limit = 7;//当前总长度
         this.loadFactor ;

         //-3.获取质数
         HashTable.prototype.getPrime = function(num){
            while(!this.isPrime(num)){
               num++;
            }
            return num;
         }

         //-2isPrime 判断是否为质数函数
         HashTable.prototype.isPrime = function(num){
            var temp = parseInt(Math.sqrt(num));
            for(var i = 2; i <= temp; i++){
               if(num % i == 0) return false;
            }
            return true;
         }

         //-1.resize方法 哈希表扩容,缩容函数
         HashTable.prototype.resize = function(newLimit){
            //1.保存旧数组内容
            var oldStorage = this.storage;
            //重置所有属性
            this.storage = [];
            this.count = 0;
            this.limit = newLimit;
            //遍历所有oldStorage中的遍历所有oldStorage中的bucket
            for(var i = 0; i<oldStorage.length; i++){
               var bucket = oldStorage[i]
               if(bucket == null) continue;
               for(var j = 0; j<bucket.length; j++){
                  var tuple = bucket[j];
                  this.put(tuple[0],tuple[1]);
               }
            }
         }

         //0. ●●哈希函数●●
         HashTable.prototype.hashFunc = function (str, size) {
            //1.定义hashCode 保存比较大的数字
            var hashCode = 0;
            //2.霍纳算法来计算hashCode的值
            //比如现在是'cats' =>
            for (var i = 0; i < str.length; i++) {
               hashCode = 37 * hashCode + str.charCodeAt(i) //str.charCodeAt(i)获取每个字符的unicode编码
            }
            //3.取余操作
            var index = hashCode % size;
            return index;
         }

         //1.插入&修改方法
         HashTable.prototype.put = function (key, value) {//key为要转化为index的关键字
            //1根据key调用hashFunc获取index 为了知道插入到哪个桶中
            var index = this.hashFunc(key, this.limit)
            //2判断桶是否存在,
            //2.1如果不存在 创建桶 放在该索引位置
            var bucket = this.storage[index];
            if (bucket == null) {
               bucket = [];
               this.storage[index] = bucket;
            }
            //3.根据key判断是新增还是修改
            //3.1表示修改
            for (var i = 0; i < bucket.length; i++) {
               //tuple为元组 用来存储'涉猎'和涉猎解释的最小单元
               var tuple = bucket[i];
               if (tuple[0] == key) {
                  tuple[1] = value
                  return true
               }
            }
            //3.2表示新增
            bucket.push([key, value])
            this.count++;
            //扩容只发生在put元素时
            if(this.count > this.limit * 0.75){
               var newSize = this.limit * 2;
               var newPrime = this.getPrime(newSize)
               this.resize(newPrime);
            }
         }

         //2.get获取方法
         HashTable.prototype.get = function (key) {
            //1.根据key获取index
            var index = this.hashFunc(key, this.limit)
            //2.根据index获取bucket
            var bucket = this.storage[index];
            //3.判断bucket是否为null 为null直接返回null
            if (bucket == null) return null
            //3.1 bucket不为null 则遍历bucket 找到直接返回对应的value
            for (var i = 0; i < bucket.length; i++) {
               var tuple = bucket[i]; //取出每个桶中的元素 赋值给tuple;
               if (tuple[0] == key) return tuple[1];
            }
            //3.1.1 遍历bucket没找到 再次返回null
            return null;
         }

         //3.删除操作
         HashTable.prototype.remove = function(key){
            var index = this.hashFunc(key, this.limit)
            var bucket = this.storage[index];
            if (bucket == null) return null;
            for (var i = 0; i < bucket.length; i++) {
               var tuple = bucket[i];
               if (tuple[0] == key){
                  bucket.splice(i,1);
                  this.count--;
                  //缩容
                  if(this.limit > 7 && this.limit < this.limit * 0.25){
                     var newSize = Math.floor(this.limit / 2)
                     var newPrime = this.getPrime(newSize)
                     this.resize(newPrime);
                  }
                  return tuple[1];
               } 
            }
            return null;
         }

         //4.判断哈希表是否为空 isEmpty()
         HashTable.prototype.isEmpty = function(){
            return this.count ==0;
         }
         //5.获取哈希表元素个数
         HashTable.prototype.size = function(){
            return this.count;
         }

}