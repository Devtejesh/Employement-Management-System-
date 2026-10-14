from app.agent.graph import agent_graph


def test_agent_without_tool():
    result = agent_graph.invoke(
        {
            "user_message": "Hello, what can you do?"
        }
    )

    assert result.get("final_response") is not None