curl -N http://127.0.0.1:11434/api/chat \
  -d '{
        "model": "deepseek-r1:latest",
        "streaming": true,
        "messages": [
          {
            "role": "user",
            "content": "Say hello"
          }
        ]
      }'
