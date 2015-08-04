package grafl.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class Util
{
	public static String readStringFromStream(InputStream stream)
	{
		// read the whole stream into a character buffer
		char[] buffer = new char[1000];
		int len = 0;
		try 
		{
			InputStreamReader reader = new InputStreamReader(stream, "utf-8");
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
		} 
		catch (IOException e) {}
		return new String(buffer,0,len);
	}	

}
