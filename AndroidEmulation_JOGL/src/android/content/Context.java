package android.content;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;

import android.content.res.AssetManager;
import android.content.res.Resources;

public abstract class Context
{
	final static int MODE_PRIVATE = 0;
	final static int MODE_APPEND = 0x00008000;

	public abstract AssetManager getAssets();
	public abstract Resources getResources();
	public abstract InputStream openFileInput(String filename) throws FileNotFoundException;
	public abstract OutputStream openFileOutput(String filename, int mode) throws FileNotFoundException;
	public abstract String[] fileList ();
}
