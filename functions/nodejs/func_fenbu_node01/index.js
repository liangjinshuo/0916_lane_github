// 通过 NPM dependencies 成功安装 NPM 包后此处可引入使用
// 如安装 linq 包后就可以引入并使用这个包
// const linq = require("linq");

/**
 * @param {Params}  params     自定义参数
 * @param {Context} context    上下文参数，可通过此参数下钻获取上下文变量信息等
 * @param {Logger}  logger     日志记录器
 *
 * @return 函数的返回数据
 */
 module.exports = async function (params, context, logger) {
     // 日志功能
     logger.info(`${new Date()} 函数开始执行 , logid: %s`, faas.tool.getLogID());
 
     // 数据集
     const dataset = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
     // 创建分布式任务，获取任务 ID
     const taskId = await baas.tasks.createDistributedTask(
         dataset,                       // 待处理数据组成的数组，数据量限制 50 M 
         "func_node_time01",                 // 用于处理数据集的全局函数的 API name
         "",        // 任务进度发生变化时回调的全局函数的 API name，可通过传入"" / null / undefined 跳过此步骤
         "",       // 任务完成时回调的全局函数的 API name，可通过传入"" / null / undefined 跳过此步骤
         {                              // 以下为可选参数：
             concurrency: 10,            // 并发数量，默认值为 5，最大可设置值为 10，若实际设置值超过可设置最大值，将报错
             maxSliceNumber: 20,        // 单个子任务单次处理的最大数据量，默认值为 5，最大可设置值为 100，若实际设置值超过可设置最大值，将报错
             progressCallbackStep: 30   // 触发进度回调函数的步长，每当发生大于等于步长的进度变化时，便触发进度回调函数
         });
     logger.info(`taskID: ${taskId}`);
 
     // ...（其他业务逻辑）
 }