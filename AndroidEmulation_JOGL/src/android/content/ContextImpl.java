package android.content;

import android.content.res.AssetManager;
import android.content.res.Resources;

public class ContextImpl extends Context 
{
	private AssetManager assets;
	private Resources resources;
	
	public ContextImpl()
	{
		assets = null;
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
}
