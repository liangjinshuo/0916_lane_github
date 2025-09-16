package func_hook_func_golang

import (
	"context"
	"time"

	"github.com/byted-apaas/server-sdk-go/application"
	"github.com/byted-apaas/baas-sdk-go/baas"
	"github.com/byted-apaas/faas-sdk-go/faas"
)

/*Params 函数入参定义
 * 结构体名称不支持自定义, 必须为 Params
 * 结构体属性支持自定义, 和 index.meta.json 中的 input 参数一一对应
 */
type Params struct {
	// ParamID string `json:"param_id"`
}

/*Result 函数出参定义
 * 结构体名称不支持自定义, 必须为 Result
 * 结构体属性支持自定义, 和 index.meta.json 中的 output 参数一一对应
 */
type Result struct {
	// ResultID string `json:"result_id"`
}

/*Handler 函数入口
 * 入口函数签名不支持自定义, 必须为 func(context.Context, *Params) (*Result, error)
 * @param ctx    请求上下文参数, 使用 server-sdk-go 需要链路透传该参数
 * @param params 请求参数
 */
 func Handler(ctx context.Context, params *Params) (*Result, error) {
  // 日志功能
  application.GetLogger(ctx).Infof("%s 函数开始执行", time.Now().Format("2006-01-02 15:04:05.999"),faas.Tool.GetLogID(ctx))

  // 触发异步函数
  taskID, err := baas.Tasks.CreateAsyncTask(ctx, "func_go02", nil)
  if err!=nil{
    application.GetLogger(ctx).Errorf("CreateAsyncTask err: %+v",err)
  }
  application.GetLogger(ctx).Infof("Async Task Created with taskID: %d", taskID) // 增加的日志信息

  application.GetLogger(ctx).Infof("%s 函数完成，taskID：%d", time.Now().Format("2006-01-02 15:04:05.999"), taskID)

  // 触发同步函数
  var res interface{}
  faas.Function("func_go01").Invoke(ctx, nil, &res)
  
  return &Result{}, nil
}