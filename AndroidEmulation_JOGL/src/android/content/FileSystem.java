package android.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class FileSystem 
{

	public static File getAppDataDirectory(String applicationname)
	{
		// try to determine storage location the Windows way
		String d = System.getenv("AppData");
		if (d!=null)
		{	File f = new File(new File(d), applicationname);
			if (f.isDirectory())
			{	return f;
			}
			if (f.mkdir())
			{	return f;		
			}		
		}	
		// fall back do some default directory
		return new File(".");
		
	}
	
	public static String readFileFromAppDataDirectory(String applicationname, String filename, String defaultvalue)
	{		
		try 
		{	
			File f = new File(getAppDataDirectory(applicationname),filename);
			if (f.isFile())
			{	// read the whole stream into a character buffer
				char[] buffer = new char[Math.max((int)f.length(),100)];
				int len = 0;
				InputStreamReader reader = new InputStreamReader(new FileInputStream(f), "utf-8");
				for (;;)
				{	// increase buffer size if necessary
					if (len>=buffer.length)
					{	char[] b2 = new char[buffer.length*2];
						System.arraycopy(buffer,0,b2,0,buffer.length);
						buffer = b2;
					}
					int didread = reader.read(buffer,len,buffer.length-len);
					if (didread<0) 
					{	break;
					}
					len += didread;
				}
				reader.close();
				return new String(buffer,0,len);
			}
		}			
		catch (IOException e) {}
		
		return defaultvalue; 
	}	
	

}
