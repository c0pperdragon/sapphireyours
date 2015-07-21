package android.opengl;

import java.util.Vector;

import com.jogamp.opengl.GLAutoDrawable;
import com.jogamp.opengl.GLCapabilities;
import com.jogamp.opengl.GLEventListener;
import com.jogamp.opengl.GLProfile;
import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import com.jogamp.newt.event.KeyListener;
import com.jogamp.newt.event.MouseEvent;
import com.jogamp.newt.event.MouseListener;
import com.jogamp.newt.event.WindowEvent;
import com.jogamp.newt.event.WindowListener;
import com.jogamp.newt.event.WindowUpdateEvent;
import com.jogamp.newt.opengl.GLWindow;

import android.content.Context;
import android.view.SurfaceView;
import android.view.MotionEvent;
import android.view.KeyEvent;

public class GLSurfaceView extends SurfaceView
{
	public interface Renderer
	{
	    void onSurfaceCreated(GL10 unused, EGLConfig config);
	    void onSurfaceChanged(GL10 unused, int width, int height);
	    void onDrawFrame(GL10 unused);
	}	
	
	
	public final static int RENDERMODE_WHEN_DIRTY = 0;
	public final static int RENDERMODE_CONTINUOUSLY = 1;

	private GLWindow glWindow;
	private Renderer renderer;
	private int rendermode;
	private boolean hasFocus;

	private Vector<Runnable> queuedEvents;
	private Vector<Runnable> tmpQueue;
	
	public GLSurfaceView(Context context)
	{
		this.renderer = null;
		this.rendermode = RENDERMODE_WHEN_DIRTY;
		this.hasFocus = true;
		queuedEvents = new Vector<Runnable>();
		tmpQueue = new Vector<Runnable>();
	}

	public void setEGLContextClientVersion(int version)
	{
	}
	
	public void setRenderer(Renderer renderer)
	{
		this.renderer = renderer;
	}

	public void setRenderMode(int mode)
	{
		if (rendermode!=mode)
		{	rendermode = mode;
//			if (glWindow!=null)
//			{	updateAnimator();
//			}
		}
	}
	
	public void requestRender()
	{
        if (glWindow!=null) glWindow.display();		
	}
	
	public void queueEvent(Runnable r)
	{
		synchronized (queuedEvents)
		{	queuedEvents.addElement(r);
		}
	}
	
	void processEventQueue()
	{
		tmpQueue.clear();
		synchronized (queuedEvents)
		{	for (int i=0; i<queuedEvents.size(); i++)
			{	tmpQueue.addElement(queuedEvents.elementAt(i));
			}
			queuedEvents.clear();
		}
		for (int i=0; i<tmpQueue.size(); i++)
		{	tmpQueue.elementAt(i).run();
		}
	}
    

	
	public void startWithJOGL(String programTitle)
	{
        GLCapabilities caps = new GLCapabilities(GLProfile.get(GLProfile.GL2));

        glWindow = GLWindow.create(caps);
        glWindow.setTitle(programTitle);
        glWindow.setSize(800,800);
//        glWindow.setUndecorated(true);
        glWindow.setPointerVisible(true);
//        glWindow.setFullscreen(true);
        glWindow.setVisible(true);

        glWindow.addGLEventListener(new MyGLEventListener());
        glWindow.addMouseListener(new MyMouseListener());
        glWindow.addKeyListener(new MyKeyListener());    
        glWindow.addWindowListener(new MyWindowListener());
	}
	
	public void runWithJOGL()
	{
        while (true)    
        {
        	glWindow.display();	
        }
//        updateAnimator();
//
//		for (;;)
//        {	try { Thread.sleep(1000000); } catch (InterruptedException e) {}        
//        }        
	}
/*
	private void updateAnimator()
	{	
		if (!hasFocus)
		{	if (animator!=null)
			{	animator.stop();
			}
			return;
		}		
		if (rendermode==RENDERMODE_WHEN_DIRTY)
		{	if (animator!=null)
			{	animator.stop();
			}
		}
		else
		{	if (animator==null)
			{	animator = new Animator(glWindow);			
			}
			animator.start();
		}
	}
*/	
	
	// inner class to handle the JOGL render notifications
	class MyGLEventListener implements GLEventListener
	{
		Thread gameThread;
		boolean did_dispatch_init;
		int screenwidth;
		int screenheight;
		
		public MyGLEventListener()
		{
			gameThread = Thread.currentThread();
			did_dispatch_init = false;
		}
		
