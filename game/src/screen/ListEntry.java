package grafl.sy.screens;

public class ListEntry 
{
	public final static int SPACER = 10;
	public final static int SMALL = 25; 
	public final static int MEDIUM = 35; 
	public final static int BIG = 55; 

	public final String text;
	public final int argb;
	public final int id;
	public final int icontile;
	public final int size;
	
	int width;
	int height;
	int textheight;
	
	public ListEntry(String text, int argb, int id, int icontile, int size)
	{
		this.text = text;
		this.argb = argb;
		this.id = id;
		this.icontile = icontile;
		this.size = size;
	}

	public ListEntry(String text, int argb, int id)
	{
		this(text, argb, id, -1, MEDIUM);	
	}
	
	public ListEntry(String text, int id)
	{
		this(text, 0xffffffff, id, -1, MEDIUM);
	}
	

}
