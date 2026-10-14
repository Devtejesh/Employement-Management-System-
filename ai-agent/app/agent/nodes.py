import json

from app.agent.prompts import SYSTEM_PROMPT
from app.agent.state import AgentState
from app.services.llm import generate_response
from app.tools.employees import get_all_employees


def decision_node(state: AgentState) -> AgentState:
    user_message = state["user_message"]

    prompt = f"""
{SYSTEM_PROMPT}

User request:
{user_message}

Available tools:
- get_all_employees

Decide whether a tool is required.

Return ONLY valid JSON in this format:

{{
    "tool_name": "get_all_employees"
}}

If no tool is required:

{{
    "tool_name": null
}}
"""

    result = generate_response(prompt)

    result = result.replace("```json", "").replace("```", "").strip()
    decision = json.loads(result)

    return {
        "tool_name": decision.get("tool_name")
    }


def tool_node(state: AgentState) -> AgentState:
    tool_name = state.get("tool_name")
    jwt_token = state.get("jwt_token")

    if tool_name == "get_all_employees":
        if not jwt_token:
            return {
                "tool_result": "Authentication required."
            }

        result = get_all_employees(jwt_token)

        return {
            "tool_result": result
        }

    return {
        "tool_result": None
    }


def response_node(state: AgentState) -> AgentState:
    user_message = state["user_message"]
    tool_result = state.get("tool_result")

    prompt = f"""
{SYSTEM_PROMPT}

User request:
{user_message}

Tool result:
{tool_result}

Give the user a clear final response.
"""

    final_response = generate_response(prompt)

    return {
        "final_response": final_response
    }