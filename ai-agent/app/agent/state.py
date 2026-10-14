from typing import TypedDict, Optional, Any


class AgentState(TypedDict, total=False):
    user_message: str
    jwt_token: Optional[str]
    tool_name: Optional[str]
    tool_input: Optional[dict]
    tool_result: Optional[Any]
    final_response: Optional[str]