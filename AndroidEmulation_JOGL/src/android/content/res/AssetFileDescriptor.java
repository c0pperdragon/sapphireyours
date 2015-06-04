package android.content.res;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class AssetFileDescriptor 
{
	public static final long UNKNOWN_LENGTH = -1;

	private URL url;
	
	public AssetFileDescriptor(URL url)
	{
		this.url = url;
	}
	
	public InputStream createInputStream() throws IOException
	{
		return url.openStream();
	}
	
	public URL getURL()
	{
		return url;
	}
	
	public URL getFileDescriptor()
	{
		return url;
	}
	
	public long getLength ()
	{
		return UNKNOWN_LENGTH;
	}
	
	public long getStartOffset ()
	{
		return 0;
	}	
}
