/**     
* Interface构造器     
* @param {String} name 接口名     
* @param {Array} methods 接口中的抽象方法          
* @exception {Error} 参数不合格时抛出异常     
* @example     
* var IActionListener = new Interface("IActionListener",["method1","method2"]);     
*/
var Interface = function (name, methods) {
  if (arguments.length != 2) {
    throw new Error("Interface有且只有两个参数，而当前参数个数为：" + arguments.length);
  }
  this.name = name;
  this.methods = [];
  for (var i = 0, len = methods.length; i < len; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error("Interface中的方法名必须合法");
    }
    this.methods.push(methods[i]);
  }
};

/**     
* 接口实现的检查，保证object是InterfaceN的实例     
* @param {Object} oInterface 待检查的接口实例     
* @param {Class} InterfaceN 被实现的Interface     
* @exception {Error} 参数不合格时抛出异常     
* @example      
* Interface.ensureImplements(oActionListener,IActionListener);     
*/
Interface.ensureImplements = function (oInterface, Interface1, Interface2, InterfaceN) {
  if (arguments.length < 2) {
    throw new Error("Interface.ensureImplements方法至少需要两个参数，而当前参数个数为：" + arguments.length);
  }
  for (var i = 1, len = arguments.length; i < len; i++) {
    var interface = arguments[i];
    if (interface.constructor !== Interface) {
      throw new Error(interface + "不是Interface的实例，不是接口");
    }
    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
      var method = interface.methods[j];
      if (!oInterface[method] || typeof oInterface[method] !== 'function') {
        throw new Error("所给参数没有实现" + interface.name + "接口，" + method + "未找到");
      }
    }
  }
};

//创建接口
var IActionListener = new Interface("IActionListener", ["method1", "method2"]);
//接口实例的创建
var oActionListener = {
  method1: function () {
    alert("这是方法1");
  },
  method2: function () {
    alert("这是方法2");
  }
};
//implements确认
Interface.ensureImplements(oActionListener, IActionListener);
//调用实例中的方法
oActionListener.method1();
/** * 接口的实现 
* @param {function} ImplementsClass 待实现的类 
* @param {object} InterfaceN 被实现的Interface，Interface的实例 
* @exception {Error} 参数不合格时抛出异常 
* @example  
* implements(ActionListener,IActionListener); 
*/
var implements = function (ImplementsClass, Interface1, Interface2, InterfaceN) {
  if (arguments.length < 2) {
    throw new Error("Interface.ensureImplements方法至少需要两个参数，而当前参数个数为：" + arguments.length);
  }
  //保证ImplementsClass的类型为function
  if (typeof arguments[0] !== "function") {
    throw new Error("实现类的类型必须为function");
  }
  for (var i = 1, len = arguments.length; i < len; i++) {
    var interface = arguments[i];
    if (interface.constructor !== Interface) {
      throw new Error(interface + "不是Interface的实例，不是接口");
    }
    //这里循环进行接口抽象方法的实现
    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
      var method = interface.methods[j];
      if (!arguments[0].prototype[method]) {
        arguments[0].prototype[method] = function () { };
      }
    }
  }
}

//经过这样的升级，我们的代码就可以写成这样了：
//创建接口var IActionListener = new Interface("IActionListener",["method1","method2"]); 
//创建实现类var ActionListener = function(){};
//实现implements(ActionListener,IActionListener);
//这个时候，ActionListener.prototype已经是如下这个样子了：
/*    
  ActionListener.prototype = {        method1 : function(){},        method2 : function(){}    };
  */
//接下来可以真正的填充被空实现的方法的逻辑了
ActionListener.prototype = {
  method1: function () {
    alert("这是方法1");
  },
  method2: function () {
    alert("这是方法2");
  }
};
//调用实例中的方法oActionListener.method1();


//Source From : http://blog.csdn.net/ymmc001/article/details/5990021
