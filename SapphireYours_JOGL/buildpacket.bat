rmdir /s /q dist
mkdir dist

set JAR="C:\Program Files\Java\jdk1.7.0_03\bin\jar.exe"
%JAR% cfm dist\sapphireyours.jar manifest.txt 
%JAR% -uf dist\sapphireyours.jar -C bin launcher
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin javax 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin android 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin org 
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin android
%JAR% -uf dist\sapphireyours.jar -C ..\AndroidEmulation_JOGL\bin kuusisto
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_Common\bin grafl
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res art 
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res gfx
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_Common\res levels
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res music
%JAR% -uf0 dist\sapphireyours.jar -C ..\SapphireYours_Common\res sound

mkdir dist\libs
copy ..\AndroidEmulation_JOGL\jogl\*.jar dist\libs
copy ..\AndroidEmulation_JOGL\jaco\*.jar dist\libs
