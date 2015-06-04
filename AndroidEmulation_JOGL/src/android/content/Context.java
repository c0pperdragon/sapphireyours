package android.content;

import android.content.res.AssetManager;
import android.content.res.Resources;

public abstract class Context
{
	public abstract AssetManager getAssets();
	public abstract Resources getResources();
}
