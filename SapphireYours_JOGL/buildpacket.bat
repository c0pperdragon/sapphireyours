rmdir /s /q dist
mkdir dist

set JAR="C:\Program Files\Java\jdk1.7.0_03\bin\jar.exe"
%JAR% cfm dist\sapphireyours.jar manifest.txt 
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin art 
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin gfx
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin grafl
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin levels
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin sound
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin Launcher.class
%JAR% -uf dist\sapphireyours.jar -C ..\SapphireYours_JOGL\bin Launcher$1.class
%JAR% -uf dist\sapphireyours.jar -C ..\..\AndroidSimulator\AndroidEmulation_Common\bin javax 
%JAR% -uf dist\sapphireyours.jar -C ..\..\AndroidSimulator\AndroidEmulation_Common\bin android 
%JAR% -uf dist\sapphireyours.jar -C ..\..\AndroidSimulator\AndroidEmulation_Common\bin org 
%JAR% -uf dist\sapphireyours.jar -C ..\..\AndroidSimulator\AndroidEmulation_JOGL\bin android

mkdir dist\jogamp
copy ..\..\AndroidSimulator\AndroidEmulation_JOGL\jogl\*.jar dist\jogamp
