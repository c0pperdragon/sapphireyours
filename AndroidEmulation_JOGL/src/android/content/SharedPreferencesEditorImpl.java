package android.content;

import java.util.Iterator;
import java.util.Vector;


public class SharedPreferencesEditorImpl implements SharedPreferences.Editor
{
	private SharedPreferencesImpl pref;

	private boolean requestclear;
	private Vector<String> changedkeys; 	
	private Vector<Object> changedvalues; 	
	
	public SharedPreferencesEditorImpl(SharedPreferencesImpl pref)
	{
		this.pref = pref;
		
		requestclear = false;
		changedkeys = new Vector<String>();
		changedvalues = new Vector<Object>();
	}


	public void	apply()
	{
	
		// do changes to target object as critical section
		synchronized (pref)
		{	// optional clear operation
			if (requestclear)
			{	Iterator<String> it = pref.keys();
				while (it.hasNext())
				{	it.next();
					it.remove();
				}
			}			
			// write changes in order of appearance
			for (int i=0; i<changedkeys.size(); i++)
			{	String k = changedkeys.elementAt(i);
				Object v = changedvalues.elementAt(i);
				if (v==null || v instanceof String)
				{	pref.put(k,v);				
				}	
				else if (v instanceof Boolean)
				{	pref.put(k, ((Boolean)v).booleanValue());
				}					
				else if (v instanceof Float)
				{	pref.put(k, ((Float)v).floatValue());
				}					
				else if (v instanceof Integer)
				{	pref.put(k, ((Integer)v).intValue());
				}					
				else if (v instanceof Long)
				{	pref.put(k, ((Integer)v).longValue());
				}					
			}		
		}	
		
		// if any changes were made, force a write
		if (requestclear || changedkeys.size()>0)
		{	pref.writeBack();
		}
		
		// clear change requests to make the object re-usable
		requestclear = false;	
		changedkeys.clear();
		changedvalues.clear();
	}

	public SharedPreferences.Editor clear()
	{
		requestclear = true;
		return this;
	}
	
	public boolean commit()
	{
		apply();		
		return true;		// no special error handling, apply will already have written the data
	}
	
	public SharedPreferences.Editor	putBoolean(String key, boolean value)
	{
		changedkeys.addElement(key);
		changedvalues.addElement(new Boolean(value));
		return this;
	}
	
	public SharedPreferences.Editor	putFloat(String key, float value)
	{
		changedkeys.addElement(key);
		changedvalues.addElement(new Float(value));
		return this;
	}
	
	public SharedPreferences.Editor	putInt(String key, int value)
	{
		changedkeys.addElement(key);
		changedvalues.addElement(new Integer(value));
		return this;
	}
	
	public SharedPreferences.Editor	putLong(String key, long value)
	{
		changedkeys.addElement(key);
		changedvalues.addElement(new Long(value));
		return this;
	}
	
	public SharedPreferences.Editor	putString(String key, String value)
	{
		changedkeys.addElement(key);
		changedvalues.addElement(value);
		return this;
	}
	
	public SharedPreferences.Editor	remove(String key)
	{
		putString(key,null);
		return this;
	}


}
