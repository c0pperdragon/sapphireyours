package android.view;

public class KeyEvent extends InputEvent
{
	public final static int ACTION_DOWN	    = 0x00000000;
	public final static int ACTION_MULTIPLE	= 0x00000002;
	public final static int ACTION_UP       = 0x00000001;
	
	public static final int KEYCODE_BACK        = 0x00000004;
	public final static int	KEYCODE_DPAD_UP     = 0x00000013;		
	public final static int	KEYCODE_DPAD_DOWN	= 0x00000014;
	public final static int	KEYCODE_DPAD_LEFT	= 0x00000015;
	public final static int	KEYCODE_DPAD_RIGHT	= 0x00000016;
	public final static int	KEYCODE_DPAD_CENTER	= 0x00000017;
//	public static final int KEYCODE_CTRL_LEFT   = 0x00000071;
//	public static final int KEYCODE_CTRL_RIGHT  = 0x00000072;
	public static final int KEYCODE_SHIFT_LEFT  = 0x0000003b;
	public static final int KEYCODE_SHIFT_RIGHT = 0x0000003c;
	public static final int KEYCODE_TAB         = 0x0000003d;
	public static final int KEYCODE_SPACE       = 0x0000003e;
	public static final int KEYCODE_ENTER       = 0x00000042;
	public static final int KEYCODE_DEL         = 0x00000043;
	public static final int KEYCODE_MENU        = 0x00000052;
	public static final int KEYCODE_SEARCH      = 0x00000054;
//	public static final int KEYCODE_ESCAPE      = 0x0000006f;
	
	public static final int KEYCODE_0   = 7;
	public static final int KEYCODE_1   = 8;
	public static final int KEYCODE_2   = 9;
	public static final int KEYCODE_3   = 10;
	public static final int KEYCODE_4   = 11;
	public static final int KEYCODE_5   = 12;
	public static final int KEYCODE_6   = 13;
	public static final int KEYCODE_7   = 14;
	public static final int KEYCODE_8   = 15;
	public static final int KEYCODE_9   = 16;
	public static final int KEYCODE_A   = 29;
	public static final int KEYCODE_B   = 30;
	public static final int KEYCODE_C   = 31;
	public static final int KEYCODE_D   = 32;
	public static final int KEYCODE_E   = 33;
	public static final int KEYCODE_F   = 34;
	public static final int KEYCODE_G   = 35;
	public static final int KEYCODE_H   = 36;	
	public static final int KEYCODE_I   = 37;
	public static final int KEYCODE_J   = 38;	
	public static final int KEYCODE_K   = 39;
	public static final int KEYCODE_L   = 40;
	public static final int KEYCODE_M   = 41;
	public static final int KEYCODE_N   = 42;
	public static final int KEYCODE_O   = 43;
	public static final int KEYCODE_P   = 44;
	public static final int KEYCODE_Q   = 45;
	public static final int KEYCODE_R   = 46;
	public static final int KEYCODE_S   = 47;
	public static final int KEYCODE_T   = 48;
	public static final int KEYCODE_U   = 49;
	public static final int KEYCODE_V   = 50;
	public static final int KEYCODE_W   = 51;
	public static final int KEYCODE_X   = 52;
	public static final int KEYCODE_Y   = 53;
	public static final int KEYCODE_Z   = 54;
	
	
	private int code;
	private int unicode;
	
	public KeyEvent(int action, int code, int unicode)
	{	
		super(action);	
		this.code = code;
		this.unicode = unicode;
	}
	
	
	public final int getKeyCode ()
	{
		return code;
	}
	
	public final int getUnicodeChar()
	{
		return unicode;
	}
	
	public interface Callback
	{
		boolean	onKeyDown(int keyCode, KeyEvent event);	
		boolean	onKeyLongPress(int keyCode, KeyEvent event);
		boolean	onKeyMultiple(int keyCode, int count, KeyEvent event);
		boolean	onKeyUp(int keyCode, KeyEvent event);
	}
}
