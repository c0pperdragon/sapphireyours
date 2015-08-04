package grafl.sy.screens;

import android.os.SystemClock;
import android.view.KeyEvent;
import grafl.sy.buttons.BackButton;
import grafl.sy.buttons.ButtonSet;
import grafl.sy.game.Game;
import grafl.sy.renderer.TextRenderer;
import grafl.sy.renderer.VectorRenderer;

public class TextInputDialog extends Screen
{
    interface Listener {
    	void valueChanged(String value);
    }


	String prompt;
	String text;
	Listener listener;
	
	int dialogx;
	int dialogy;
	int dialogwidth;
	int dialogheight;
	
	ButtonSet buttons;
	String[] lines;


	public TextInputDialog(Game game, String prompt, String text, Listener listener)
	{
		super(game);
		this.prompt = prompt;
		this.text = text;	
		this.listener = listener;
		this.lines = new String[0];							
	}
	
	@Override
	public void resize(int width, int height)
	{
		super.resize(width,height);
		layout();
	}

	@Override
	public boolean isOverlay()
	{	return true;
	}
	


	public void draw()
	{
		drawOrLayout(true);
	}
	
	public void layout()
	{
		drawOrLayout(false);
	}
	
	private void drawOrLayout(boolean draw)
	{
		float scaling = game.detailScale;		
		float th = 27*scaling;
		float lspace = 5*scaling; 
		int border = (int) (15*scaling);				
		 
		VectorRenderer vr = game.vectorRenderer;				
		TextRenderer tr = game.textRenderer;				

		// layout depends on menu width which depends on the screen size
		dialogwidth = Math.min(350, screenwidth);					
		dialogx = (screenwidth-dialogwidth)/2;
		int col = 0xff000000;
		int bgcolor = 0xffbbbbbb;
		int labelx = dialogx + border;
//		int valuex = dialogx+dialogwidth-dialogwidth/3;
		int y = dialogy+border;	 // when painting from top to bottom increase y position
				
		// at first call or after size change, initialize buttons
		if (!draw)		
		{	
			buttons = new ButtonSet(false);
			lines = tr.wordWrap(text.toString(), th, dialogwidth-30*scaling);
			if (lines.length==0)
			{	lines = new String[]{""};
			}
		}
		// when in drawing mode, initialize renderers and draw background and all buttons
		else
		{	vr.startDrawing (screenwidth, screenheight);
			tr.startDrawing (screenwidth, screenheight);		
			vr.addRoundedRect(dialogx,dialogy,dialogwidth,dialogheight, 20*scaling, 20*scaling+1, bgcolor);
			buttons.draw(vr);
		}
	
	
		// add prompt
		if (draw)
		{
			tr.addString (prompt, labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
		}		
		y += th +lspace;
		
		// add current text
		for (int i=0; i<lines.length; i++)
		{
			if (draw)
			{	float endx = tr.addString (lines[i], labelx, y, th, false, col, TextRenderer.WEIGHT_BOLD);
				if (i==lines.length-1 && ((SystemClock.uptimeMillis()/400)&0x1) != 0)
				{
					vr.addRectangle(endx,y,2,th, col); 
				}
			}
			y += th;
		}		

		
//		// compute place for exit button
//		y += lspace;
//		int exitbuttony = y-dialogy;
//		y += th;
		
		
		if (!draw)
		{
			// compute the dialog size for subsequent paints
			y+= border;
			dialogheight = y - dialogy;
			dialogy = screenheight/2 - dialogheight/2; 		
						
			// add exit button
			buttons.add(
				new BackButton(game, dialogx+dialogwidth-border-th, dialogy+border, th,th,
				 	new Runnable(){public void run(){ game.removeScreen();}}
			));			
		}
		else
		{	// flush everything to screen
			vr.flush();
			tr.flush();
		}
	}
	
    @Override
	public void onPointerDown(int x, int y)
	{	
		buttons.onPointerDown(x,y);		
	}
    @Override
	public void onPointerUp()
	{
		buttons.onPointerUp();		
	}
    @Override
	public void onPointerMove(int x, int y)
	{	
		buttons.onPointerMove(x,y);		
	}
	@Override	
    public void handleKeyEvent(KeyEvent event)
    {
		if (event.getAction()==KeyEvent.ACTION_DOWN)
		{
			if (event.getKeyCode()==KeyEvent.KEYCODE_DEL)
			{	if (text.length()>0)
				{	text = text.substring(0, text.length()-1);		
					layout();				
					listener.valueChanged(text);
				}
				return;
			}
			if (event.getKeyCode()==KeyEvent.KEYCODE_ENTER)
			{	
				game.removeScreen();
				return;
			}
			
			int unicode = event.getUnicodeChar();
			if (unicode>0)
			{
				text = text + ((char) unicode);
				layout();
				listener.valueChanged(text);
				return;			
			}
		}
    
//		buttons.handleKeyEvent(event);    
    }
    
	
}
