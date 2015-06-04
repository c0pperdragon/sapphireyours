package android.content.res;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class AssetManager 
{
	public AssetManager()
	{
	}
	
	public final AssetFileDescriptor openFd(String fileName) throws IOException
	{
		URL url = getClass().getResource("/"+fileName);		
		if (url==null)
		{	throw new IOException("Asset not found: "+fileName);
		}
		return new AssetFileDescriptor(url);
	}
		
	public final InputStream open(String fileName) throws IOException
	{
		return openFd(fileName).createInputStream();
	}	
}

