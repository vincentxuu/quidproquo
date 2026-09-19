| source | type | subtype／content | 次數 | 主要欄位 |
|---|---|---|---|---|
| client | `control_request` | end_session | 1 | request, request_id |
| client | `control_request` | get_context_usage | 8 | request, request_id |
| client | `control_request` | initialize | 21 | request, request_id |
| client | `control_request` | interrupt | 1 | request, request_id |
| client | `control_request` | mcp_set_servers | 6 | request, request_id |
| client | `control_request` | set_permission_mode | 8 | request, request_id |
| client | `control_response` | resp: | 6 | response |
| client | `user` | content:text | 11 | client_platform, message, parent_tool_use_id |
| worker | `active_goal` |  | 6 | value |
| worker | `assistant` | content:text | 20 | isApiErrorMessage, message, parent_tool_use_id, request_id, timestamp |
| worker | `assistant` | content:thinking | 14 | message, parent_tool_use_id, request_id, timestamp |
| worker | `assistant` | content:tool_use | 30 | message, parent_tool_use_id, request_id, timestamp, tool_use_meta |
| worker | `autocompact_state` |  | 6 | value |
| worker | `control_cancel_request` |  | 1 | request_id |
| worker | `control_request` | can_use_tool | 3 | request, request_id |
| worker | `control_response` | resp: | 38 | response |
| worker | `env_manager_log` | error:setup_script | 1 | data |
| worker | `env_manager_log` | info:clone | 19 | data |
| worker | `env_manager_log` | info:provision | 19 | data |
| worker | `env_manager_log` | info:setup_script | 7 | data |
| worker | `env_manager_log` | info:start_cc | 12 | data |
| worker | `prompt_suggestion` |  | 7 | suggestion |
| worker | `rate_limit_event` |  | 10 | rate_limit_info |
| worker | `result` | error_during_execution | 2 | duration_api_ms, duration_ms, errors, fast_mode_disabled_reason, fast_mode_state, is_error, modelUsage, num_turns, origin, permission_denial |
| worker | `result` | success | 9 | api_error_status, duration_api_ms, duration_ms, fast_mode_disabled_reason, fast_mode_state, is_error, modelUsage, num_turns, origin, permiss |
| worker | `system` | background_tasks_changed | 18 | tasks |
| worker | `system` | commands_changed | 33 | commands |
| worker | `system` | compact_boundary | 1 | compact_metadata, logical_parent_uuid |
| worker | `system` | hook_response | 18 | exit_code, hook_event, hook_id, hook_name, outcome, output, stderr, stdout |
| worker | `system` | hook_started | 18 | hook_event, hook_id, hook_name |
| worker | `system` | init | 11 | agents, analytics_disabled, apiKeySource, capabilities, claude_code_version, cwd, fast_mode_disabled_reason, fast_mode_state, mcp_servers, m |
| worker | `system` | notification | 3 | key, priority, text |
| worker | `system` | post_turn_summary | 11 | needs_action, status_category, status_detail, summarizes_uuid |
| worker | `system` | status | 45 | compact_result, permissionMode, status |
| worker | `system` | task_notification | 1 | output_file, status, summary, task_id, tool_use_id |
| worker | `system` | task_started | 1 | description, is_backgrounded, task_id, task_type, tool_use_id |
| worker | `system` | task_summary | 20 | detail |
| worker | `system` | vcs_state_changed | 2 | branch, cwd, kind |
| worker | `tool_progress` |  | 1 | elapsed_time_seconds, parent_tool_use_id, task_id, tool_name, tool_use_id |
| worker | `user` |  | 1 | isReplay, message, parent_tool_use_id, timestamp |
| worker | `user` | content:text | 6 | isReplay, isSynthetic, message, parent_tool_use_id, timestamp |
| worker | `user` | content:tool_result | 30 | message, parent_tool_use_id, sourceToolAssistantUUID, timestamp, toolUseResult, tool_result_meta, tool_use_result |