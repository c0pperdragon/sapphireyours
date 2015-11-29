package android.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Vector;

import android.content.res.AssetManager;
import android.content.res.Resources;
import android.util.DisplayMetrics;

public class Context
{
	final static int MODE_PRIVATE = 0;
	final static int MODE_APPEND = 0x00008000;

	private String applicationname;
	private AssetManager assets;
	private Resources resources;
	
	
	public Context(String applicationname, DisplayMetrics displaymetrics)
	{
		this.applicationname = applicationname;
		this.assets = null;
		this.resources = new Resources(displaymetrics);
	}
	
	public  AssetManager getAssets()
	{
		if (assets==null)
		{	
			assets = new AssetManager();
		}
		return assets;
	}
	
	public Resources getResources()
	{
		return resources;			
	}

	public InputStream openFileInput(String filename) throws FileNotFoundException
	{
		return new FileInputStream(new File(FileSystem.getAppDataDirectory(applicationname), filename));	
	}

	public OutputStream openFileOutput(String filename, int mode) throws FileNotFoundException
	{
		return new FileOutputStream(new File(FileSystem.getAppDataDirectory(applicationname), filename), (mode&MODE_APPEND)!=0);	
	}

	public String[] fileList ()
	{
		File dir = FileSystem.getAppDataDirectory(applicationname);
		Vector<String> list = new Vector<String>();
		for(File f: dir.listFiles())
		{
			if (f.isFile())
			{	String n=f.getName();
				if (!n.equalsIgnoreCase("preferences.json"))
				{
					list.addElement(n);				
				}
			}
		} 
		return list.toArray(new String[0]);
	}
	
	
	
}
