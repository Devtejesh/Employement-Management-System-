from langgraph.graph import StateGraph, END

from app.agent.state import AgentState
from app.agent.nodes import (
    decision_node,
    tool_node,
    response_node,
)


def should_use_tool(state: AgentState):
    if state.get("tool_name"):
        return "tool"

    return "response"


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("decision", decision_node)
    graph.add_node("tool", tool_node)
    graph.add_node("response", response_node)

    graph.set_entry_point("decision")

    graph.add_conditional_edges(
        "decision",
        should_use_tool,
        {
            "tool": "tool",
            "response": "response",
        },
    )

    graph.add_edge("tool", "response")
    graph.add_edge("response", END)

    return graph.compile()


agent_graph = build_graph()