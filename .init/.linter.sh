#!/bin/bash
cd /home/kavia/workspace/code-generation/network-device-inventory-web-app-4976-5083/FrontendUI
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

