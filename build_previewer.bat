
set JAR="C:\Program Files\Java\jdk1.7.0_03\bin\jar.exe"
%JAR% cfm sapphireyours_previewer.jar previewer_manifest.txt 
%JAR% -uf sapphireyours_previewer.jar -C SapphireYours_JOGL/bin grafl
%JAR% -uf sapphireyours_previewer.jar -C SapphireYours_JOGL/bin Launcher.class
%JAR% -uf sapphireyours_previewer.jar -C SapphireYours_JOGL/bin GameCloser.class
%JAR% -uf sapphireyours_previewer.jar -C AndroidEmulation_Common\bin javax 
%JAR% -uf sapphireyours_previewer.jar -C AndroidEmulation_Common\bin android 
%JAR% -uf sapphireyours_previewer.jar -C AndroidEmulation_Common\bin org 
%JAR% -uf sapphireyours_previewer.jar -C AndroidEmulation_JOGL\bin android
