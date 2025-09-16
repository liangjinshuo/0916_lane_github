package func_golang_baas_sdk

import (
	"context"
	"time"

	"github.com/byted-apaas/baas-sdk-go/baas"
	"github.com/byted-apaas/faas-sdk-go/faas"
	"github.com/byted-apaas/server-sdk-go/application"
)

type Params struct{}

type Result struct {
	TaskID int64 `json:"taskID"`
}

func Handler(ctx context.Context, params *Params) (*Result, error) {
	// 日志功能
	application.GetLogger(ctx).Infof("%s 函数开始执行, logid: %s", time.Now().Format("2006-01-02 15:04:05.999"), faas.Tool.GetLogID(ctx))

	taskID, err := baas.Tasks.CreateAsyncTask(ctx, "func_golang_baassdk_invoke_go", map[string]interface{}{"input": "测试异步参数"})
	if err != nil {
			panic(err)
	}
	application.GetLogger(ctx).Infof("taskID: %d", taskID)

	return &Result{
			TaskID: taskID,
	}, nil
}
