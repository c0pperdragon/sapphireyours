package android.view;

public class MotionEvent extends InputEvent
{
	public static final int ACTION_DOWN = 0;
	public static final int ACTION_UP = 1;
	public static final int ACTION_MOVE = 2;
	public static final int ACTION_CANCEL = 3;
	public static final int ACTION_POINTER_DOWN = 5;
	public static final int ACTION_POINTER_UP   = 6;
	
	private int[] id;
	private float[] x;
	private float[] y;
		
	public MotionEvent(int action, int id, float x, float y)
	{
		super(action);
		this.id = new int[]{id};
		this.x = new float[]{x};
		this.y = new float[]{y};
	}

	public MotionEvent(int action, int id, float x, float y, int id2, float x2, float y2)
	{
		super(action);
		this.id = new int[]{id,id2};
		this.x = new float[]{x,x2};
		this.y = new float[]{y,y2};
	}

	public MotionEvent(int action, int id, float x, float y, int id2, float x2, float y2, int id3, float x3, float y3)
	{
		super(action);
		this.id = new int[]{id,id2,id3};
		this.x = new float[]{x,x2,x3};
		this.y = new float[]{y,y2,y3};
	}
		
	public final int findPointerIndex (int pointerId)
	{
		for (int idx=0; idx<id.length; idx++)
		{	if (id[idx]==pointerId) 
			{	return idx;
			}
		}
		return -1;
	}
	
	public final int getActionMasked()
	{
		return getAction() & 0xff;
	}
	
	public final int getActionIndex()
	{
		return (getAction() & 0x7fffff00) >> 8;
	}
	
	public final int getPointerId(int idx)
	{
		return id[idx];
	}
	
	public final float getX()
	{
		return x[0];
	}
	public final float getY()
	{
		return y[0];
	}

	public final float getX(int index)
	{
		return x[index];
	}
	public final float getY(int index)
	{
		return y[index];
	}
	
	public final int getPointerCount()
	{
		return id.length;
	}
	
	@Override
	public String toString()
	{
		String s = "E"+getAction()+":"+x[0]+","+y[0];
		if (x.length>1)
		{ s = s+ ","+x[1]+","+y[1];
		}
		s = s + "["+getActionMasked()+":"+getActionIndex()+"]";
		return s;
	}
	
}