		// --- the GLEventListener interface ---
		@Override
	    public void init(GLAutoDrawable drawable) 
	    {
//System.out.println("init: "+Thread.currentThread().getName());	    
//	    	processEventQueue();
//	        GLES20.gl = drawable.getGL().getGL2();
//	        GLES20.gl.setSwapInterval(1);
//	        renderer.onSurfaceCreated(null,null);
	    }

		@Override
	    public void reshape(GLAutoDrawable drawable, int x, int y, int w, int h)
	    {
//System.out.println("reshape: "+Thread.currentThread().getName());	    
//	    	processEventQueue();
//	    	renderer.onSurfaceChanged(null,w,h);
	    }

		@Override
	    public void display(GLAutoDrawable drawable) 
	    {
	    	// will only react on the display calls that were triggered by the main loop
	    	if (Thread.currentThread() == gameThread)
	    	{
	    		if (!did_dispatch_init)
	    		{
			    	did_dispatch_init = true;	    		

	    			screenwidth = glWindow.getWidth();
	    			screenheight = glWindow.getHeight();
	    		
			        GLES20.gl = drawable.getGL().getGL2();
			        GLES20.gl.setSwapInterval(1);
			        renderer.onSurfaceCreated(null,null);
			    	renderer.onSurfaceChanged(null,screenwidth,screenheight);
	    		}
	    		else
	    		{
					int w = glWindow.getWidth();
					int h = glWindow.getHeight();
					if (screenwidth!=w || screenheight!=h)
					{
						screenwidth = w;
						screenheight = h;
				    	renderer.onSurfaceChanged(null,screenwidth,screenheight);										
					}	    		
	    		}
		    	processEventQueue();
		    	renderer.onDrawFrame(null);
	    	}
//System.out.println("display: "+Thread.currentThread().getName());	    
//	    	processEventQueue();
//	    	renderer.onDrawFrame(null);
	    }

		@Override
	    public void dispose(GLAutoDrawable drawable)
	    {
System.out.println("dispose: "+Thread.currentThread().getName());	    
	        onPause();
//	    	processEventQueue();
	        System.exit(0);
	    }	
	}

	// inner class to handle the JOGL input event notifications
	class MyMouseListener implements MouseListener
	{
		public void	mouseClicked(MouseEvent e) 
		{}
		public void	mouseDragged(MouseEvent e)
		{
//System.out.println("mouseDragged: "+Thread.currentThread().getName());	    
			onTouchEvent(new MotionEvent(MotionEvent.ACTION_MOVE, 0, e.getX(), e.getY()));
		}
		public void	mouseEntered(MouseEvent e)
		{}
		public void	mouseExited(MouseEvent e) 
		{}
		public void	mouseMoved(MouseEvent e) 
		{}
		public void	mousePressed(MouseEvent e) 
		{
//System.out.println("mousePressed: "+Thread.currentThread().getName());	    
			onTouchEvent(new MotionEvent(MotionEvent.ACTION_DOWN, 0, e.getX(), e.getY()));			
		}
		public void	mouseReleased(MouseEvent e) 
		{
//System.out.println("mouseReleased: "+Thread.currentThread().getName());	    
			onTouchEvent(new MotionEvent(MotionEvent.ACTION_UP, 0, e.getX(), e.getY()));			
		}
		public void	mouseWheelMoved(MouseEvent e)
		{
//			// determine direction of wheel 
//			float r[]= e.getRotation();
//			float dir = r[0]+r[1]+r[2];
//			if (dir==0) return;
//			
//			// compute values for the pinch dependent on zoom-in or zoom-out
//			float x = e.getX();
//			float y = e.getY();
//			float dy1 = windowHeight*0.25f;
//			float dy2 = (dir>0) ? dy1*1.5f : dy1/1.5f;
//			
//			// simulate a pinch-gesture
//			onTouchEvent(new MotionEvent(MotionEvent.ACTION_DOWN, x,y-dy1));
//			onTouchEvent(new MotionEvent(MotionEvent.ACTION_POINTER_DOWN+256, x,y-dy1, x,y+dy1));
//			onTouchEvent(new MotionEvent(MotionEvent.ACTION_MOVE,x,y-dy2, x,y+dy2));
//			onTouchEvent(new MotionEvent(MotionEvent.ACTION_POINTER_UP+256, x,y-dy2, x,y+dy2));
//			onTouchEvent(new MotionEvent(MotionEvent.ACTION_UP, x,y-dy2));
		}		
	}

