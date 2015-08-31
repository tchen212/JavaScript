/**     
* Interface������     
* @param {String} name �ӿ���     
* @param {Array} methods �ӿ��еĳ��󷽷�          
* @exception {Error} �������ϸ�ʱ�׳��쳣     
* @example     
* var IActionListener = new Interface("IActionListener",["method1","method2"]);     
*/
var Interface = function (name, methods) {
  if (arguments.length != 2) {
    throw new Error("Interface����ֻ����������������ǰ��������Ϊ��" + arguments.length);
  }
  this.name = name;
  this.methods = [];
  for (var i = 0, len = methods.length; i < len; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error("Interface�еķ���������Ϸ�");
    }
    this.methods.push(methods[i]);
  }
};

/**     
* �ӿ�ʵ�ֵļ�飬��֤object��InterfaceN��ʵ��     
* @param {Object} oInterface �����Ľӿ�ʵ��     
* @param {Class} InterfaceN ��ʵ�ֵ�Interface     
* @exception {Error} �������ϸ�ʱ�׳��쳣     
* @example      
* Interface.ensureImplements(oActionListener,IActionListener);     
*/
Interface.ensureImplements = function (oInterface, Interface1, Interface2, InterfaceN) {
  if (arguments.length < 2) {
    throw new Error("Interface.ensureImplements����������Ҫ��������������ǰ��������Ϊ��" + arguments.length);
  }
  for (var i = 1, len = arguments.length; i < len; i++) {
    var interface = arguments[i];
    if (interface.constructor !== Interface) {
      throw new Error(interface + "����Interface��ʵ�������ǽӿ�");
    }
    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
      var method = interface.methods[j];
      if (!oInterface[method] || typeof oInterface[method] !== 'function') {
        throw new Error("��������û��ʵ��" + interface.name + "�ӿڣ�" + method + "δ�ҵ�");
      }
    }
  }
};

//�����ӿ�
var IActionListener = new Interface("IActionListener", ["method1", "method2"]);
//�ӿ�ʵ���Ĵ���
var oActionListener = {
  method1: function () {
    alert("���Ƿ���1");
  },
  method2: function () {
    alert("���Ƿ���2");
  }
};
//implementsȷ��
Interface.ensureImplements(oActionListener, IActionListener);
//����ʵ���еķ���
oActionListener.method1();
/** * �ӿڵ�ʵ�� 
* @param {function} ImplementsClass ��ʵ�ֵ��� 
* @param {object} InterfaceN ��ʵ�ֵ�Interface��Interface��ʵ�� 
* @exception {Error} �������ϸ�ʱ�׳��쳣 
* @example  
* implements(ActionListener,IActionListener); 
*/
var implements = function (ImplementsClass, Interface1, Interface2, InterfaceN) {
  if (arguments.length < 2) {
    throw new Error("Interface.ensureImplements����������Ҫ��������������ǰ��������Ϊ��" + arguments.length);
  }
  //��֤ImplementsClass������Ϊfunction
  if (typeof arguments[0] !== "function") {
    throw new Error("ʵ��������ͱ���Ϊfunction");
  }
  for (var i = 1, len = arguments.length; i < len; i++) {
    var interface = arguments[i];
    if (interface.constructor !== Interface) {
      throw new Error(interface + "����Interface��ʵ�������ǽӿ�");
    }
    //����ѭ�����нӿڳ��󷽷���ʵ��
    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
      var method = interface.methods[j];
      if (!arguments[0].prototype[method]) {
        arguments[0].prototype[method] = function () { };
      }
    }
  }
}

//�������������������ǵĴ���Ϳ���д�������ˣ�
//�����ӿ�var IActionListener = new Interface("IActionListener",["method1","method2"]); 
//����ʵ����var ActionListener = function(){};
//ʵ��implements(ActionListener,IActionListener);
//���ʱ��ActionListener.prototype�Ѿ���������������ˣ�
/*    
  ActionListener.prototype = {        method1 : function(){},        method2 : function(){}    };
  */
//������������������䱻��ʵ�ֵķ������߼���
ActionListener.prototype = {
  method1: function () {
    alert("���Ƿ���1");
  },
  method2: function () {
    alert("���Ƿ���2");
  }
};
//����ʵ���еķ���oActionListener.method1();


//Source From : http://blog.csdn.net/ymmc001/article/details/5990021
