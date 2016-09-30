@echo off
set e=%DB%\Projects\EssenceJS\1.1
cd rsc
copy /Y %e%\essence.js essence.js
copy /Y %e%\essence.min.js essence.min.js
copy /Y %e%\essence.css essence.css
copy /Y %e%\essence.min.css essence.min.css
copy /Y %e%\modules modules
del modules\list.md