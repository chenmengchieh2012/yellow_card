@echo off
REM Windows run server script
REM 須放置在app.js的資料夾內
nodemon app.js --active=./resource/local.yml
pause