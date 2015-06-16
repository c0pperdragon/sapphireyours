package android.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Vector;

import android.content.res.AssetManager;
import android.content.res.Resources;

public class ContextImpl extends Context 
{
	private String applicationname;
	private AssetManager assets;
	private Resources resources;
	
	
	public ContextImpl(String applicationname)
	{
		this.applicationname = applicationname;
		this.assets = null;
		this.resources = null;
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
		if (resources==null)
		{	
			resources = new Resources();
		}
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
