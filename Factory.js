/**
 * Created with JetBrains WebStorm.
 * User: mjchen
 * Date: 15-1-22
 * Time: 下午11:25
 * 流水线开发模式，基础框架方法。
 * 分为三部分组成，
 *  １.制造工厂，负责按流程处理任务。
 *  ２.生产车间，负责按特定的数据来源进行加工。功能独立。
 *  ３.车间组，负责加载各类车间。
 *　工作模式：
 *      加载车间类，可以通过WorkSpace.charge加载一个队列，并通过回调函数获得是否已完成全部模块加载。
 *      当模块加载完成后可以生成工厂，并将刚加载好的车间按顺序注册进工厂。
 *      为工厂设置原始数数据。
 *      按顺序加工数数据。
 */

/**
 *  @description 工厂类
 * @param {JSON}[_data]
 * @constructor
 */
function Factory(_data)
{
    this.depot = _data;
    this.shopList = [];
}

/**
 * @description 车间类
 * @constructor
 */
function Shop()
{
    this.method = {
        "working": new Function
    }
}


/**
 * @description 资源池
 * @type {{loading: {}, group: {}, charge: Function, load: Function}}
 */
var WorkSpace = {
    /**
     * @description 待装载的车间序列
     */
    "loading": {},
    /**
     * @description 已有资源池
     */
    "group"  : {},
    /**
     * 为资源池装载指定资源，并在全部加载完成后，调用回调函数。
     * @param {Array}list
     * @param {Function}callback
     */
    charge   : function (list, callback)
    {
        var lock = [], i, len;
        for (i = 0; i < list.length; i++)
        {
            lock.push(list[i].name);
        }
        var asy = new AsyncLock(lock, [], callback);
        for (i = 0, len = list.length; i < len; i++)
        {
            WorkSpace.loading[list[i].name] = WorkSpace.loading[list[i].name] || new AsyncLock(["loading"], [insertScript(list[i].url)], new Function);
            WorkSpace.loading[list[i].name].run([list[i].name], function (name)
            {
                asy.Unlock(name);
            });
        }
    },
    /**
     * @description 报到
     * @param {String}name
     * @param {Shop}obj
     */
    load     : function (name, obj)
    {
        WorkSpace.group[name] = obj;
        WorkSpace.loading[name] = WorkSpace.loading[name] || new AsyncLock(["loading"], [], new Function);
        WorkSpace.loading[name].Unlock("loading");
    }
};

(function ()
{
    /**
     * @description 车间作业
     * @returns {*}
     */
    Shop.prototype.working = function ()
    {
        return this.method.working.apply(this, arguments);
    };

    /**
     *
     * @returns {JSON}
     */
    Factory.prototype.get = function ()
    {
        return this.depot;
    };
    /**
     *
     * @param {JSON}data
     */
    Factory.prototype.set = function (data)
    {
        this.depot = data;
    };
    /**
     * @description 车间注册
     * @param {Shop}object
     */
    Factory.prototype.use = function (object)
    {
        if (object.constructor != Shop)
        {
            throw "无法注册一个不标准车间";
        }
        this.shopList.push(object);
    };

    /**
     * @description 流水线作业
     * @param {Function}[callback]
     */
    Factory.prototype.processing = function (callback)
    {
        var runList = this.shopList;
        var This = this;
        var i = 0;
        (function run()
        {
            var shop = runList[i];
            i++;
            if (!shop)
            {
                callback && callback();
                return;
            }

            shop.working(This.depot, run);
        })();
    };
})();
