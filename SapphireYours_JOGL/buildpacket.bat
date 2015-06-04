rmdir /s /q dist
mkdir dist

set JAR="C:\Program Files\Java\jdk1.7.0_03\bin\jar.exe"
%JAR% cfm dist\sapphireyours.jar manifest.txt 
%JAR% -uf dist\sapphireyours.jar -C bin grafl
%JAR% -uf dist\sapphireyours.jar -C bin Launcher.class
%JAR% -uf dist\sapphireyours.jar -C bin GameCloser.class
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_Common\bin javax 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_Common\bin android 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_Common\bin org 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin android
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res art 
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res gfx
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_Common\res levels
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res sound
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res music

mkdir dist\libs
copy ..\AndroidEmulation_JOGL\jogl\*.jar dist\libs
copy ..\AndroidEmulation_JOGL\jaco\*.jar dist\libs
