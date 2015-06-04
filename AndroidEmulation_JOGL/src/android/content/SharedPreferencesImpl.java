package android.content;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import org.json.JSONObject;


public class SharedPreferencesImpl extends JSONObject implements SharedPreferences 
{
	private File preferencesfile;
	
	public SharedPreferencesImpl(String applicationname)
	{
		super(FileSystem.readFileFromAppDataDirectory(applicationname, "preferences.json", "{}"));
		preferencesfile = new File(FileSystem.getAppDataDirectory(applicationname), "preferences.json");
	}
	
	public boolean contains(String key)
	{
		return opt(key)!=null;
	}
	
	public boolean	getBoolean(String key, boolean defValue)
	{ 
		return optBoolean(key,defValue);
	}	
	public float getFloat(String key, float defValue)
	{
		return (float)optDouble(key,defValue);
	}	
	public int	getInt(String key, int defValue)
	{
		return optInt(key,defValue);
	}
	public long getLong(String key, long defValue)
	{	
		return optLong(key,defValue);
	}
	public String getString(String key, String defValue)
	{
		return optString(key,defValue);
	}
	
	public SharedPreferences.Editor edit()
	{
		return new SharedPreferencesEditorImpl(this);	
	}
		
	void writeBack()
	{
		try
		{
			OutputStreamWriter w = new OutputStreamWriter(new FileOutputStream(preferencesfile), "utf-8");
			write(w);
			w.close();
		}	
		catch (IOException e)
		{	System.out.println("Error writing preferences to "+preferencesfile+": "+e.getMessage());
		}	
	}	 
	
		
	
}