	// inner class to handle the JOGL key event notifications
	class MyKeyListener implements KeyListener
	{
	 	public void	keyPressed(com.jogamp.newt.event.KeyEvent e)
 		{	
//System.out.println("keyPressed: "+Thread.currentThread().getName());	    
 			int code = translateKeyCode(e.getKeyCode());
 			onKeyDown(code, new KeyEvent(KeyEvent.ACTION_DOWN,translateKeyCode(e.getKeyCode()), e.getKeyChar()));
 			
 			// handle JOGL-specific key actions
 			if (e.getKeyCode()==com.jogamp.newt.event.KeyEvent.VK_F11)
 			{
 				glWindow.setFullscreen(!glWindow.isFullscreen());
 			} 			
 		} 
           
 		public void	keyReleased(com.jogamp.newt.event.KeyEvent e)
 		{
//System.out.println("keyReleased: "+Thread.currentThread().getName());	    
 			// ignore events caused by auto-repeat
 			if ((e.getModifiers() & com.jogamp.newt.event.InputEvent.AUTOREPEAT_MASK) != 0)
 			{	return;
 			}

 			int code = translateKeyCode(e.getKeyCode());
 			onKeyUp(code, new KeyEvent(KeyEvent.ACTION_UP,translateKeyCode(e.getKeyCode()), e.getKeyChar())); 			
 		} 
           
 		public void	keyTyped(com.jogamp.newt.event.KeyEvent e)
 		{
 		}
 		
 		private int translateKeyCode(int joglcode)
 		{	
 			switch (joglcode)
 			{	case com.jogamp.newt.event.KeyEvent.VK_LEFT:	
 					return KeyEvent.KEYCODE_DPAD_LEFT;
 				case com.jogamp.newt.event.KeyEvent.VK_RIGHT:	
 					return KeyEvent.KEYCODE_DPAD_RIGHT;
 				case com.jogamp.newt.event.KeyEvent.VK_UP:	
 					return KeyEvent.KEYCODE_DPAD_UP;
 				case com.jogamp.newt.event.KeyEvent.VK_DOWN:	
 					return KeyEvent.KEYCODE_DPAD_DOWN;
 				case com.jogamp.newt.event.KeyEvent.VK_SHIFT:
 					return KeyEvent.KEYCODE_SHIFT_LEFT;
 				case com.jogamp.newt.event.KeyEvent.VK_CONTROL:
 					return 0x00000071;  // CTRL_LEFT
 				case com.jogamp.newt.event.KeyEvent.VK_TAB:
					return KeyEvent.KEYCODE_TAB;
 				case com.jogamp.newt.event.KeyEvent.VK_ENTER:
					return KeyEvent.KEYCODE_ENTER;
 				case com.jogamp.newt.event.KeyEvent.VK_ESCAPE:
					return 0x0000006f;   // ESCAPE
 				case com.jogamp.newt.event.KeyEvent.VK_SPACE:
					return KeyEvent.KEYCODE_SPACE;
 				case com.jogamp.newt.event.KeyEvent.VK_DELETE:
 				case com.jogamp.newt.event.KeyEvent.VK_BACK_SPACE:
					return KeyEvent.KEYCODE_DEL;
 				case com.jogamp.newt.event.KeyEvent.VK_CONTEXT_MENU:
					return KeyEvent.KEYCODE_MENU;
 					 				
 				default: 
 					if (joglcode>='A' && joglcode<='Z') 
 					{	return KeyEvent.KEYCODE_A + (joglcode-'A');
 					}
 					if (joglcode>='0' && joglcode<='9')
 					{	return KeyEvent.KEYCODE_0 + (joglcode-'0');
 					}	
 			}
 			return 0; 			
 		}
	}

	// inner class to handle the JOGL window event notifications
	class MyWindowListener implements WindowListener
	{
		public void	windowDestroyed(WindowEvent e){}
		public void	windowDestroyNotify(WindowEvent e){}
		public void	windowGainedFocus(WindowEvent e)
		{
			hasFocus = true;
//			updateAnimator();
		}
		public void	windowLostFocus(WindowEvent e)
		{
			hasFocus = false;
//			updateAnimator();
		}
		public void	windowMoved(WindowEvent e){}
		public void	windowRepaint(WindowUpdateEvent e){}
		public void	windowResized(WindowEvent e){}
	}
	
	

}
