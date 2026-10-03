"""定义跨 API、聊天编排和模型集成层传递的业务异常。"""


class LLMNotConfiguredError(RuntimeError):
    """当前模型供应商缺少必要运行配置。"""


class LLMRequestError(RuntimeError):
    """模型供应商请求失败或没有返回可用文本。"""
