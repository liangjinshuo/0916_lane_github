import { useState } from "react";

// 自定义组件开发请参考：https://ae.feishu.cn/hc/zh-CN/articles/795691112919
export interface Props {}

const ChildComponent: React.FC<{ shouldThrowError: boolean }> = ({
  shouldThrowError,
}) => {
  if (shouldThrowError) {
    throw new Error('子组件发生错误！');
  }
  return <div>子组件正常渲染</div>;
};


const ParentComponent: React.FC = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const toggleError = () => {
    setShouldThrowError((prev) => !prev);
  };

  return (
    
      <div>
        <h1>父组件</h1>
        <button onClick={toggleError}>
          {shouldThrowError ? '停止抛出错误' : '抛出错误'}
        </button>
        <ChildComponent shouldThrowError={shouldThrowError} />
      </div>
   
  );
};


const ErrorComponent = (props: Props): JSX.Element => {
  return <ParentComponent />;
};

export default ErrorComponent;
