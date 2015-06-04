package android.content;

public interface SharedPreferences 
{
	boolean	contains(String key);
	SharedPreferences.Editor edit(); 
	boolean	getBoolean(String key, boolean defValue);
	float	getFloat(String key, float defValue);
	int	getInt(String key, int defValue);
	long getLong(String key, long defValue);
	String	getString(String key, String defValue);
	
	public interface Editor
	{	
		void apply();
		SharedPreferences.Editor	clear();
		boolean	commit();
		SharedPreferences.Editor	putBoolean(String key, boolean value);
		SharedPreferences.Editor	putFloat(String key, float value);
		SharedPreferences.Editor	putInt(String key, int value);
		SharedPreferences.Editor	putLong(String key, long value);
		SharedPreferences.Editor	putString(String key, String value);
		SharedPreferences.Editor	remove(String key);
	}
}
